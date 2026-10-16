import { Injectable, inject, signal } from '@angular/core';
import { Maintenance, MaintenanceStatus } from '../models/maintenance';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { VehicleService } from './vehicle.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly store = inject(StorageService);
  private readonly vehicles = inject(VehicleService);

  readonly maintainances = signal<Maintenance[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.maintainances.set(
      this.store.getAll<Maintenance>(STORAGE_KEYS.maintainances)
    );
  }

  getById(id: string): Maintenance | null {
    return this.store.getById<Maintenance>(STORAGE_KEYS.maintainances, id);
  }

  getByVehicle(vehicleId: string): Maintenance[] {
    return this.maintainances().filter(
      (maintenance) => maintenance.vehiculeId === vehicleId
    );
  }

  create(input: Omit<Maintenance, 'id' | 'statut'>): { ok: boolean; error?: string } {
    if (!input.datePrevue) {
      return { ok: false, error: 'Date prévue obligatoire' };
    }
    this.store.create<Maintenance>(STORAGE_KEYS.maintainances, {
      ...input,
      statut: 'PLANIFIE',
    } as Maintenance);
    this.vehicles.setStatus(input.vehiculeId, 'EN_ENTRETIEN');
    this.refresh();
    return { ok: true };
  }

  update(input: Maintenance): { ok: boolean; error?: string } {
    if (!input.datePrevue) {
      return { ok: false, error: 'Date prévue obligatoire' };
    }
    const existing = this.getById(input.id);
    this.store.update<Maintenance>(STORAGE_KEYS.maintainances, input);
    if (existing && existing.statut !== input.statut) {
      if (input.statut === 'TERMINE' || input.statut === 'ANNULE') {
        this.vehicles.setStatus(input.vehiculeId, 'DISPONIBLE');
      } else {
        this.vehicles.setStatus(input.vehiculeId, 'EN_ENTRETIEN');
      }
    }
    this.refresh();
    return { ok: true };
  }

  start(id: string): { ok: boolean; error?: string } {
    const maintenance = this.getById(id);
    if (!maintenance) {
      return { ok: false, error: 'Entretien introuvable' };
    }
    this.store.update<Maintenance>(STORAGE_KEYS.maintainances, {
      ...maintenance,
      statut: 'EN_COURS',
    });
    this.vehicles.setStatus(maintenance.vehiculeId, 'EN_ENTRETIEN');
    this.refresh();
    return { ok: true };
  }

  complete(id: string, coutReel: number): { ok: boolean; error?: string } {
    const maintenance = this.getById(id);
    if (!maintenance) {
      return { ok: false, error: 'Entretien introuvable' };
    }
    if (coutReel < 0) {
      return { ok: false, error: 'Coût réel invalide' };
    }
    this.store.update<Maintenance>(STORAGE_KEYS.maintainances, {
      ...maintenance,
      statut: 'TERMINE',
      coutReel,
    });
    this.vehicles.setStatus(maintenance.vehiculeId, 'DISPONIBLE');
    this.refresh();
    return { ok: true };
  }

  delete(id: string): { ok: boolean; error?: string } {
    const maintenance = this.getById(id);
    if (!maintenance) {
      return { ok: false, error: 'Entretien introuvable' };
    }
    if (maintenance.statut !== 'TERMINE' && maintenance.statut !== 'ANNULE') {
      this.vehicles.setStatus(maintenance.vehiculeId, 'DISPONIBLE');
    }
    this.store.delete(STORAGE_KEYS.maintainances, id);
    this.refresh();
    return { ok: true };
  }

  getUpcomingMaintenances(days = 7): Maintenance[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setDate(limit.getDate() + days);
    const limitString = this.toIsoDate(limit);
    const todayString = this.toIsoDate(today);
    return this.maintainances()
      .filter(
        (maintenance) =>
          (maintenance.statut === 'PLANIFIE' ||
            maintenance.statut === 'EN_COURS') &&
          maintenance.datePrevue >= todayString &&
          maintenance.datePrevue <= limitString
      )
      .sort((a, b) => a.datePrevue.localeCompare(b.datePrevue));
  }

  countByStatus(status: MaintenanceStatus): number {
    return this.maintainances().filter((m) => m.statut === status).length;
  }

  private toIsoDate(date: Date): string {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}
