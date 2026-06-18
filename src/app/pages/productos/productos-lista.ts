import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import type { ProductoConCategoria } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Pantallas</h1>
        <a routerLink="/productos/nuevo"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          + Nueva Pantalla
        </a>
      </div>

      <div class="flex gap-2">
        <input [(ngModel)]="search" (input)="onSearch()" placeholder="Buscar por nombre o marca..."
               class="flex-1 max-w-md px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left p-3">Nombre</th>
              <th class="text-left p-3">Marca</th>
              <th class="text-left p-3">Categoría</th>
              <th class="text-right p-3">Stock</th>
              <th class="text-right p-3">P. Compra</th>
              <th class="text-right p-3">P. Venta</th>
              <th class="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (p of productos(); track p.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-medium">{{ p.nombre }}</td>
                <td class="p-3 text-slate-600">{{ p.marca }}</td>
                <td class="p-3">
                  <span class="px-2 py-1 bg-slate-100 rounded text-xs">{{ p.categoria_nombre || 'Sin categoría' }}</span>
                </td>
                <td class="p-3 text-right">
                  <span [class.text-red-600]="p.stock_actual <= p.stock_minimo"
                        [class.font-bold]="p.stock_actual <= p.stock_minimo">
                    {{ p.stock_actual }}
                  </span>
                </td>
                <td class="p-3 text-right">{{ p.precio_compra | currency:'BOB' }}</td>
                <td class="p-3 text-right font-medium">{{ p.precio_venta | currency:'BOB' }}</td>
                <td class="p-3 text-right space-x-2">
                  <a [routerLink]="['/productos', p.id]"
                     class="text-blue-600 hover:text-blue-800 text-sm">Editar</a>
                  <button (click)="delete(p.id)"
                          class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (productos().length === 0) {
          <div class="p-8 text-center text-slate-400">
            No hay pantallas registradas
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductosListaComponent implements OnInit {
  productos = signal<ProductoConCategoria[]>([]);
  search = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private tauri: TauriService) {}

  ngOnInit() {
    this.load();
  }

  private load(q?: string) {
    this.tauri.listProductos(q).then(p => this.productos.set(p));
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.load(this.search || undefined);
    }, 300);
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta pantalla?')) {
      this.tauri.deleteProducto(id).then(() => this.load());
    }
  }
}
