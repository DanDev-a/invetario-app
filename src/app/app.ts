import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { ToastComponent } from './components/toast/toast';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, ToastComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
