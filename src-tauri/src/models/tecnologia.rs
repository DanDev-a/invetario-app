use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tecnologia {
    pub id: i64,
    pub nombre: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTecnologia {
    pub nombre: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTecnologia {
    pub id: i64,
    pub nombre: String,
}
