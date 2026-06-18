import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import type { Proveedor } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <h1 class="text-2xl font-bold text-slate-800">Proveedores</h1>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid grid-cols-3 gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input [(ngModel)]="contacto" name="contacto" placeholder="Contacto"
               class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div class="flex gap-2">
          <input [(ngModel)]="telefono" name="telefono" placeholder="Teléfono"
                 class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            {{ editingId() ? 'Actualizar' : 'Agregar' }}
          </button>
          @if (editingId()) {
            <button type="button" (click)="cancelEdit()"
                    class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">
              Cancelar
            </button>
          }
        </div>
      </form>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left p-3">Nombre</th>
              <th class="text-left p-3">Contacto</th>
              <th class="text-left p-3">Teléfono</th>
              <th class="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (p of proveedores(); track p.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-medium">{{ p.nombre }}</td>
                <td class="p-3 text-slate-500">{{ p.contacto }}</td>
                <td class="p-3 text-slate-500">{{ p.telefono }}</td>
                <td class="p-3 text-right space-x-2">
                  <button (click)="edit(p)" class="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                  <button (click)="delete(p.id)" class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProveedoresComponent implements OnInit {
  proveedores = signal<Proveedor[]>([]);
  nombre = '';
  contacto = '';
  telefono = '';
  editingId = signal<number | null>(null);

  constructor(private tauri: TauriService) {}

  ngOnInit() { this.load(); }

  private load() { this.tauri.listProveedores().then(p => this.proveedores.set(p)); }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.tauri.updateProveedor(id, this.nombre, this.contacto, this.telefono).then(() => {
        this.cancelEdit(); this.load();
      });
    } else {
      this.tauri.createProveedor({ nombre: this.nombre, contacto: this.contacto, telefono: this.telefono }).then(() => {
        this.cancelEdit(); this.load();
      });
    }
  }

  edit(p: Proveedor) {
    this.editingId.set(p.id); this.nombre = p.nombre; this.contacto = p.contacto; this.telefono = p.telefono;
  }

  cancelEdit() { this.editingId.set(null); this.nombre = ''; this.contacto = ''; this.telefono = ''; }

  delete(id: number) { if (confirm('¿Eliminar este proveedor?')) this.tauri.deleteProveedor(id).then(() => this.load()); }
}
