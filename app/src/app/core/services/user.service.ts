import { Injectable, inject, signal } from '@angular/core';
import { Role, User } from '../models/user';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly store = inject(StorageService);
  private readonly auth = inject(AuthService);

  readonly users = signal<User[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.users.set(this.store.getAll<User>(STORAGE_KEYS.users));
  }

  getById(id: string): User | null {
    return this.store.getById<User>(STORAGE_KEYS.users, id);
  }

  getDrivers(): User[] {
    return this.users().filter((user) => user.role !== 'ADMIN');
  }

  changeRole(id: string, role: Role): { ok: boolean; error?: string } {
    const user = this.getById(id);
    if (!user) {
      return { ok: false, error: 'Utilisateur introuvable' };
    }
    this.store.update<User>(STORAGE_KEYS.users, { ...user, role });
    this.refresh();
    this.auth.updateCurrentUser({ ...user, role });
    return { ok: true };
  }

  delete(id: string): { ok: boolean; error?: string } {
    const current = this.auth.currentUser();
    if (current && current.id === id) {
      return { ok: false, error: 'Impossible de supprimer votre propre compte' };
    }
    const user = this.getById(id);
    if (!user) {
      return { ok: false, error: 'Utilisateur introuvable' };
    }
    this.store.delete(STORAGE_KEYS.users, id);
    this.refresh();
    return { ok: true };
  }
}
