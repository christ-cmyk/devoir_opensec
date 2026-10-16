import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p class="text-6xl font-bold text-blue-600">404</p>
      <h1 class="mt-4 text-xl font-bold text-slate-900">Page introuvable</h1>
      <p class="mt-2 text-sm text-slate-500">
        La page demandée n'existe pas ou a été déplacée.
      </p>
      <a routerLink="/dashboard" class="btn-primary mt-6">
        Retour au tableau de bord
      </a>
    </div>
  `,
})
export class NotFound {}
