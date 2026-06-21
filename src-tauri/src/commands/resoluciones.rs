use tauri::State;

use crate::db::DbState;
use crate::models::{CreateResolucion, Resolucion, UpdateResolucion};

#[tauri::command]
pub fn list_resoluciones(state: State<'_, DbState>) -> Result<Vec<Resolucion>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, nombre, created_at FROM resoluciones ORDER BY nombre")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(Resolucion {
                id: row.get(0)?,
                nombre: row.get(1)?,
                created_at: row.get(2)?,
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
pub fn create_resolucion(
    state: State<'_, DbState>,
    data: CreateResolucion,
) -> Result<Resolucion, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO resoluciones (nombre) VALUES (?1)",
        [&data.nombre],
    )
    .map_err(|e| e.to_string())?;
    let id = conn.last_insert_rowid();
    conn.query_row(
        "SELECT id, nombre, created_at FROM resoluciones WHERE id = ?1",
        [id],
        |row| {
            Ok(Resolucion {
                id: row.get(0)?,
                nombre: row.get(1)?,
                created_at: row.get(2)?,
            })
        },
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_resolucion(
    state: State<'_, DbState>,
    data: UpdateResolucion,
) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE resoluciones SET nombre = ?1 WHERE id = ?2",
        [&data.nombre, &data.id.to_string()],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_resolucion(state: State<'_, DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM resoluciones WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}
