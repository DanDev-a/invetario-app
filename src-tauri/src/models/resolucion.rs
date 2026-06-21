use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Resolucion {
    pub id: i64,
    pub nombre: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateResolucion {
    pub nombre: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateResolucion {
    pub id: i64,
    pub nombre: String,
}
