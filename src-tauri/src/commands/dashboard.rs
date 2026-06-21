use serde::Serialize;
use tauri::State;

use crate::db::DbState;
use crate::models::MovimientoStockConProducto;

#[derive(Debug, Serialize)]
pub struct DashboardData {
    pub total_productos: i64,
    pub stock_bajo: Vec<StockBajoItem>,
    pub ultimos_movimientos: Vec<MovimientoStockConProducto>,
    pub total_ventas_hoy: f64,
    pub total_compras_hoy: f64,
}

#[derive(Debug, Serialize)]
pub struct StockBajoItem {
    pub id: i64,
    pub nombre: String,
    pub stock_actual: i64,
    pub stock_minimo: i64,
}

#[tauri::command]
pub fn get_dashboard(state: State<'_, DbState>) -> Result<DashboardData, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;

    let total_productos: i64 = conn
        .query_row("SELECT COUNT(*) FROM productos", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, nombre, stock_actual, stock_minimo
             FROM productos
             WHERE stock_minimo > 0 AND stock_actual <= stock_minimo
             ORDER BY (stock_minimo - stock_actual) DESC",
        )
        .map_err(|e| e.to_string())?;

    let stock_bajo: Vec<StockBajoItem> = stmt
        .query_map([], |row| {
            Ok(StockBajoItem {
                id: row.get(0)?,
                nombre: row.get(1)?,
                stock_actual: row.get(2)?,
                stock_minimo: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let mut stmt = conn
        .prepare(
            "SELECT m.id, m.producto_id, p.nombre, m.tipo, m.cantidad,
                    m.referencia_id, m.referencia_tipo, m.created_at
             FROM movimientos_stock m
             JOIN productos p ON m.producto_id = p.id
             ORDER BY m.created_at DESC
             LIMIT 20",
        )
        .map_err(|e| e.to_string())?;

    let ultimos_movimientos: Vec<MovimientoStockConProducto> = stmt
        .query_map([], |row| {
            Ok(MovimientoStockConProducto {
                id: row.get(0)?,
                producto_id: row.get(1)?,
                producto_nombre: row.get(2)?,
                tipo: row.get(3)?,
                cantidad: row.get(4)?,
                referencia_id: row.get(5)?,
                referencia_tipo: row.get(6)?,
                created_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let total_ventas_hoy: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(total), 0) FROM ventas WHERE date(fecha) = date('now')",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let total_compras_hoy: f64 = conn
        .query_row(
            "SELECT COALESCE(SUM(total), 0) FROM compras WHERE date(fecha) = date('now')",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(DashboardData {
        total_productos,
        stock_bajo,
        ultimos_movimientos,
        total_ventas_hoy,
        total_compras_hoy,
    })
}
