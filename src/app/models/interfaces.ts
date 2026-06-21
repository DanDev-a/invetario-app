export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  created_at: string;
}

export interface Resolucion {
  id: number;
  nombre: string;
  created_at: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  created_at: string;
}

export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  pulgadas: number | null;
  resolucion_id: number | null;
  tecnologia_id: number | null;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number | null;
  observaciones?: string | null;
  created_at: string;
}

export interface ProductoConCategoria {
  id: number;
  nombre: string;
  marca: string;
  pulgadas: number | null;
  resolucion_id: number | null;
  resolucion_nombre: string | null;
  tecnologia_id: number | null;
  tecnologia_nombre: string | null;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number | null;
  categoria_nombre: string | null;
  observaciones?: string | null;
  created_at: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  created_at: string;
}

export interface DetalleVentaConProducto {
  id: number;
  venta_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface VentaConRelaciones {
  id: number;
  cliente_id: number | null;
  cliente_nombre: string | null;
  fecha: string;
  total: number;
  created_at: string;
  detalles: DetalleVentaConProducto[];
}

export interface DetalleCompraConProducto {
  id: number;
  compra_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface CompraConRelaciones {
  id: number;
  proveedor_id: number | null;
  proveedor_nombre: string | null;
  fecha: string;
  total: number;
  created_at: string;
  detalles: DetalleCompraConProducto[];
}

export interface MovimientoStockConProducto {
  id: number;
  producto_id: number;
  producto_nombre: string;
  tipo: string;
  cantidad: number;
  referencia_id: number | null;
  referencia_tipo: string;
  created_at: string;
}

export interface StockBajoItem {
  id: number;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
}

export interface DashboardData {
  total_productos: number;
  stock_bajo: StockBajoItem[];
  ultimos_movimientos: MovimientoStockConProducto[];
  total_ventas_hoy: number;
  total_compras_hoy: number;
}

export interface CreateProducto {
  nombre: string;
  marca: string;
  pulgadas: number | null;
  resolucion_id: number | null;
  tecnologia_id: number | null;
  precio_compra: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number | null;
  observaciones?: string | null;
}

export interface UpdateProducto extends CreateProducto {
  id: number;
}

export interface CreateCategoria {
  nombre: string;
  descripcion: string;
}

export interface CreateProveedor {
  nombre: string;
  contacto: string;
  telefono: string;
}

export interface CreateCliente {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface CreateDetalleVenta {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface CreateVenta {
  cliente_id: number | null;
  fecha: string;
  detalles: CreateDetalleVenta[];
}

export interface CreateDetalleCompra {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface CreateCompra {
  proveedor_id: number | null;
  fecha: string;
  detalles: CreateDetalleCompra[];
}
