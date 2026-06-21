import { Injectable } from '@angular/core';
import type {
  Categoria, Tecnologia, Resolucion, Producto, ProductoConCategoria,
  Proveedor, Cliente, VentaConRelaciones, CompraConRelaciones, DashboardData,
  CreateProducto, UpdateProducto, CreateCategoria,
  CreateProveedor, CreateCliente, CreateVenta, CreateCompra,
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class TauriService {
  private ready_ = false;

  async ready(): Promise<void> {
    if (this.ready_) return;
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      this.invoke_ = invoke;
      this.ready_ = true;
    } catch {
      throw new Error('Tauri runtime no disponible');
    }
  }

  private invoke_: (<T>(cmd: string, args?: Record<string, unknown>) => Promise<T>) | null = null;

  private async call<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    await this.ready();
    return this.invoke_!(cmd, args);
  }

  // Categorias
  listCategorias() { return this.call<Categoria[]>('list_categorias'); }
  createCategoria(data: CreateCategoria) { return this.call<Categoria>('create_categoria', { data }); }
  updateCategoria(id: number, nombre: string, descripcion: string) { return this.call<void>('update_categoria', { data: { id, nombre, descripcion } }); }
  deleteCategoria(id: number) { return this.call<void>('delete_categoria', { id }); }

  // Tecnologias
  listTecnologias() { return this.call<Tecnologia[]>('list_tecnologias'); }
  createTecnologia(nombre: string) { return this.call<Tecnologia>('create_tecnologia', { data: { nombre } }); }
  updateTecnologia(id: number, nombre: string) { return this.call<void>('update_tecnologia', { data: { id, nombre } }); }
  deleteTecnologia(id: number) { return this.call<void>('delete_tecnologia', { id }); }

  // Resoluciones
  listResoluciones() { return this.call<Resolucion[]>('list_resoluciones'); }
  createResolucion(nombre: string) { return this.call<Resolucion>('create_resolucion', { data: { nombre } }); }
  updateResolucion(id: number, nombre: string) { return this.call<void>('update_resolucion', { data: { id, nombre } }); }
  deleteResolucion(id: number) { return this.call<void>('delete_resolucion', { id }); }

  // Productos
  listProductos(search?: string) { return this.call<ProductoConCategoria[]>('list_productos', { search: search || null }); }
  getProducto(id: number) { return this.call<Producto>('get_producto', { id }); }
  createProducto(data: CreateProducto) { return this.call<Producto>('create_producto', { data }); }
  updateProducto(data: UpdateProducto) { return this.call<void>('update_producto', { data }); }
  deleteProducto(id: number) { return this.call<void>('delete_producto', { id }); }

  // Proveedores
  listProveedores() { return this.call<Proveedor[]>('list_proveedores'); }
  createProveedor(data: CreateProveedor) { return this.call<Proveedor>('create_proveedor', { data }); }
  updateProveedor(id: number, nombre: string, contacto: string, telefono: string) { return this.call<void>('update_proveedor', { data: { id, nombre, contacto, telefono } }); }
  deleteProveedor(id: number) { return this.call<void>('delete_proveedor', { id }); }

  // Clientes
  listClientes() { return this.call<Cliente[]>('list_clientes'); }
  createCliente(data: CreateCliente) { return this.call<Cliente>('create_cliente', { data }); }
  updateCliente(id: number, nombre: string, telefono: string, direccion: string) { return this.call<void>('update_cliente', { data: { id, nombre, telefono, direccion } }); }
  deleteCliente(id: number) { return this.call<void>('delete_cliente', { id }); }

  // Ventas
  listVentas() { return this.call<VentaConRelaciones[]>('list_ventas'); }
  createVenta(data: CreateVenta) { return this.call<VentaConRelaciones>('create_venta', { data }); }

  // Compras
  listCompras() { return this.call<CompraConRelaciones[]>('list_compras'); }
  createCompra(data: CreateCompra) { return this.call<CompraConRelaciones>('create_compra', { data }); }

  // Dashboard
  getDashboard() { return this.call<DashboardData>('get_dashboard'); }
}
