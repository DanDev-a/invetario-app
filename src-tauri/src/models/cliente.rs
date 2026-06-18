use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Cliente {
    pub id: i64,
    pub nombre: String,
    pub telefono: String,
    pub direccion: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCliente {
    pub nombre: String,
    pub telefono: String,
    pub direccion: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCliente {
    pub id: i64,
    pub nombre: String,
    pub telefono: String,
    pub direccion: String,
}
