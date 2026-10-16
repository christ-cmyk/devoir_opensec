import { Injectable } from '@angular/core';

export const STORAGE_KEYS = {
  users: 'pma_users',
  vehicles: 'pma_vehicles',
  assignments: 'pma_assignments',
  maintainances: 'pma_maintenances',
  fuel: 'pma_fuel',
  session: 'pma_session',
  seeded: 'pma_seeded',
} as const;

@Injectable({ providedIn: 'root' })
export class StorageService {
  getAll<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  getById<T extends { id: string }>(key: string, id: string): T | null {
    return this.getAll<T>(key).find((item) => item.id === id) ?? null;
  }

  create<T extends { id?: string }>(key: string, item: T): T & { id: string } {
    const items = this.getAll<T & { id: string }>(key);
    const created = { ...item, id: item.id || this.generateId() };
    items.push(created);
    this.save(key, items);
    return created;
  }

  update<T extends { id: string }>(key: string, item: T): T {
    const items = this.getAll<T>(key);
    const index = items.findIndex((existing) => existing.id === item.id);
    if (index === -1) {
      throw new Error(`Élément introuvable : ${item.id}`);
    }
    items[index] = item;
    this.save(key, items);
    return item;
  }

  delete(key: string, id: string): void {
    const items = this.getAll<{ id: string }>(key).filter((item) => item.id !== id);
    this.save(key, items);
  }

  readValue<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  writeValue(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clearAll(): void {
    const keys = Object.values(STORAGE_KEYS) as string[];
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (key && (keys.includes(key) || key.startsWith('pma_'))) {
        localStorage.removeItem(key);
      }
    }
  }

  private save<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private generateId(): string {
    return typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
