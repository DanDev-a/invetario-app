import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
  isDivider?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="bg-slate-900 text-white flex flex-col h-screen transition-all duration-200"
           [class.w-64]="!collapsed()" [class.w-16]="collapsed()">
      <div class="p-4 border-b border-slate-700 flex items-center gap-3">
        @if (!collapsed()) {
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-bold tracking-tight truncate">Importadora</h1>
            <p class="text-[10px] text-slate-400 truncate">Gestión de Pantallas</p>
          </div>
        }
        <button (click)="collapsed.set(!collapsed())"
                class="shrink-0 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (collapsed()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            }
          </svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto p-2 space-y-4">
        @for (section of sections; track section.title) {
          <div>
            @if (!collapsed()) {
              <p class="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">{{ section.title }}</p>
            }
            <div class="space-y-0.5">
              @for (item of section.items; track item.path) {
                <a [routerLink]="item.path"
                   routerLinkActive="bg-slate-700 text-white shadow-sm"
                   [routerLinkActiveOptions]="{exact: item.exact ?? false}"
                   class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm"
                   [title]="item.label">
                  <span class="shrink-0" [innerHTML]="item.icon"></span>
                  @if (!collapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </a>
              }
            </div>
          </div>
        }
      </nav>
    </aside>
  `,
})
export class Sidebar {
  collapsed = signal(false);

  sections: NavSection[] = [
    {
      title: 'Inicio',
      items: [
        { label: 'Dashboard', path: '/', exact: true, icon: SVG_ICONS.home },
        { label: 'Pantallas', path: '/productos', icon: SVG_ICONS.monitor },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { label: 'Categorías', path: '/categorias', icon: SVG_ICONS.category },
        { label: 'Proveedores', path: '/proveedores', icon: SVG_ICONS.truck },
        { label: 'Tecnologías', path: '/tecnologias', icon: SVG_ICONS.chip },
        { label: 'Resoluciones', path: '/resoluciones', icon: SVG_ICONS.grid },
      ],
    },
    {
      title: 'Movimientos',
      items: [
        { label: 'Compras', path: '/compras', icon: SVG_ICONS.cart },
        { label: 'Ventas', path: '/ventas', icon: SVG_ICONS.sale },
      ],
    },
    {
      title: 'Clientes',
      items: [
        { label: 'Clientes', path: '/clientes', icon: SVG_ICONS.users },
      ],
    },
  ];
}

const SVG_ICONS = {
  home: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  monitor: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  category: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>`,
  truck: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  chip: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>`,
  grid: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>`,
  cart: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
  sale: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m0 0l-6-6m6 6H3"/></svg>`,
  users: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
};
