import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import type {
  Categoria, Tecnologia, Resolucion, Producto, ProductoConCategoria,
  Proveedor, Cliente, VentaConRelaciones, CompraConRelaciones, DashboardData,
  CreateProducto, UpdateProducto, CreateCategoria,
  CreateProveedor, CreateCliente, CreateVenta, CreateCompra,
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class TauriService {

  ready(): Promise<void> {
    return Promise.resolve();
  }

  // Categorias
  listCategorias() { return invoke<Categoria[]>('list_categorias'); }
  createCategoria(data: CreateCategoria) { return invoke<Categoria>('create_categoria', { data }); }
  updateCategoria(id: number, nombre: string, descripcion: string) { return invoke<void>('update_categoria', { data: { id, nombre, descripcion } }); }
  deleteCategoria(id: number) { return invoke<void>('delete_categoria', { id }); }

  // Tecnologias
  listTecnologias() { return invoke<Tecnologia[]>('list_tecnologias'); }
  createTecnologia(nombre: string) { return invoke<Tecnologia>('create_tecnologia', { data: { nombre } }); }
  updateTecnologia(id: number, nombre: string) { return invoke<void>('update_tecnologia', { data: { id, nombre } }); }
  deleteTecnologia(id: number) { return invoke<void>('delete_tecnologia', { id }); }

  // Resoluciones
  listResoluciones() { return invoke<Resolucion[]>('list_resoluciones'); }
  createResolucion(nombre: string) { return invoke<Resolucion>('create_resolucion', { data: { nombre } }); }
  updateResolucion(id: number, nombre: string) { return invoke<void>('update_resolucion', { data: { id, nombre } }); }
  deleteResolucion(id: number) { return invoke<void>('delete_resolucion', { id }); }

  // Productos
  listProductos(search?: string) { return invoke<ProductoConCategoria[]>('list_productos', { search: search || null }); }
  getProducto(id: number) { return invoke<Producto>('get_producto', { id }); }
  createProducto(data: CreateProducto) { return invoke<Producto>('create_producto', { data }); }
  updateProducto(data: UpdateProducto) { return invoke<void>('update_producto', { data }); }
  deleteProducto(id: number) { return invoke<void>('delete_producto', { id }); }

  // Proveedores
  listProveedores() { return invoke<Proveedor[]>('list_proveedores'); }
  createProveedor(data: CreateProveedor) { return invoke<Proveedor>('create_proveedor', { data }); }
  updateProveedor(id: number, nombre: string, contacto: string, telefono: string) { return invoke<void>('update_proveedor', { data: { id, nombre, contacto, telefono } }); }
  deleteProveedor(id: number) { return invoke<void>('delete_proveedor', { id }); }

  // Clientes
  listClientes() { return invoke<Cliente[]>('list_clientes'); }
  createCliente(data: CreateCliente) { return invoke<Cliente>('create_cliente', { data }); }
  updateCliente(id: number, nombre: string, telefono: string, direccion: string) { return invoke<void>('update_cliente', { data: { id, nombre, telefono, direccion } }); }
  deleteCliente(id: number) { return invoke<void>('delete_cliente', { id }); }

  // Ventas
  listVentas() { return invoke<VentaConRelaciones[]>('list_ventas'); }
  createVenta(data: CreateVenta) { return invoke<VentaConRelaciones>('create_venta', { data }); }

  // Compras
  listCompras() { return invoke<CompraConRelaciones[]>('list_compras'); }
  createCompra(data: CreateCompra) { return invoke<CompraConRelaciones>('create_compra', { data }); }

  // Dashboard
  getDashboard() { return invoke<DashboardData>('get_dashboard'); }
}
