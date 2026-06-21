import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import type { Cliente, ProductoConCategoria } from '../../models/interfaces';

interface VentaItem {
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
}

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  template: `
    <div class="p-6 max-w-3xl">
      <div class="flex items-center gap-3 mb-6">
        <a routerLink="/ventas" class="text-slate-400 hover:text-slate-600">&larr; Volver</a>
        <h1 class="text-2xl font-bold text-slate-800">Nueva Venta</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
            <select [(ngModel)]="cliente_id" name="cliente_id"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option [ngValue]="null">Venta directa (sin cliente)</option>
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.nombre }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input [(ngModel)]="fecha" name="fecha" type="date" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Agregar Producto</label>
          <div class="flex gap-2">
            <select #prodSelect (change)="addItem(prodSelect.value); prodSelect.value=''"
                    class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="" disabled selected>Seleccionar pantalla...</option>
              @for (p of productos(); track p.id) {
                <option [value]="p.id">{{ p.nombre }} - {{ p.marca }} (Stock: {{ p.stock_actual }}) — {{ p.precio_venta | currency:'BOB' }}</option>
              }
            </select>
          </div>
        </div>

        @if (items().length > 0) {
          <div>
            <h3 class="text-sm font-medium text-slate-700 mb-2">Productos en esta venta</h3>
            <table class="w-full text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="text-left p-2">Producto</th>
                  <th class="text-right p-2">Cantidad</th>
                  <th class="text-right p-2">P. Unitario</th>
                  <th class="text-right p-2">Subtotal</th>
                  <th class="text-right p-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of items(); track item.producto_id; let i = $index) {
                  <tr>
                    <td class="p-2">{{ item.producto_nombre }}</td>
                    <td class="p-2">
                      <input [(ngModel)]="item.cantidad" name="cant_{{i}}" type="number" min="1"
                             class="w-20 px-2 py-1 border border-slate-300 rounded text-sm text-right">
                    </td>
                    <td class="p-2 text-right">{{ item.precio_unitario | currency:'BOB' }}</td>
                    <td class="p-2 text-right font-medium">{{ (item.cantidad * item.precio_unitario) | currency:'BOB' }}</td>
                    <td class="p-2 text-right">
                      <button (click)="removeItem(i)" class="text-red-500 hover:text-red-700 text-sm font-medium">Eliminar</button>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot class="bg-slate-50 font-medium">
                <tr>
                  <td colspan="3" class="p-2 text-right">Total:</td>
                  <td class="p-2 text-right">{{ total() | currency:'BOB' }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        }

        <div class="flex gap-3 pt-4">
          <button (click)="save()" [disabled]="items().length === 0"
                  class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 text-sm font-medium">
            Registrar Venta
          </button>
          <a routerLink="/ventas"
             class="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">
            Cancelar
          </a>
        </div>
      </div>
    </div>
  `,
})
export class VentaFormComponent implements OnInit {
  items = signal<VentaItem[]>([]);
  cliente_id: number | null = null;
  fecha = new Date().toISOString().slice(0, 10);
  productos = signal<ProductoConCategoria[]>([]);
  clientes = signal<Cliente[]>([]);

  constructor(
    private db: TauriService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.db.ready().then(() => {
      this.db.listProductos().then(p => this.productos.set(p));
      this.db.listClientes().then(c => this.clientes.set(c));
    });
  }

  get total() {
    return () => this.items().reduce((sum, i) => sum + i.cantidad * i.precio_unitario, 0);
  }

  addItem(productoId: string) {
    const id = Number(productoId);
    const prod = this.productos().find(p => p.id === id);
    if (!prod) return;

    const existing = this.items().find(i => i.producto_id === id);
    if (existing) {
      existing.cantidad++;
      this.items.set([...this.items()]);
    } else {
      this.items.set([...this.items(), {
        producto_id: id,
        producto_nombre: prod.nombre,
        cantidad: 1,
        precio_unitario: prod.precio_venta,
      }]);
    }
  }

  removeItem(index: number) {
    this.items.set(this.items().filter((_, i) => i !== index));
  }

  save() {
    if (this.items().length === 0) return;
    this.db.createVenta({
      cliente_id: this.cliente_id,
      fecha: this.fecha,
      detalles: this.items().map(i => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      })),
    }).then(() => {
      this.toast.success('Venta registrada');
      this.router.navigate(['/ventas']);
    }).catch(e => this.toast.error('Error: ' + e));
  }
}
