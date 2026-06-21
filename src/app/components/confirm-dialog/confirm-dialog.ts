import { Component, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  state = signal<{ message: string; resolve: (v: boolean) => void } | null>(null);

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({ message, resolve });
    });
  }

  close(result: boolean) {
    const s = this.state();
    if (s) {
      s.resolve(result);
      this.state.set(null);
    }
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (confirm.state(); as s) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" (click)="confirm.close(false)">
        <div class="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4" (click)="$event.stopPropagation()">
          <div class="flex items-start gap-3">
            <div class="bg-red-100 rounded-full p-2 shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-slate-700">{{ s.message }}</p>
              <div class="flex gap-2 mt-4">
                <button (click)="confirm.close(true)"
                        class="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-medium">
                  Eliminar
                </button>
                <button (click)="confirm.close(false)"
                        class="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 font-medium">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  constructor(public confirm: ConfirmService) {}
}
