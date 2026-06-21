import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TauriService } from '../../services/tauri.service';
import type { DashboardData } from '../../models/interfaces';
import { SkeletonCardsComponent } from '../../components/skeleton/skeleton';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe, SkeletonCardsComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div class="flex gap-2">
          <a routerLink="/ventas/nueva"
             class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nueva Venta
          </a>
          <a routerLink="/compras/nueva"
             class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Nueva Compra
          </a>
        </div>
      </div>

      @if (loading()) {
        <app-skeleton-cards [count]="3" />
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div class="space-y-3">
            @for (i of [].constructor(5); track $index) {
              <div class="h-10 bg-slate-100 rounded animate-pulse"></div>
            }
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 rounded-lg p-2.5">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium">Total Productos</p>
                <p class="text-2xl font-bold text-slate-800">{{ data()?.total_productos ?? 0 }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="bg-emerald-100 rounded-lg p-2.5">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m0 0l-6-6m6 6H3"/></svg>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium">Ventas Hoy</p>
                <p class="text-2xl font-bold text-emerald-600">{{ (data()?.total_ventas_hoy ?? 0) | currency:'BOB' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="bg-red-100 rounded-lg p-2.5">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium">Compras Hoy</p>
                <p class="text-2xl font-bold text-red-600">{{ (data()?.total_compras_hoy ?? 0) | currency:'BOB' }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="bg-amber-100 rounded-lg p-2.5">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"/></svg>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-medium">Stock Bajo</p>
                <p class="text-2xl font-bold text-amber-600">{{ data()?.stock_bajo?.length ?? 0 }} productos</p>
              </div>
            </div>
          </div>
        </div>

        @if ((data()?.stock_bajo ?? []).length > 0) {
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-lg">⚠️</span>
              <h2 class="text-lg font-semibold text-amber-800">Stock Bajo</h2>
            </div>
            <div class="space-y-2">
              @for (item of data()?.stock_bajo; track item.id) {
                <div class="flex justify-between items-center text-sm">
                  <span class="text-amber-900 font-medium">{{ item.nombre }}</span>
                  <span class="font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {{ item.stock_actual }} / {{ item.stock_minimo }}
                  </span>
                </div>
              }
            </div>
          </div>
        }

        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="p-4 border-b border-slate-100">
            <h2 class="text-lg font-semibold text-slate-800">Últimos Movimientos</h2>
          </div>
          @if ((data()?.ultimos_movimientos ?? []).length === 0) {
            <div class="p-8 text-center text-slate-400 text-sm">No hay movimientos registrados</div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-slate-50 text-slate-600">
                  <tr>
                    <th class="text-left p-3">Producto</th>
                    <th class="text-left p-3">Tipo</th>
                    <th class="text-right p-3">Cantidad</th>
                    <th class="text-left p-3">Referencia</th>
                    <th class="text-left p-3">Fecha</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (m of data()?.ultimos_movimientos; track m.id) {
                    <tr class="hover:bg-slate-50">
                      <td class="p-3 font-medium">{{ m.producto_nombre }}</td>
                      <td class="p-3">
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                              [class.bg-emerald-100]="m.tipo === 'ENTRADA'"
                              [class.text-emerald-700]="m.tipo === 'ENTRADA'"
                              [class.bg-red-100]="m.tipo === 'SALIDA'"
                              [class.text-red-700]="m.tipo === 'SALIDA'">
                          {{ m.tipo }}
                        </span>
                      </td>
                      <td class="p-3 text-right font-medium">{{ m.cantidad }}</td>
                      <td class="p-3 text-slate-500 text-xs">{{ m.referencia_tipo }} #{{ m.referencia_id }}</td>
                      <td class="p-3 text-slate-500 text-xs">{{ m.created_at }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  data = signal<DashboardData | null>(null);
  loading = signal(true);

  constructor(private db: TauriService) {}

  ngOnInit() {
    this.db.ready().then(() => this.load());
  }

  private load() {
    this.db.getDashboard().then(d => {
      this.data.set(d);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }
}
