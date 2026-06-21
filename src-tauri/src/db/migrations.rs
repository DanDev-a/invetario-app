use rusqlite::Connection;

const SEED_TECNOLOGIAS: &[&str] = &["LED", "LCD", "OLED", "QLED", "Mini LED", "Plasma"];
const SEED_RESOLUCIONES: &[&str] = &[
    "HD (1366x768)",
    "Full HD (1920x1080)",
    "2K (2560x1440)",
    "4K (3840x2160)",
    "8K (7680x4320)",
];

pub fn run_migrations(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT DEFAULT '',
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS proveedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            contacto TEXT DEFAULT '',
            telefono TEXT DEFAULT '',
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS tecnologias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS resoluciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            marca TEXT DEFAULT '',
            pulgadas REAL,
            resolucion TEXT DEFAULT '',
            tecnologia TEXT DEFAULT '',
            resolucion_id INTEGER REFERENCES resoluciones(id) ON DELETE SET NULL,
            tecnologia_id INTEGER REFERENCES tecnologias(id) ON DELETE SET NULL,
            precio_compra REAL NOT NULL DEFAULT 0,
            precio_venta REAL NOT NULL DEFAULT 0,
            stock_actual INTEGER NOT NULL DEFAULT 0,
            stock_minimo INTEGER NOT NULL DEFAULT 0,
            categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT DEFAULT '',
            direccion TEXT DEFAULT '',
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
            fecha TEXT NOT NULL,
            total REAL NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS detalles_compra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            compra_id INTEGER NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
            producto_id INTEGER NOT NULL REFERENCES productos(id),
            cantidad INTEGER NOT NULL,
            precio_unitario REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
            fecha TEXT NOT NULL,
            total REAL NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS detalles_venta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
            producto_id INTEGER NOT NULL REFERENCES productos(id),
            cantidad INTEGER NOT NULL,
            precio_unitario REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS movimientos_stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto_id INTEGER NOT NULL REFERENCES productos(id),
            tipo TEXT NOT NULL CHECK(tipo IN ('ENTRADA', 'SALIDA')),
            cantidad INTEGER NOT NULL,
            referencia_id INTEGER,
            referencia_tipo TEXT DEFAULT '',
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );
        ",
    )
    .map_err(|e| format!("Error running migrations: {}", e))?;

    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM tecnologias", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    if count == 0 {
        for nombre in SEED_TECNOLOGIAS {
            conn.execute(
                "INSERT INTO tecnologias (nombre) VALUES (?1)",
                [nombre],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM resoluciones", [], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    if count == 0 {
        for nombre in SEED_RESOLUCIONES {
            conn.execute(
                "INSERT INTO resoluciones (nombre) VALUES (?1)",
                [nombre],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    Ok(())
}
