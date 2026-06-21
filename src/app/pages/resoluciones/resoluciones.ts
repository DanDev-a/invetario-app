import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import { ConfirmService } from '../../components/confirm-dialog/confirm-dialog';
import { EmptyStateComponent } from '../../components/empty-state/empty-state';
import type { Resolucion } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule, EmptyStateComponent],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-3">
        <div class="bg-cyan-100 rounded-lg p-2">
          <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Resoluciones</h1>
      </div>
      <p class="text-sm text-slate-500 -mt-4">Gestioná las resoluciones disponibles para las pantallas</p>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-3">
        <input [(ngModel)]="nombre" name="nombre" required placeholder="Nombre de resolución"
               class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
        <button type="submit" class="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium">
          {{ editingId() ? 'Actualizar' : 'Agregar' }}
        </button>
        @if (editingId()) {
          <button type="button" (click)="cancelEdit()"
                  class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">
            Cancelar
          </button>
        }
      </form>

      @if (loading()) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div class="space-y-3">
            @for (i of [].constructor(4); track $index) {
              <div class="h-10 bg-slate-100 rounded animate-pulse"></div>
            }
          </div>
        </div>
      } @else if (items().length === 0) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <app-empty-state message="No hay resoluciones registradas. Agregá la primera arriba." />
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-slate-600">
              <tr>
                <th class="text-left p-3">Nombre</th>
                <th class="text-left p-3">Creada</th>
                <th class="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (item of items(); track item.id) {
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-medium">{{ item.nombre }}</td>
                  <td class="p-3 text-slate-500 text-xs">{{ item.created_at }}</td>
                  <td class="p-3 text-right space-x-2">
                    <button (click)="edit(item)" class="text-cyan-600 hover:text-cyan-800 text-sm font-medium">Editar</button>
                    <button (click)="delete(item.id, item.nombre)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
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
export class ResolucionesComponent implements OnInit {
  items = signal<Resolucion[]>([]);
  nombre = '';
  editingId = signal<number | null>(null);
  loading = signal(true);

  constructor(
    private db: TauriService,
    private toast: ToastService,
    private confirm: ConfirmService,
  ) {}

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.db.listResoluciones().then(r => { this.items.set(r); this.loading.set(false); });
  }

  save() {
    if (!this.nombre.trim()) return;
    const id = this.editingId();
    if (id) {
      this.db.updateResolucion(id, this.nombre).then(() => {
        this.toast.success('Resolución actualizada');
        this.cancelEdit(); this.load();
      });
    } else {
      this.db.createResolucion(this.nombre).then(() => {
        this.toast.success('Resolución agregada');
        this.cancelEdit(); this.load();
      });
    }
  }

  edit(item: Resolucion) { this.editingId.set(item.id); this.nombre = item.nombre; }
  cancelEdit() { this.editingId.set(null); this.nombre = ''; }

  async delete(id: number, name: string) {
    if (await this.confirm.confirm(`¿Eliminar la resolución "${name}"?`)) {
      this.db.deleteResolucion(id).then(() => {
        this.toast.success('Resolución eliminada');
        this.load();
      });
    }
  }
}
