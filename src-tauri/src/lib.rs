mod commands;
mod db;
mod models;

use db::DbState;

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
            // Categorias
            commands::categorias::list_categorias,
            commands::categorias::create_categoria,
            commands::categorias::update_categoria,
            commands::categorias::delete_categoria,
            // Productos
            commands::productos::list_productos,
            commands::productos::get_producto,
            commands::productos::create_producto,
            commands::productos::update_producto,
            commands::productos::delete_producto,
            // Proveedores
            commands::proveedores::list_proveedores,
            commands::proveedores::create_proveedor,
            commands::proveedores::update_proveedor,
            commands::proveedores::delete_proveedor,
            // Clientes
            commands::clientes::list_clientes,
            commands::clientes::create_cliente,
            commands::clientes::update_cliente,
            commands::clientes::delete_cliente,
            // Ventas
            commands::ventas::list_ventas,
            commands::ventas::create_venta,
            // Compras
            commands::compras::list_compras,
            commands::compras::create_compra,
            // Dashboard
            commands::dashboard::get_dashboard,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
