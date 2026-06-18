use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetalleVenta {
    pub id: i64,
    pub venta_id: i64,
    pub producto_id: i64,
    pub cantidad: i64,
    pub precio_unitario: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetalleVentaConProducto {
    pub id: i64,
    pub venta_id: i64,
    pub producto_id: i64,
    pub producto_nombre: String,
    pub cantidad: i64,
    pub precio_unitario: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Venta {
    pub id: i64,
    pub cliente_id: Option<i64>,
    pub fecha: String,
    pub total: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VentaConRelaciones {
    pub id: i64,
    pub cliente_id: Option<i64>,
    pub cliente_nombre: Option<String>,
    pub fecha: String,
    pub total: f64,
    pub created_at: String,
    pub detalles: Vec<DetalleVentaConProducto>,
}

#[derive(Debug, Deserialize)]
pub struct CreateVenta {
    pub cliente_id: Option<i64>,
    pub fecha: String,
    pub detalles: Vec<CreateDetalleVenta>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDetalleVenta {
    pub producto_id: i64,
    pub cantidad: i64,
    pub precio_unitario: f64,
}
