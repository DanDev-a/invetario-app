import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import type { Categoria } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-slate-800">Categorías</h1>
      </div>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre"
               class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input [(ngModel)]="descripcion" name="descripcion" placeholder="Descripción"
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
      </form>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="text-left p-3">Nombre</th>
              <th class="text-left p-3">Descripción</th>
              <th class="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (cat of categorias(); track cat.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-medium">{{ cat.nombre }}</td>
                <td class="p-3 text-slate-500">{{ cat.descripcion }}</td>
                <td class="p-3 text-right space-x-2">
                  <button (click)="edit(cat)"
                          class="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                  <button (click)="delete(cat.id)"
                          class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CategoriasComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  nombre = '';
  descripcion = '';
  editingId = signal<number | null>(null);

  constructor(private tauri: TauriService) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.tauri.listCategorias().then(c => this.categorias.set(c));
  }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.tauri.updateCategoria(id, this.nombre, this.descripcion).then(() => {
        this.cancelEdit();
        this.load();
      });
    } else {
      this.tauri.createCategoria({ nombre: this.nombre, descripcion: this.descripcion }).then(() => {
        this.cancelEdit();
        this.load();
      });
    }
  }

  edit(cat: Categoria) {
    this.editingId.set(cat.id);
    this.nombre = cat.nombre;
    this.descripcion = cat.descripcion;
  }

  cancelEdit() {
    this.editingId.set(null);
    this.nombre = '';
    this.descripcion = '';
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.tauri.deleteCategoria(id).then(() => this.load());
    }
  }
}
