mod commands;
mod db;
mod models;

use db::DbState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let db_state = DbState::new(app)?;
            app.manage(db_state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::categorias::list_categorias,
            commands::categorias::create_categoria,
            commands::categorias::update_categoria,
            commands::categorias::delete_categoria,
            commands::tecnologias::list_tecnologias,
            commands::tecnologias::create_tecnologia,
            commands::tecnologias::update_tecnologia,
            commands::tecnologias::delete_tecnologia,
            commands::resoluciones::list_resoluciones,
            commands::resoluciones::create_resolucion,
            commands::resoluciones::update_resolucion,
            commands::resoluciones::delete_resolucion,
            commands::productos::list_productos,
            commands::productos::get_producto,
            commands::productos::create_producto,
            commands::productos::update_producto,
            commands::productos::delete_producto,
            commands::proveedores::list_proveedores,
            commands::proveedores::create_proveedor,
            commands::proveedores::update_proveedor,
            commands::proveedores::delete_proveedor,
            commands::clientes::list_clientes,
            commands::clientes::create_cliente,
            commands::clientes::update_cliente,
            commands::clientes::delete_cliente,
            commands::ventas::list_ventas,
            commands::ventas::create_venta,
            commands::compras::list_compras,
            commands::compras::create_compra,
            commands::dashboard::get_dashboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
