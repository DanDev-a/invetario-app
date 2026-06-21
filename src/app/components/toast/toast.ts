import { Component, Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  messages = signal<ToastMessage[]>([]);

  show(text: string, type: ToastMessage['type'] = 'info') {
    const id = ++this.counter;
    this.messages.update(m => [...m, { id, text, type }]);
    setTimeout(() => this.remove(id), 3000);
  }

  success(text: string) { this.show(text, 'success'); }
  error(text: string) { this.show(text, 'error'); }
  info(text: string) { this.show(text, 'info'); }

  remove(id: number) {
    this.messages.update(m => m.filter(msg => msg.id !== id));
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (msg of toast.messages(); track msg.id) {
        <div
          class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2
                 animate-[slideIn_0.2s_ease-out] transition-all"
          [class.bg-emerald-600]="msg.type === 'success'"
          [class.text-white]="msg.type === 'success'"
          [class.bg-red-600]="msg.type === 'error'"
          [class.text-white]="msg.type === 'error'"
          [class.bg-blue-600]="msg.type === 'info'"
          [class.text-white]="msg.type === 'info'"
        >
          @if (msg.type === 'success') {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          }
          @if (msg.type === 'error') {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          }
          @if (msg.type === 'info') {
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          }
          {{ msg.text }}
          <button (click)="toast.remove(msg.id)" class="ml-2 opacity-70 hover:opacity-100">&times;</button>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
