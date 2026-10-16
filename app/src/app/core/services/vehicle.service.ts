import { Injectable, inject, signal } from '@angular/core';
import { Vehicle, VehicleStatus } from '../models/vehicle';
import { STORAGE_KEYS, StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly store = inject(StorageService);

  readonly vehicles = signal<Vehicle[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.vehicles.set(this.store.getAll<Vehicle>(STORAGE_KEYS.vehicles));
  }

  getById(id: string): Vehicle | null {
    return this.store.getById<Vehicle>(STORAGE_KEYS.vehicles, id);
  }

  existsImmatriculation(immatriculation: string, excludeId?: string): boolean {
    const normalized = immatriculation.trim().toUpperCase();
    return this.vehicles().some(
      (vehicle) =>
        vehicle.id !== excludeId &&
        vehicle.immatriculation.trim().toUpperCase() === normalized
    );
  }

  create(vehicle: Omit<Vehicle, 'id'>): { ok: boolean; error?: string } {
    if (this.existsImmatriculation(vehicle.immatriculation)) {
      return { ok: false, error: 'Immatriculation déjà existante' };
    }
    const created = this.store.create<Vehicle>(STORAGE_KEYS.vehicles, {
      ...vehicle,
      immatriculation: vehicle.immatriculation.trim().toUpperCase(),
    } as Vehicle);
    this.refresh();
    return { ok: true, error: created.id };
  }

  update(vehicle: Vehicle): { ok: boolean; error?: string } {
    if (this.existsImmatriculation(vehicle.immatriculation, vehicle.id)) {
      return { ok: false, error: 'Immatriculation déjà existante' };
    }
    this.store.update<Vehicle>(STORAGE_KEYS.vehicles, {
      ...vehicle,
      immatriculation: vehicle.immatriculation.trim().toUpperCase(),
    });
    this.refresh();
    return { ok: true };
  }

  delete(id: string): { ok: boolean; error?: string } {
    const vehicle = this.getById(id);
    if (!vehicle) {
      return { ok: false, error: 'Véhicule introuvable' };
    }
    if (vehicle.statut === 'AFFECTE') {
      return { ok: false, error: 'Véhicule actuellement affecté' };
    }
    this.store.delete(STORAGE_KEYS.vehicles, id);
    this.refresh();
    return { ok: true };
  }

  setStatus(id: string, statut: VehicleStatus): void {
    const vehicle = this.getById(id);
    if (vehicle && vehicle.statut !== statut) {
      this.store.update<Vehicle>(STORAGE_KEYS.vehicles, { ...vehicle, statut });
      this.refresh();
    }
  }

  incrementKilometrage(id: string, kilometrage: number): void {
    const vehicle = this.getById(id);
    if (vehicle && kilometrage > vehicle.kilometrage) {
      this.store.update<Vehicle>(STORAGE_KEYS.vehicles, { ...vehicle, kilometrage });
      this.refresh();
    }
  }

  filter(query: string, statut: string): Vehicle[] {
    const term = query.trim().toUpperCase();
    return this.vehicles().filter((vehicle) => {
      const matchesQuery =
        term === '' ||
        vehicle.immatriculation.toUpperCase().includes(term) ||
        vehicle.marque.toUpperCase().includes(term) ||
        vehicle.modele.toUpperCase().includes(term);
      const matchesStatut = statut === '' || vehicle.statut === statut;
      return matchesQuery && matchesStatut;
    });
  }
}
