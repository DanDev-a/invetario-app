use tauri::State;

use crate::db::DbState;
use crate::models::{
    Compra, CompraConRelaciones, CreateCompra, DetalleCompraConProducto,
};

#[tauri::command]
pub fn list_compras(state: State<'_, DbState>) -> Result<Vec<CompraConRelaciones>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT c.id, c.proveedor_id, p.nombre AS proveedor_nombre, c.fecha, c.total, c.created_at
             FROM compras c
             LEFT JOIN proveedores p ON c.proveedor_id = p.id
             ORDER BY c.created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let compras_rows = stmt
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
    for row in compras_rows {
        let (id, proveedor_id, proveedor_nombre, fecha, total, created_at) =
            row.map_err(|e| e.to_string())?;

        let mut det_stmt = conn
            .prepare(
                "SELECT dc.id, dc.compra_id, dc.producto_id, p.nombre, dc.cantidad, dc.precio_unitario
                 FROM detalles_compra dc
                 JOIN productos p ON dc.producto_id = p.id
                 WHERE dc.compra_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let det_rows = det_stmt
            .query_map([id], |row| {
                Ok(DetalleCompraConProducto {
                    id: row.get(0)?,
                    compra_id: row.get(1)?,
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

        result.push(CompraConRelaciones {
            id,
            proveedor_id,
            proveedor_nombre,
            fecha,
            total,
            created_at,
            detalles,
        });
    }

    Ok(result)
}

#[tauri::command]
pub fn create_compra(state: State<'_, DbState>, data: CreateCompra) -> Result<Compra, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("BEGIN TRANSACTION", []).map_err(|e| e.to_string())?;

    let result = (|| -> Result<Compra, String> {
        let total: f64 = data
            .detalles
            .iter()
            .map(|d| d.cantidad as f64 * d.precio_unitario)
            .sum();

        conn.execute(
            "INSERT INTO compras (proveedor_id, fecha, total) VALUES (?1, ?2, ?3)",
            rusqlite::params![data.proveedor_id, data.fecha, total],
        )
        .map_err(|e| e.to_string())?;

        let compra_id = conn.last_insert_rowid();

        for detalle in &data.detalles {
            conn.execute(
                "INSERT INTO detalles_compra (compra_id, producto_id, cantidad, precio_unitario)
                 VALUES (?1, ?2, ?3, ?4)",
                rusqlite::params![compra_id, detalle.producto_id, detalle.cantidad, detalle.precio_unitario],
            )
            .map_err(|e| e.to_string())?;

            conn.execute(
                "UPDATE productos SET stock_actual = stock_actual + ?1 WHERE id = ?2",
                rusqlite::params![detalle.cantidad, detalle.producto_id],
            )
            .map_err(|e| e.to_string())?;

            conn.execute(
                "INSERT INTO movimientos_stock (producto_id, tipo, cantidad, referencia_id, referencia_tipo)
                 VALUES (?1, 'ENTRADA', ?2, ?3, 'COMPRA')",
                rusqlite::params![detalle.producto_id, detalle.cantidad, compra_id],
            )
            .map_err(|e| e.to_string())?;
        }

        conn.query_row(
            "SELECT id, proveedor_id, fecha, total, created_at FROM compras WHERE id = ?1",
            [compra_id],
            |row| {
                Ok(Compra {
                    id: row.get(0)?,
                    proveedor_id: row.get(1)?,
                    fecha: row.get(2)?,
                    total: row.get(3)?,
                    created_at: row.get(4)?,
                })
            },
        )
        .map_err(|e| e.to_string())
    })();

    let _ = match &result {
        Ok(_) => conn.execute("COMMIT", []),
        Err(_) => conn.execute("ROLLBACK", []),
    };

    result
}
