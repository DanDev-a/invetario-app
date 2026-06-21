import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import { ConfirmService } from '../../components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import type { Cliente } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule, EmptyStateComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-emerald-100 rounded-lg p-2">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Clientes</h1>
          <p class="text-sm text-slate-500">Gestioná tus clientes</p>
        </div>
      </div>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid grid-cols-4 gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <input [(ngModel)]="telefono" name="telefono" placeholder="Teléfono"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <input [(ngModel)]="direccion" name="direccion" placeholder="Dirección"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <div class="flex gap-2">
          <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
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
          <app-empty-state message="No hay clientes registrados. Agregá el primero arriba." />
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr><th class="text-left p-3">Nombre</th><th class="text-left p-3">Teléfono</th><th class="text-left p-3">Dirección</th><th class="text-right p-3">Acciones</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (c of items(); track c.id) {
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-medium">{{ c.nombre }}</td>
                  <td class="p-3 text-slate-500">{{ c.telefono }}</td>
                  <td class="p-3 text-slate-500">{{ c.direccion }}</td>
                  <td class="p-3 text-right space-x-2">
                    <button (click)="edit(c)" class="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Editar</button>
                    <button (click)="deleteP(c.id, c.nombre)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
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
export class ClientesComponent implements OnInit {
  items = signal<Cliente[]>([]);
  nombre = ''; telefono = ''; direccion = '';
  editingId = signal<number | null>(null);

  constructor(
    private db: TauriService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.load(); }
  private load() { this.db.listClientes().then(c => this.items.set(c)); }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.db.updateCliente(id, this.nombre, this.telefono, this.direccion).then(() => {
        this.toast.success('Cliente actualizado');
        this.cancelEdit(); this.load();
      });
    } else {
      this.db.createCliente({ nombre: this.nombre, telefono: this.telefono, direccion: this.direccion }).then(() => {
        this.toast.success('Cliente agregado');
        this.cancelEdit(); this.load();
      });
    }
  }

  edit(c: Cliente) { this.editingId.set(c.id); this.nombre = c.nombre; this.telefono = c.telefono; this.direccion = c.direccion; }
  cancelEdit() { this.editingId.set(null); this.nombre = ''; this.telefono = ''; this.direccion = ''; }

  async deleteP(id: number, name: string) {
    if (await this.confirm.confirm(`¿Eliminar el cliente "${name}"?`)) {
      this.db.deleteCliente(id).then(() => { this.toast.success('Cliente eliminado'); this.load(); });
    }
  }
}
