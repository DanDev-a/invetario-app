use tauri::State;

use crate::db::DbState;
use crate::models::{Cliente, CreateCliente, UpdateCliente};

#[tauri::command]
pub fn list_clientes(state: State<'_, DbState>) -> Result<Vec<Cliente>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, nombre, telefono, direccion, created_at FROM clientes ORDER BY nombre")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(Cliente {
                id: row.get(0)?,
                nombre: row.get(1)?,
                telefono: row.get(2)?,
                direccion: row.get(3)?,
                created_at: row.get(4)?,
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
pub fn create_cliente(state: State<'_, DbState>, data: CreateCliente) -> Result<Cliente, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO clientes (nombre, telefono, direccion) VALUES (?1, ?2, ?3)",
        rusqlite::params![data.nombre, data.telefono, data.direccion],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    conn.query_row(
        "SELECT id, nombre, telefono, direccion, created_at FROM clientes WHERE id = ?1",
        [id],
        |row| {
            Ok(Cliente {
                id: row.get(0)?,
                nombre: row.get(1)?,
                telefono: row.get(2)?,
                direccion: row.get(3)?,
                created_at: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_cliente(state: State<'_, DbState>, data: UpdateCliente) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE clientes SET nombre = ?1, telefono = ?2, direccion = ?3 WHERE id = ?4",
        rusqlite::params![data.nombre, data.telefono, data.direccion, data.id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_cliente(state: State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM clientes WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
