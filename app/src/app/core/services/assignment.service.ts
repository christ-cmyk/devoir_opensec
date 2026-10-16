import { Injectable, inject, signal } from '@angular/core';
import { Assignment } from '../models/assignment';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { VehicleService } from './vehicle.service';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly store = inject(StorageService);
  private readonly vehicles = inject(VehicleService);

  readonly assignments = signal<Assignment[]>([]);

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this.assignments.set(this.store.getAll<Assignment>(STORAGE_KEYS.assignments));
  }

  getById(id: string): Assignment | null {
    return this.store.getById<Assignment>(STORAGE_KEYS.assignments, id);
  }

  getByVehicle(vehicleId: string): Assignment[] {
    return this.assignments().filter(
      (assignment) => assignment.vehiculeId === vehicleId
    );
  }

  getByDriver(driverId: string): Assignment[] {
    return this.assignments().filter(
      (assignment) => assignment.conducteurId === driverId
    );
  }

  create(input: Omit<Assignment, 'id' | 'statut'>): { ok: boolean; error?: string } {
    const validation = this.validate(input);
    if (validation) {
      return { ok: false, error: validation };
    }
    this.store.create<Assignment>(STORAGE_KEYS.assignments, {
      ...input,
      statut: 'EN_COURS',
    } as Assignment);
    this.vehicles.setStatus(input.vehiculeId, 'AFFECTE');
    this.refresh();
    return { ok: true };
  }

  update(input: Assignment): { ok: boolean; error?: string } {
    const validation = this.validate(input, input.id);
    if (validation) {
      return { ok: false, error: validation };
    }
    this.store.update<Assignment>(STORAGE_KEYS.assignments, input);
    this.refresh();
    return { ok: true };
  }

  terminate(id: string): { ok: boolean; error?: string } {
    const assignment = this.getById(id);
    if (!assignment) {
      return { ok: false, error: 'Affectation introuvable' };
    }
    this.store.update<Assignment>(STORAGE_KEYS.assignments, {
      ...assignment,
      statut: 'TERMINEE',
    });
    this.vehicles.setStatus(assignment.vehiculeId, 'DISPONIBLE');
    this.refresh();
    return { ok: true };
  }

  cancel(id: string): { ok: boolean; error?: string } {
    const assignment = this.getById(id);
    if (!assignment) {
      return { ok: false, error: 'Affectation introuvable' };
    }
    this.store.update<Assignment>(STORAGE_KEYS.assignments, {
      ...assignment,
      statut: 'ANNULEE',
    });
    this.vehicles.setStatus(assignment.vehiculeId, 'DISPONIBLE');
    this.refresh();
    return { ok: true };
  }

  delete(id: string): { ok: boolean; error?: string } {
    const assignment = this.getById(id);
    if (!assignment) {
      return { ok: false, error: 'Affectation introuvable' };
    }
    if (assignment.statut === 'EN_COURS') {
      this.vehicles.setStatus(assignment.vehiculeId, 'DISPONIBLE');
    }
    this.store.delete(STORAGE_KEYS.assignments, id);
    this.refresh();
    return { ok: true };
  }

  hasConflict(vehicleId: string, dateDebut: string, dateFin: string): boolean {
    return this.assignments().some(
      (assignment) =>
        assignment.vehiculeId === vehicleId &&
        assignment.statut === 'EN_COURS' &&
        assignment.dateDebut <= dateFin &&
        dateDebut <= assignment.dateFin
    );
  }

  private validate(
    input: Omit<Assignment, 'id' | 'statut'>,
    excludeId?: string
  ): string | null {
    if (!input.dateDebut || !input.dateFin) {
      return 'Dates obligatoires';
    }
    if (input.dateFin < input.dateDebut) {
      return 'La date de fin doit être postérieure à la date de début';
    }
    const vehicle = this.vehicles.getById(input.vehiculeId);
    if (!vehicle) {
      return 'Véhicule introuvable';
    }
    const assignedElsewhere = this.assignments().some(
      (assignment) =>
        assignment.id !== excludeId &&
        assignment.vehiculeId === input.vehiculeId &&
        assignment.statut === 'EN_COURS'
    );
    if (vehicle.statut !== 'DISPONIBLE' && !assignedElsewhere) {
      return 'Véhicule non disponible';
    }
    const conflict = this.assignments().some(
      (assignment) =>
        assignment.id !== excludeId &&
        assignment.vehiculeId === input.vehiculeId &&
        assignment.statut === 'EN_COURS' &&
        assignment.dateDebut <= input.dateFin &&
        input.dateDebut <= assignment.dateFin
    );
    if (conflict) {
      return 'Période en conflit';
    }
    return null;
  }
}
