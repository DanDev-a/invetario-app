use tauri::State;

use crate::db::DbState;
use crate::models::{CreateProveedor, Proveedor, UpdateProveedor};

#[tauri::command]
pub fn list_proveedores(state: State<'_, DbState>) -> Result<Vec<Proveedor>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, nombre, contacto, telefono, created_at FROM proveedores ORDER BY nombre")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(Proveedor {
                id: row.get(0)?,
                nombre: row.get(1)?,
                contacto: row.get(2)?,
                telefono: row.get(3)?,
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
pub fn create_proveedor(
    state: State<'_, DbState>,
    data: CreateProveedor,
) -> Result<Proveedor, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO proveedores (nombre, contacto, telefono) VALUES (?1, ?2, ?3)",
        rusqlite::params![data.nombre, data.contacto, data.telefono],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    conn.query_row(
        "SELECT id, nombre, contacto, telefono, created_at FROM proveedores WHERE id = ?1",
        [id],
        |row| {
            Ok(Proveedor {
                id: row.get(0)?,
                nombre: row.get(1)?,
                contacto: row.get(2)?,
                telefono: row.get(3)?,
                created_at: row.get(4)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_proveedor(
    state: State<'_, DbState>,
    data: UpdateProveedor,
) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE proveedores SET nombre = ?1, contacto = ?2, telefono = ?3 WHERE id = ?4",
        rusqlite::params![data.nombre, data.contacto, data.telefono, data.id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_proveedor(state: State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM proveedores WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
