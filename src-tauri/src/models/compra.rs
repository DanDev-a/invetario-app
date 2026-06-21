use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetalleCompraConProducto {
    pub id: i64,
    pub compra_id: i64,
    pub producto_id: i64,
    pub producto_nombre: String,
    pub cantidad: i64,
    pub precio_unitario: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Compra {
    pub id: i64,
    pub proveedor_id: Option<i64>,
    pub fecha: String,
    pub total: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CompraConRelaciones {
    pub id: i64,
    pub proveedor_id: Option<i64>,
    pub proveedor_nombre: Option<String>,
    pub fecha: String,
    pub total: f64,
    pub created_at: String,
    pub detalles: Vec<DetalleCompraConProducto>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCompra {
    pub proveedor_id: Option<i64>,
    pub fecha: String,
    pub detalles: Vec<CreateDetalleCompra>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDetalleCompra {
    pub producto_id: i64,
    pub cantidad: i64,
    pub precio_unitario: f64,
}
