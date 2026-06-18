import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos-lista').then(m => m.ProductosListaComponent),
  },
  {
    path: 'productos/nuevo',
    loadComponent: () => import('./pages/productos/producto-form').then(m => m.ProductoFormComponent),
  },
  {
    path: 'productos/:id',
    loadComponent: () => import('./pages/productos/producto-form').then(m => m.ProductoFormComponent),
  },
  {
    path: 'categorias',
    loadComponent: () => import('./pages/categorias/categorias').then(m => m.CategoriasComponent),
  },
  {
    path: 'proveedores',
    loadComponent: () => import('./pages/proveedores/proveedores').then(m => m.ProveedoresComponent),
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes').then(m => m.ClientesComponent),
  },
  {
    path: 'compras',
    loadComponent: () => import('./pages/compras/compras-lista').then(m => m.ComprasListaComponent),
  },
  {
    path: 'compras/nueva',
    loadComponent: () => import('./pages/compras/compra-form').then(m => m.CompraFormComponent),
  },
  {
    path: 'ventas',
    loadComponent: () => import('./pages/ventas/ventas-lista').then(m => m.VentasListaComponent),
  },
  {
    path: 'ventas/nueva',
    loadComponent: () => import('./pages/ventas/venta-form').then(m => m.VentaFormComponent),
  },
];
