import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import { ConfirmService } from '../../components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import type { Categoria } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule, EmptyStateComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-slate-100 rounded-lg p-2">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
        </div>
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
                  class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">Cancelar</button>
        }
      </form>

      @if (items().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <app-empty-state message="No hay categorías registradas. Agregá la primera arriba." />
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr><th class="text-left p-3">Nombre</th><th class="text-left p-3">Descripción</th><th class="text-right p-3">Acciones</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (cat of items(); track cat.id) {
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-medium">{{ cat.nombre }}</td>
                  <td class="p-3 text-slate-500">{{ cat.descripcion }}</td>
                  <td class="p-3 text-right space-x-2">
                    <button (click)="edit(cat)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                    <button (click)="deleteP(cat.id, cat.nombre)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
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
export class CategoriasComponent implements OnInit {
  items = signal<Categoria[]>([]);
  nombre = '';
  descripcion = '';
  editingId = signal<number | null>(null);

  constructor(
    private db: TauriService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.load(); }
  private load() { this.db.listCategorias().then(c => this.items.set(c)); }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.db.updateCategoria(id, this.nombre, this.descripcion).then(() => {
        this.toast.success('Categoría actualizada');
        this.cancelEdit(); this.load();
      });
    } else {
      this.db.createCategoria({ nombre: this.nombre, descripcion: this.descripcion }).then(() => {
        this.toast.success('Categoría agregada');
        this.cancelEdit(); this.load();
      });
    }
  }

  edit(cat: Categoria) { this.editingId.set(cat.id); this.nombre = cat.nombre; this.descripcion = cat.descripcion; }
  cancelEdit() { this.editingId.set(null); this.nombre = ''; this.descripcion = ''; }

  async deleteP(id: number, name: string) {
    if (await this.confirm.confirm(`¿Eliminar la categoría "${name}"?`)) {
      this.db.deleteCategoria(id).then(() => { this.toast.success('Categoría eliminada'); this.load(); });
    }
  }
}
