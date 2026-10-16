import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { ConfirmDialog } from './confirm-dialog';
import { Role } from '../../core/models/user';

interface NavItem {
  path: string;
  label: string;
  roles: Role[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ConfirmDialog],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly auth = inject(AuthService);
  private readonly store = inject(StorageService);
  protected readonly isMobileOpen = signal(false);
  protected readonly confirmReset = signal(false);

  protected readonly items: NavItem[] = [
    { path: '/dashboard', label: 'Tableau de bord', roles: ['ADMIN', 'GESTIONNAIRE', 'CONDUCTEUR'] },
    { path: '/vehicules', label: 'Véhicules', roles: ['ADMIN', 'GESTIONNAIRE'] },
    { path: '/affectations', label: 'Affectations', roles: ['ADMIN', 'GESTIONNAIRE'] },
    { path: '/entretiens', label: 'Entretiens', roles: ['ADMIN', 'GESTIONNAIRE'] },
    { path: '/carburant', label: 'Carburant', roles: ['ADMIN', 'GESTIONNAIRE', 'CONDUCTEUR'] },
    { path: '/utilisateurs', label: 'Utilisateurs', roles: ['ADMIN'] },
  ];

  protected visibleItems(): NavItem[] {
    const user = this.auth.currentUser();
    if (!user) {
      return [];
    }
    return this.items.filter((item) => item.roles.includes(user.role));
  }

  protected toggle(): void {
    this.isMobileOpen.update((value) => !value);
  }

  protected close(): void {
    this.isMobileOpen.set(false);
  }

  protected askReset(): void {
    this.confirmReset.set(true);
  }

  protected cancelReset(): void {
    this.confirmReset.set(false);
  }

  protected confirmResetAction(): void {
    this.confirmReset.set(false);
    this.store.clearAll();
    window.location.href = '/login';
  }
}
