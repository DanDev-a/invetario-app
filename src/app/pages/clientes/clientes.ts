import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import type { Cliente } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">Clientes</h1>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid grid-cols-3 gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input [(ngModel)]="telefono" name="telefono" placeholder="Teléfono"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div class="flex gap-2">
          <input [(ngModel)]="direccion" name="direccion" placeholder="Dirección"
                 class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            {{ editingId() ? 'Actualizar' : 'Agregar' }}
          </button>
          @if (editingId()) {
            <button type="button" (click)="cancelEdit()"
                    class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">Cancelar</button>
          }
        </div>
      </form>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr><th class="text-left p-3">Nombre</th><th class="text-left p-3">Teléfono</th><th class="text-left p-3">Dirección</th><th class="text-right p-3">Acciones</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (c of clientes(); track c.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-medium">{{ c.nombre }}</td>
                <td class="p-3 text-slate-500">{{ c.telefono }}</td>
                <td class="p-3 text-slate-500">{{ c.direccion }}</td>
                <td class="p-3 text-right space-x-2">
                  <button (click)="edit(c)" class="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                  <button (click)="delete(c.id)" class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ClientesComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  nombre = ''; telefono = ''; direccion = '';
  editingId = signal<number | null>(null);

  constructor(private tauri: TauriService) {}

  ngOnInit() { this.load(); }

  private load() { this.tauri.listClientes().then(c => this.clientes.set(c)); }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.tauri.updateCliente(id, this.nombre, this.telefono, this.direccion).then(() => { this.cancelEdit(); this.load(); });
    } else {
      this.tauri.createCliente({ nombre: this.nombre, telefono: this.telefono, direccion: this.direccion }).then(() => { this.cancelEdit(); this.load(); });
    }
  }

  edit(c: Cliente) { this.editingId.set(c.id); this.nombre = c.nombre; this.telefono = c.telefono; this.direccion = c.direccion; }
  cancelEdit() { this.editingId.set(null); this.nombre = ''; this.telefono = ''; this.direccion = ''; }
  delete(id: number) { if (confirm('¿Eliminar este cliente?')) this.tauri.deleteCliente(id).then(() => this.load()); }
}
