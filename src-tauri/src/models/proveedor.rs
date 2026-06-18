use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Proveedor {
    pub id: i64,
    pub nombre: String,
    pub contacto: String,
    pub telefono: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateProveedor {
    pub nombre: String,
    pub contacto: String,
    pub telefono: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProveedor {
    pub id: i64,
    pub nombre: String,
    pub contacto: String,
    pub telefono: String,
}
