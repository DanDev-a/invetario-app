import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-50 p-3 border-b border-slate-100">
        <div class="flex gap-4">
          @for (col of columns(); track $index) {
            <div class="h-4 bg-slate-200 rounded animate-pulse" [style.width]="col + 'px'"></div>
          }
        </div>
      </div>
      @for (row of [].constructor(rows()); track $index) {
        <div class="flex gap-4 p-3 border-b border-slate-50">
          @for (col of columns(); track $index) {
            <div class="h-3 bg-slate-100 rounded animate-pulse" [style.width]="col + 'px'"></div>
          }
        </div>
      }
    </div>
  `,
})
export class SkeletonTableComponent {
  rows = input(5);
  columns = input<number[]>([120, 80, 60, 80, 60]);
}

@Component({
  selector: 'app-skeleton-cards',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      @for (i of [].constructor(count()); track $index) {
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div class="h-3 bg-slate-200 rounded animate-pulse w-24 mb-3"></div>
          <div class="h-8 bg-slate-100 rounded animate-pulse w-16"></div>
        </div>
      }
    </div>
  `,
})
export class SkeletonCardsComponent {
  count = input<number>(3);
}
