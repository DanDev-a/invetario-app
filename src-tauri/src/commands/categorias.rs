use tauri::State;

use crate::db::DbState;
use crate::models::{Categoria, CreateCategoria, UpdateCategoria};

#[tauri::command]
pub fn list_categorias(state: State<'_, DbState>) -> Result<Vec<Categoria>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, nombre, descripcion, created_at FROM categorias ORDER BY nombre")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(Categoria {
                id: row.get(0)?,
                nombre: row.get(1)?,
                descripcion: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut result = Vec::new();
    for row in rows {
        result.push(row.map_err(|e| e.to_string())?);
    }
    Ok(result)
}

#[tauri::command]
pub fn create_categoria(state: State<'_, DbState>, data: CreateCategoria) -> Result<Categoria, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO categorias (nombre, descripcion) VALUES (?1, ?2)",
        rusqlite::params![data.nombre, data.descripcion],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    let mut stmt = conn
        .prepare("SELECT id, nombre, descripcion, created_at FROM categorias WHERE id = ?1")
        .map_err(|e| e.to_string())?;
    stmt.query_row([id], |row| {
        Ok(Categoria {
            id: row.get(0)?,
            nombre: row.get(1)?,
            descripcion: row.get(2)?,
            created_at: row.get(3)?,
        })
    })
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_categoria(state: State<'_, DbState>, data: UpdateCategoria) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE categorias SET nombre = ?1, descripcion = ?2 WHERE id = ?3",
        rusqlite::params![data.nombre, data.descripcion, data.id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_categoria(state: State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM categorias WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
