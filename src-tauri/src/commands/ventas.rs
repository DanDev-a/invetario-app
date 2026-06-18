use tauri::State;

use crate::db::DbState;
use crate::models::{
    CreateVenta, DetalleVentaConProducto, Venta, VentaConRelaciones,
};

#[tauri::command]
pub fn list_ventas(state: State<'_, DbState>) -> Result<Vec<VentaConRelaciones>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT v.id, v.cliente_id, cl.nombre AS cliente_nombre, v.fecha, v.total, v.created_at
             FROM ventas v
             LEFT JOIN clientes cl ON v.cliente_id = cl.id
             ORDER BY v.created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let ventas_rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, Option<i64>>(1)?,
                row.get::<_, Option<String>>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, f64>(4)?,
                row.get::<_, String>(5)?,
            ))
        })
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();
    for row in ventas_rows {
        let (id, cliente_id, cliente_nombre, fecha, total, created_at) =
            row.map_err(|e| e.to_string())?;

        let mut det_stmt = conn
            .prepare(
                "SELECT dv.id, dv.venta_id, dv.producto_id, p.nombre, dv.cantidad, dv.precio_unitario
                 FROM detalles_venta dv
                 JOIN productos p ON dv.producto_id = p.id
                 WHERE dv.venta_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let det_rows = det_stmt
            .query_map([id], |row| {
                Ok(DetalleVentaConProducto {
                    id: row.get(0)?,
                    venta_id: row.get(1)?,
                    producto_id: row.get(2)?,
                    producto_nombre: row.get(3)?,
                    cantidad: row.get(4)?,
                    precio_unitario: row.get(5)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut detalles = Vec::new();
        for d in det_rows {
            detalles.push(d.map_err(|e| e.to_string())?);
        }

        result.push(VentaConRelaciones {
            id,
            cliente_id,
            cliente_nombre,
            fecha,
            total,
            created_at,
            detalles,
        });
    }

    Ok(result)
}

#[tauri::command]
pub fn create_venta(state: State<'_, DbState>, data: CreateVenta) -> Result<Venta, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("BEGIN TRANSACTION", []).map_err(|e| e.to_string())?;

    let result = (|| -> Result<Venta, String> {
        let total: f64 = data
            .detalles
            .iter()
            .map(|d| d.cantidad as f64 * d.precio_unitario)
            .sum();

        conn.execute(
            "INSERT INTO ventas (cliente_id, fecha, total) VALUES (?1, ?2, ?3)",
            rusqlite::params![data.cliente_id, data.fecha, total],
        )
        .map_err(|e| e.to_string())?;

        let venta_id = conn.last_insert_rowid();

        for detalle in &data.detalles {
            conn.execute(
                "INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario)
                 VALUES (?1, ?2, ?3, ?4)",
                rusqlite::params![venta_id, detalle.producto_id, detalle.cantidad, detalle.precio_unitario],
            )
            .map_err(|e| e.to_string())?;

            conn.execute(
                "UPDATE productos SET stock_actual = stock_actual - ?1 WHERE id = ?2 AND stock_actual >= ?1",
                rusqlite::params![detalle.cantidad, detalle.producto_id],
            )
            .map_err(|e| e.to_string())?;

            let changes = conn.changes();
            if changes == 0 {
                return Err(format!(
                    "Stock insuficiente para producto ID {}",
                    detalle.producto_id
                ));
            }

            conn.execute(
                "INSERT INTO movimientos_stock (producto_id, tipo, cantidad, referencia_id, referencia_tipo)
                 VALUES (?1, 'SALIDA', ?2, ?3, 'VENTA')",
                rusqlite::params![detalle.producto_id, detalle.cantidad, venta_id],
            )
            .map_err(|e| e.to_string())?;
        }

        conn.query_row(
            "SELECT id, cliente_id, fecha, total, created_at FROM ventas WHERE id = ?1",
            [venta_id],
            |row| {
                Ok(Venta {
                    id: row.get(0)?,
                    cliente_id: row.get(1)?,
                    fecha: row.get(2)?,
                    total: row.get(3)?,
                    created_at: row.get(4)?,
                })
            },
        )
        .map_err(|e| e.to_string())
    })();

    match &result {
        Ok(_) => conn.execute("COMMIT", []).map_err(|e| e.to_string())?,
        Err(_) => conn.execute("ROLLBACK", []).map_err(|e| e.to_string())?,
    }

    result
}
