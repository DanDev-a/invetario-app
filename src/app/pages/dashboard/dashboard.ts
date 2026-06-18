import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TauriService } from '../../services/tauri.service';
import type { DashboardData } from '../../models/interfaces';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <p class="text-sm text-slate-500">Total Productos</p>
          <p class="text-3xl font-bold text-slate-800">{{ data()?.total_productos ?? 0 }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <p class="text-sm text-slate-500">Ventas Hoy</p>
          <p class="text-3xl font-bold text-emerald-600">{{ (data()?.total_ventas_hoy ?? 0) | currency:'BOB' }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <p class="text-sm text-slate-500">Compras Hoy</p>
          <p class="text-3xl font-bold text-red-600">{{ (data()?.total_compras_hoy ?? 0) | currency:'BOB' }}</p>
        </div>
      </div>

      @if ((data()?.stock_bajo ?? []).length > 0) {
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 class="text-lg font-semibold text-amber-800 mb-3">⚠️ Stock Bajo</h2>
          <div class="space-y-2">
            @for (item of data()?.stock_bajo; track item.id) {
              <div class="flex justify-between items-center text-sm">
                <span class="text-amber-900">{{ item.nombre }}</span>
                <span class="font-medium text-amber-700">
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
                  <td class="p-3">{{ m.producto_nombre }}</td>
                  <td class="p-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                          [class.bg-emerald-100]="m.tipo === 'ENTRADA'"
                          [class.text-emerald-700]="m.tipo === 'ENTRADA'"
                          [class.bg-red-100]="m.tipo === 'SALIDA'"
                          [class.text-red-700]="m.tipo === 'SALIDA'">
                      {{ m.tipo }}
                    </span>
                  </td>
                  <td class="p-3 text-right font-medium">{{ m.cantidad }}</td>
                  <td class="p-3 text-slate-500">{{ m.referencia_tipo }} #{{ m.referencia_id }}</td>
                  <td class="p-3 text-slate-500">{{ m.created_at }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex gap-3">
        <a routerLink="/ventas/nueva"
           class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
          + Nueva Venta
        </a>
        <a routerLink="/compras/nueva"
           class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nueva Compra
        </a>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  data = signal<DashboardData | null>(null);

  constructor(private tauri: TauriService) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.tauri.getDashboard().then(d => this.data.set(d));
  }
}
