import { Injectable, inject, signal } from '@angular/core';
import { FuelRecord } from '../models/fuel-record';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { VehicleService } from './vehicle.service';

@Injectable({ providedIn: 'root' })
export class FuelService {
  private readonly store = inject(StorageService);
  private readonly vehicles = inject(VehicleService);

  readonly records = signal<FuelRecord[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.records.set(this.store.getAll<FuelRecord>(STORAGE_KEYS.fuel));
  }

  getById(id: string): FuelRecord | null {
    return this.store.getById<FuelRecord>(STORAGE_KEYS.fuel, id);
  }

  getByVehicle(vehicleId: string): FuelRecord[] {
    return this.records()
      .filter((record) => record.vehiculeId === vehicleId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  getByDriver(driverId: string): FuelRecord[] {
    return this.records()
      .filter((record) => record.conducteurId === driverId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  create(input: Omit<FuelRecord, 'id'>): { ok: boolean; error?: string } {
    const validation = this.validate(input);
    if (validation) {
      return { ok: false, error: validation };
    }
    this.store.create<FuelRecord>(STORAGE_KEYS.fuel, input as FuelRecord);
    this.vehicles.incrementKilometrage(input.vehiculeId, input.kilometrageAuPlein);
    this.refresh();
    return { ok: true };
  }

  update(input: FuelRecord): { ok: boolean; error?: string } {
    const validation = this.validate(input, input.id);
    if (validation) {
      return { ok: false, error: validation };
    }
    this.store.update<FuelRecord>(STORAGE_KEYS.fuel, input);
    this.refresh();
    return { ok: true };
  }

  delete(id: string): { ok: boolean; error?: string } {
    const record = this.getById(id);
    if (!record) {
      return { ok: false, error: 'Plein introuvable' };
    }
    this.store.delete(STORAGE_KEYS.fuel, id);
    this.refresh();
    return { ok: true };
  }

  getAverageConsumption(vehicleId: string): number | null {
    const records = this.getByVehicle(vehicleId).sort(
      (a, b) => a.kilometrageAuPlein - b.kilometrageAuPlein
    );
    if (records.length < 2) {
      return null;
    }
    const first = records[0];
    const last = records[records.length - 1];
    const distance = last.kilometrageAuPlein - first.kilometrageAuPlein;
    if (distance <= 0) {
      return null;
    }
    const litres = records
      .slice(1)
      .reduce((total, record) => total + record.litres, 0);
    return Math.round((litres / distance) * 100 * 10) / 10;
  }

  getMonthFuelCost(month = new Date()): number {
    const prefix = `${month.getFullYear()}-${`${month.getMonth() + 1}`.padStart(2, '0')}`;
    return Math.round(
      this.records()
        .filter((record) => record.date.startsWith(prefix))
        .reduce((total, record) => total + record.prixTotal, 0) * 100
    ) / 100;
  }

  getTotalLitres(vehicleId: string): number {
    return Math.round(
      this.getByVehicle(vehicleId).reduce((total, r) => total + r.litres, 0) * 10
    ) / 10;
  }

  private validate(input: Omit<FuelRecord, 'id'>, excludeId?: string): string | null {
    if (!input.vehiculeId) {
      return 'Véhicule obligatoire';
    }
    if (!input.date) {
      return 'Date obligatoire';
    }
    if (input.litres <= 0) {
      return 'Le nombre de litres doit être supérieur à 0';
    }
    if (input.prixTotal <= 0) {
      return 'Le prix total doit être supérieur à 0';
    }
    if (input.kilometrageAuPlein <= 0) {
      return 'Le kilométrage doit être supérieur à 0';
    }
    const previous = this.getByVehicle(input.vehiculeId)
      .filter((record) => record.id !== excludeId)
      .sort((a, b) => b.kilometrageAuPlein - a.kilometrageAuPlein)[0];
    if (previous && input.kilometrageAuPlein < previous.kilometrageAuPlein) {
      return 'Kilométrage inférieur au dernier plein enregistré';
    }
    return null;
  }
}
