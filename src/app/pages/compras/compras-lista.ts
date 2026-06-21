import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TauriService } from '../../services/tauri.service';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import { SkeletonTableComponent } from '../../components/skeleton/skeleton';
import type { CompraConRelaciones } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe, EmptyStateComponent, SkeletonTableComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Compras</h1>
          <p class="text-sm text-slate-500">Historial de compras a proveedores</p>
        </div>
        <a routerLink="/compras/nueva"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nueva Compra
        </a>
      </div>

      @if (loading()) {
        <app-skeleton-table [columns]="[40, 120, 100, 160, 80]" />
      } @else if (compras().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <app-empty-state message="No hay compras registradas">
            <a routerLink="/compras/nueva" class="mt-3 inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              + Nueva Compra
            </a>
          </app-empty-state>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="text-left p-3">#</th>
                <th class="text-left p-3">Proveedor</th>
                <th class="text-left p-3">Fecha</th>
                <th class="text-left p-3">Productos</th>
                <th class="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (c of compras(); track c.id) {
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-medium text-slate-400">#{{ c.id }}</td>
                  <td class="p-3">{{ c.proveedor_nombre || 'Sin proveedor' }}</td>
                  <td class="p-3 text-slate-500 text-xs">{{ c.fecha }}</td>
                  <td class="p-3">
                    <div class="flex flex-wrap gap-1">
                      @for (d of c.detalles; track d.id) {
                        <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">{{ d.cantidad }}x {{ d.producto_nombre }}</span>
                      }
                    </div>
                  </td>
                  <td class="p-3 text-right font-medium">{{ c.total | currency:'BOB' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ComprasListaComponent implements OnInit {
  compras = signal<CompraConRelaciones[]>([]);
  loading = signal(true);

  constructor(private db: TauriService) {}

  ngOnInit() {
    this.db.ready().then(() => this.db.listCompras().then(c => { this.compras.set(c); this.loading.set(false); }));
  }
}
