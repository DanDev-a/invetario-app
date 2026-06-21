use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Producto {
    pub id: i64,
    pub nombre: String,
    pub marca: String,
    pub pulgadas: Option<f64>,
    pub resolucion_id: Option<i64>,
    pub tecnologia_id: Option<i64>,
    pub precio_compra: f64,
    pub precio_venta: f64,
    pub stock_actual: i64,
    pub stock_minimo: i64,
    pub categoria_id: Option<i64>,
    pub observaciones: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductoConCategoria {
    pub id: i64,
    pub nombre: String,
    pub marca: String,
    pub pulgadas: Option<f64>,
    pub resolucion_id: Option<i64>,
    pub resolucion_nombre: Option<String>,
    pub tecnologia_id: Option<i64>,
    pub tecnologia_nombre: Option<String>,
    pub precio_compra: f64,
    pub precio_venta: f64,
    pub stock_actual: i64,
    pub stock_minimo: i64,
    pub categoria_id: Option<i64>,
    pub categoria_nombre: Option<String>,
    pub observaciones: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateProducto {
    pub nombre: String,
    pub marca: String,
    pub pulgadas: Option<f64>,
    pub resolucion_id: Option<i64>,
    pub tecnologia_id: Option<i64>,
    pub precio_compra: f64,
    pub precio_venta: f64,
    pub stock_actual: i64,
    pub stock_minimo: i64,
    pub categoria_id: Option<i64>,
    pub observaciones: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProducto {
    pub id: i64,
    pub nombre: String,
    pub marca: String,
    pub pulgadas: Option<f64>,
    pub resolucion_id: Option<i64>,
    pub tecnologia_id: Option<i64>,
    pub precio_compra: f64,
    pub precio_venta: f64,
    pub stock_actual: i64,
    pub stock_minimo: i64,
    pub categoria_id: Option<i64>,
    pub observaciones: Option<String>,
}
