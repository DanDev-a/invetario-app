import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import { ConfirmService } from '../../components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { SkeletonTableComponent } from '../../components/skeleton/skeleton';
import type { ProductoConCategoria } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule, EmptyStateComponent, SkeletonTableComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Pantallas</h1>
          <p class="text-sm text-slate-500">Gestioná el inventario de pantallas</p>
        </div>
        <a routerLink="/productos/nuevo"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nueva Pantalla
        </a>
      </div>

      <div>
        <div class="relative max-w-md">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input [(ngModel)]="search" (input)="onSearch()" placeholder="Buscar por nombre o marca..."
                 class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>

      @if (loading()) {
        <app-skeleton-table [columns]="[160, 100, 90, 60, 90, 90, 80]" />
      } @else if (productos().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <app-empty-state message="No hay pantallas registradas">
            <a routerLink="/productos/nuevo" class="mt-3 inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              + Agregar Pantalla
            </a>
          </app-empty-state>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="text-left p-3">Nombre</th>
                <th class="text-left p-3">Marca</th>
                <th class="text-left p-3">Categoría</th>
                <th class="text-left p-3">Tecnología</th>
                <th class="text-left p-3">Resolución</th>
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
                    <span class="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{{ p.categoria_nombre || '—' }}</span>
                  </td>
                  <td class="p-3 text-xs text-slate-500">{{ p.tecnologia_nombre || '—' }}</td>
                  <td class="p-3 text-xs text-slate-500">{{ p.resolucion_nombre || '—' }}</td>
                  <td class="p-3 text-right">
                    <span class="px-2 py-0.5 rounded text-xs font-medium"
                          [class.bg-red-100]="p.stock_actual <= p.stock_minimo"
                          [class.text-red-700]="p.stock_actual <= p.stock_minimo"
                          [class.bg-slate-100]="p.stock_actual > p.stock_minimo"
                          [class.text-slate-700]="p.stock_actual > p.stock_minimo">
                      {{ p.stock_actual }}
                    </span>
                  </td>
                  <td class="p-3 text-right text-slate-500">{{ p.precio_compra | currency:'BOB' }}</td>
                  <td class="p-3 text-right font-medium">{{ p.precio_venta | currency:'BOB' }}</td>
                  <td class="p-3 text-right space-x-2">
                    <a [routerLink]="['/productos', p.id]"
                       class="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</a>
                    <button (click)="delete(p.id, p.nombre)"
                            class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ProductosListaComponent implements OnInit {
  productos = signal<ProductoConCategoria[]>([]);
  search = '';
  loading = signal(true);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private db: TauriService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() {
    this.load();
  }

  private load(q?: string) {
    this.loading.set(true);
    this.db.listProductos(q).then(p => {
      this.productos.set(p);
      this.loading.set(false);
    });
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.load(this.search || undefined);
    }, 300);
  }

  async delete(id: number, name: string) {
    if (await this.confirm.confirm(`¿Eliminar la pantalla "${name}"?`)) {
      this.db.deleteProducto(id).then(() => {
        this.toast.success('Pantalla eliminada');
        this.load();
      });
    }
  }
}
