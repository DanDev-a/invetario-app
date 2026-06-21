use tauri::State;

use crate::db::DbState;
use crate::models::{
    CreateProducto, Producto, ProductoConCategoria, UpdateProducto,
};

#[tauri::command]
pub fn list_productos(
    state: State<'_, DbState>,
    search: Option<String>,
) -> Result<Vec<ProductoConCategoria>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(q) = search {
        let q = format!("%{}%", q);
        (
            "SELECT p.id, p.nombre, p.marca, p.pulgadas,
                    p.resolucion_id, r.nombre AS resolucion_nombre,
                    p.tecnologia_id, t.nombre AS tecnologia_nombre,
                    p.precio_compra, p.precio_venta, p.stock_actual, p.stock_minimo,
                    p.categoria_id, c.nombre AS categoria_nombre, p.created_at
             FROM productos p
             LEFT JOIN categorias c ON p.categoria_id = c.id
             LEFT JOIN tecnologias t ON p.tecnologia_id = t.id
             LEFT JOIN resoluciones r ON p.resolucion_id = r.id
             WHERE p.nombre LIKE ?1 OR p.marca LIKE ?1
             ORDER BY p.nombre".to_string(),
            vec![Box::new(q)],
        )
    } else {
        (
            "SELECT p.id, p.nombre, p.marca, p.pulgadas,
                    p.resolucion_id, r.nombre AS resolucion_nombre,
                    p.tecnologia_id, t.nombre AS tecnologia_nombre,
                    p.precio_compra, p.precio_venta, p.stock_actual, p.stock_minimo,
                    p.categoria_id, c.nombre AS categoria_nombre, p.created_at
             FROM productos p
             LEFT JOIN categorias c ON p.categoria_id = c.id
             LEFT JOIN tecnologias t ON p.tecnologia_id = t.id
             LEFT JOIN resoluciones r ON p.resolucion_id = r.id
             ORDER BY p.nombre".to_string(),
            vec![],
        )
    };

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(ProductoConCategoria {
                id: row.get(0)?,
                nombre: row.get(1)?,
                marca: row.get(2)?,
                pulgadas: row.get(3)?,
                resolucion_id: row.get(4)?,
                resolucion_nombre: row.get(5)?,
                tecnologia_id: row.get(6)?,
                tecnologia_nombre: row.get(7)?,
                precio_compra: row.get(8)?,
                precio_venta: row.get(9)?,
                stock_actual: row.get(10)?,
                stock_minimo: row.get(11)?,
                categoria_id: row.get(12)?,
                categoria_nombre: row.get(13)?,
                created_at: row.get(14)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();
    for row in rows {
        result.push(row.map_err(|e| e.to_string())?);
    }
    Ok(result)
}

#[tauri::command]
pub fn get_producto(state: State<'_, DbState>, id: i64) -> Result<Producto, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT id, nombre, marca, pulgadas,
                resolucion_id, tecnologia_id,
                precio_compra, precio_venta, stock_actual, stock_minimo,
                categoria_id, created_at
         FROM productos WHERE id = ?1",
        [id],
        |row| {
            Ok(Producto {
                id: row.get(0)?,
                nombre: row.get(1)?,
                marca: row.get(2)?,
                pulgadas: row.get(3)?,
                resolucion_id: row.get(4)?,
                tecnologia_id: row.get(5)?,
                precio_compra: row.get(6)?,
                precio_venta: row.get(7)?,
                stock_actual: row.get(8)?,
                stock_minimo: row.get(9)?,
                categoria_id: row.get(10)?,
                created_at: row.get(11)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_producto(
    state: State<'_, DbState>,
    data: CreateProducto,
) -> Result<Producto, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO productos (nombre, marca, pulgadas, resolucion_id, tecnologia_id,
                                precio_compra, precio_venta, stock_actual, stock_minimo, categoria_id)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        rusqlite::params![
            data.nombre,
            data.marca,
            data.pulgadas,
            data.resolucion_id,
            data.tecnologia_id,
            data.precio_compra,
            data.precio_venta,
            data.stock_actual,
            data.stock_minimo,
            data.categoria_id,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    if data.stock_actual > 0 {
        conn.execute(
            "INSERT INTO movimientos_stock (producto_id, tipo, cantidad, referencia_tipo)
             VALUES (?1, 'ENTRADA', ?2, 'INICIAL')",
            rusqlite::params![id, data.stock_actual],
        )
        .map_err(|e| e.to_string())?;
    }

    conn.query_row(
        "SELECT id, nombre, marca, pulgadas,
                resolucion_id, tecnologia_id,
                precio_compra, precio_venta, stock_actual, stock_minimo,
                categoria_id, created_at
         FROM productos WHERE id = ?1",
        [id],
        |row| {
            Ok(Producto {
                id: row.get(0)?,
                nombre: row.get(1)?,
                marca: row.get(2)?,
                pulgadas: row.get(3)?,
                resolucion_id: row.get(4)?,
                tecnologia_id: row.get(5)?,
                precio_compra: row.get(6)?,
                precio_venta: row.get(7)?,
                stock_actual: row.get(8)?,
                stock_minimo: row.get(9)?,
                categoria_id: row.get(10)?,
                created_at: row.get(11)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_producto(state: State<'_, DbState>, data: UpdateProducto) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE productos SET nombre = ?1, marca = ?2, pulgadas = ?3,
                              resolucion_id = ?4, tecnologia_id = ?5,
                              precio_compra = ?6, precio_venta = ?7,
                              stock_actual = ?8, stock_minimo = ?9, categoria_id = ?10
         WHERE id = ?11",
        rusqlite::params![
            data.nombre,
            data.marca,
            data.pulgadas,
            data.resolucion_id,
            data.tecnologia_id,
            data.precio_compra,
            data.precio_venta,
            data.stock_actual,
            data.stock_minimo,
            data.categoria_id,
            data.id,
        ],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_producto(state: State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM movimientos_stock WHERE producto_id = ?1", [id])
        .map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM productos WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
