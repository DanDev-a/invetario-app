use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MovimientoStockConProducto {
    pub id: i64,
    pub producto_id: i64,
    pub producto_nombre: String,
    pub tipo: String,
    pub cantidad: i64,
    pub referencia_id: Option<i64>,
    pub referencia_tipo: String,
    pub created_at: String,
}
