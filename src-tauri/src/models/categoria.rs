use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Categoria {
    pub id: i64,
    pub nombre: String,
    pub descripcion: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategoria {
    pub nombre: String,
    pub descripcion: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategoria {
    pub id: i64,
    pub nombre: String,
    pub descripcion: String,
}
