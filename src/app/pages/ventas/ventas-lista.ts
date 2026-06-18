import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TauriService } from '../../services/tauri.service';
import type { VentaConRelaciones } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Ventas</h1>
        <a routerLink="/ventas/nueva"
           class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
          + Nueva Venta
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left p-3">#</th>
              <th class="text-left p-3">Cliente</th>
              <th class="text-left p-3">Fecha</th>
              <th class="text-left p-3">Productos</th>
              <th class="text-right p-3">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (v of ventas(); track v.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-medium">{{ v.id }}</td>
                <td class="p-3">{{ v.cliente_nombre || 'Venta directa' }}</td>
                <td class="p-3 text-slate-500">{{ v.fecha }}</td>
                <td class="p-3">
                  <div class="flex flex-wrap gap-1">
                    @for (d of v.detalles; track d.id) {
                      <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">{{ d.cantidad }}x {{ d.producto_nombre }}</span>
                    }
                  </div>
                </td>
                <td class="p-3 text-right font-medium">{{ v.total | currency:'BOB' }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (ventas().length === 0) {
          <div class="p-8 text-center text-slate-400">No hay ventas registradas</div>
        }
      </div>
    </div>
  `,
})
export class VentasListaComponent implements OnInit {
  ventas = signal<VentaConRelaciones[]>([]);

  constructor(private tauri: TauriService) {}

  ngOnInit() { this.tauri.listVentas().then(v => this.ventas.set(v)); }
}
