import { Injectable, computed, signal } from '@angular/core';
import { Role, User } from '../models/user';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { generateSalt, hashPassword } from '../utils/crypto.util';

interface Session {
  userId: string;
  expiresAt: number;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  private readonly storage = STORAGE_KEYS.users;

  constructor(private readonly store: StorageService) {
    this.restoreSession();
  }

  async register(input: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
  }): Promise<{ ok: boolean; error?: string }> {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: 'Email invalide' };
    }
    if (input.password.length < 8) {
      return { ok: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
    }
    if (this.findByEmail(email)) {
      return { ok: false, error: 'Cet email est déjà utilisé' };
    }
    const salt = generateSalt();
    const user: User = {
      id: '',
      email,
      passwordHash: await hashPassword(input.password, salt),
      salt,
      nom: input.nom.trim(),
      prenom: input.prenom.trim(),
      role: 'CONDUCTEUR',
      createdAt: new Date().toISOString(),
    };
    this.store.create(this.storage, user);
    return { ok: true };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ ok: boolean; error?: string }> {
    const user = this.findByEmail(email.trim().toLowerCase());
    if (!user) {
      return { ok: false, error: 'Identifiants invalides' };
    }
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return { ok: false, error: 'Identifiants invalides' };
    }
    this.openSession(user);
    return { ok: true };
  }

  logout(): void {
    this.store.remove(STORAGE_KEYS.session);
    this.currentUser.set(null);
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser();
    return user !== null && roles.includes(user.role);
  }

  updateCurrentUser(user: User): void {
    if (this.currentUser()?.id === user.id) {
      this.currentUser.set({ ...user });
    }
  }

  private findByEmail(email: string): User | null {
    return (
      this.store.getAll<User>(this.storage).find((user) => user.email === email) ?? null
    );
  }

  private openSession(user: User): void {
    const session: Session = {
      userId: user.id,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    this.store.writeValue(STORAGE_KEYS.session, session);
    this.currentUser.set({ ...user });
  }

  private restoreSession(): void {
    const session = this.store.readValue<Session>(STORAGE_KEYS.session);
    if (!session) {
      return;
    }
    if (session.expiresAt < Date.now()) {
      this.store.remove(STORAGE_KEYS.session);
      return;
    }
    const user = this.store.getById<User>(this.storage, session.userId);
    if (user) {
      this.currentUser.set({ ...user });
    } else {
      this.store.remove(STORAGE_KEYS.session);
    }
  }
}
