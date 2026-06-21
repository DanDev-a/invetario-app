import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TauriService } from '../../services/tauri.service';
import { ToastService } from '../../components/toast/toast';
import type { Categoria, Tecnologia, Resolucion } from '../../models/interfaces';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <a routerLink="/productos" class="text-slate-400 hover:text-slate-600">&larr; Volver</a>
        <h1 class="text-2xl font-bold text-slate-800">{{ isEdit ? 'Editar' : 'Nueva' }} Pantalla</h1>
      </div>

      <form (ngSubmit)="save()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input [(ngModel)]="nombre" name="nombre" required #nameInput
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Marca</label>
            <input [(ngModel)]="marca" name="marca"
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Pulgadas</label>
            <input [(ngModel)]="pulgadas" name="pulgadas" type="number" step="0.1"
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tecnología</label>
            <select [(ngModel)]="tecnologia_id" name="tecnologia_id"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [ngValue]="null">Seleccionar...</option>
              @for (t of tecnologias(); track t.id) {
                <option [ngValue]="t.id">{{ t.nombre }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Resolución</label>
            <select [(ngModel)]="resolucion_id" name="resolucion_id"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [ngValue]="null">Seleccionar...</option>
              @for (r of resoluciones(); track r.id) {
                <option [ngValue]="r.id">{{ r.nombre }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select [(ngModel)]="categoria_id" name="categoria_id"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option [ngValue]="null">Sin categoría</option>
              @for (cat of categorias(); track cat.id) {
                <option [ngValue]="cat.id">{{ cat.nombre }}</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Precio Compra (BOB)</label>
            <input [(ngModel)]="precio_compra" name="precio_compra" type="number" step="0.01" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Precio Venta (BOB)</label>
            <input [(ngModel)]="precio_venta" name="precio_venta" type="number" step="0.01" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Stock Actual</label>
            <input [(ngModel)]="stock_actual" name="stock_actual" type="number" required
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo (alerta)</label>
            <input [(ngModel)]="stock_minimo" name="stock_minimo" type="number"
                   class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
              <textarea [(ngModel)]="observaciones" name="observaciones" rows="3"
                        placeholder="Estado de la pantalla, detalles, etc."
                        class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            {{ isEdit ? 'Guardar Cambios' : 'Crear Pantalla' }}
          </button>
          <a routerLink="/productos"
             class="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  `,
})
export class ProductoFormComponent implements OnInit {
  isEdit = false;
  editId: number | null = null;

  nombre = '';
  marca = '';
  pulgadas: number | null = null;
  resolucion_id: number | null = null;
  tecnologia_id: number | null = null;
  precio_compra = 0;
  precio_venta = 0;
  stock_actual = 0;
  stock_minimo = 0;
  categoria_id: number | null = null;
  observaciones = '';
  categorias = signal<Categoria[]>([]);
  tecnologias = signal<Tecnologia[]>([]);
  resoluciones = signal<Resolucion[]>([]);

  constructor(
    private db: TauriService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.db.ready().then(() => {
      this.db.listCategorias().then(c => this.categorias.set(c));
      this.db.listTecnologias().then(t => this.tecnologias.set(t));
      this.db.listResoluciones().then(r => this.resoluciones.set(r));

      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEdit = true;
        this.editId = Number(id);
        this.db.getProducto(this.editId).then(p => {
          this.nombre = p.nombre;
          this.marca = p.marca;
          this.pulgadas = p.pulgadas;
          this.resolucion_id = p.resolucion_id;
          this.tecnologia_id = p.tecnologia_id;
          this.precio_compra = p.precio_compra;
          this.precio_venta = p.precio_venta;
          this.stock_actual = p.stock_actual;
          this.stock_minimo = p.stock_minimo;
          this.categoria_id = p.categoria_id;
          this.observaciones = p.observaciones ?? '';
        });
      }
    });
  }

  save() {
    const data = {
      nombre: this.nombre,
      marca: this.marca,
      pulgadas: this.pulgadas,
      resolucion_id: this.resolucion_id,
      tecnologia_id: this.tecnologia_id,
      precio_compra: this.precio_compra,
      precio_venta: this.precio_venta,
      stock_actual: this.stock_actual,
      stock_minimo: this.stock_minimo,
      categoria_id: this.categoria_id,
      observaciones: this.observaciones || null,
    };

    if (this.isEdit && this.editId) {
      this.db.updateProducto({ ...data, id: this.editId }).then(() => {
        this.toast.success('Pantalla actualizada');
        this.router.navigate(['/productos']);
      }).catch(e => this.toast.error('Error: ' + e));
    } else {
      this.db.createProducto(data).then(() => {
        this.toast.success('Pantalla creada');
        this.router.navigate(['/productos']);
      }).catch(e => this.toast.error('Error: ' + e));
    }
  }
}
