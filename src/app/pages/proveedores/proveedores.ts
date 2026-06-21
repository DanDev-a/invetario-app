import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import { ConfirmService } from '../../components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import type { Proveedor } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule, EmptyStateComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-orange-100 rounded-lg p-2">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Proveedores</h1>
          <p class="text-sm text-slate-500">Gestioná tus proveedores de pantallas</p>
        </div>
      </div>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid grid-cols-4 gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
        <input [(ngModel)]="contacto" name="contacto" placeholder="Contacto"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
        <input [(ngModel)]="telefono" name="telefono" placeholder="Teléfono"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
        <div class="flex gap-2">
          <button type="submit" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            {{ editingId() ? 'Actualizar' : 'Agregar' }}
          </button>
          @if (editingId()) {
            <button type="button" (click)="cancelEdit()"
                    class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">Cancelar</button>
          }
        </div>
      </form>

      @if (items().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <app-empty-state message="No hay proveedores registrados. Agregá el primero arriba." />
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr><th class="text-left p-3">Nombre</th><th class="text-left p-3">Contacto</th><th class="text-left p-3">Teléfono</th><th class="text-right p-3">Acciones</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (p of items(); track p.id) {
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-medium">{{ p.nombre }}</td>
                  <td class="p-3 text-slate-500">{{ p.contacto }}</td>
                  <td class="p-3 text-slate-500">{{ p.telefono }}</td>
                  <td class="p-3 text-right space-x-2">
                    <button (click)="edit(p)" class="text-orange-600 hover:text-orange-800 text-sm font-medium">Editar</button>
                    <button (click)="deleteP(p.id, p.nombre)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
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
export class ProveedoresComponent implements OnInit {
  items = signal<Proveedor[]>([]);
  nombre = ''; contacto = ''; telefono = '';
  editingId = signal<number | null>(null);

  constructor(
    private db: TauriService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.load(); }
  private load() { this.db.listProveedores().then(p => this.items.set(p)); }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.db.updateProveedor(id, this.nombre, this.contacto, this.telefono).then(() => {
        this.toast.success('Proveedor actualizado');
        this.cancelEdit(); this.load();
      });
    } else {
      this.db.createProveedor({ nombre: this.nombre, contacto: this.contacto, telefono: this.telefono }).then(() => {
        this.toast.success('Proveedor agregado');
        this.cancelEdit(); this.load();
      });
    }
  }

  edit(p: Proveedor) { this.editingId.set(p.id); this.nombre = p.nombre; this.contacto = p.contacto; this.telefono = p.telefono; }
  cancelEdit() { this.editingId.set(null); this.nombre = ''; this.contacto = ''; this.telefono = ''; }

  async deleteP(id: number, name: string) {
    if (await this.confirm.confirm(`¿Eliminar el proveedor "${name}"?`)) {
      this.db.deleteProveedor(id).then(() => { this.toast.success('Proveedor eliminado'); this.load(); });
    }
  }
}
