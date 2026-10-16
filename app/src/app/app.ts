import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Header } from './shared/components/header';
import { Sidebar } from './shared/components/sidebar';
import { Toast } from './shared/components/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly auth = inject(AuthService);
}
