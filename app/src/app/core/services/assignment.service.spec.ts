import { TestBed } from '@angular/core/testing';
import { AssignmentService } from './assignment.service';
import { VehicleService } from './vehicle.service';
import { StorageService } from './storage.service';
import { Vehicle } from '../models/vehicle';

describe('AssignmentService (règles métier)', () => {
  let assignments: AssignmentService;
  let vehicles: VehicleService;

  const createVehicle = (statut: Vehicle['statut'] = 'DISPONIBLE') =>
    vehicles.create({
      immatriculation: `AB-${Math.floor(Math.random() * 900) + 100}-CD`,
      marque: 'Renault',
      modele: 'Master',
      annee: 2022,
      kilometrage: 1000,
      statut,
      typeCarburant: 'DIESEL',
      dateAcquisition: '2022-01-01',
    });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    vehicles = TestBed.inject(VehicleService);
    assignments = TestBed.inject(AssignmentService);
  });

  afterEach(() => localStorage.clear());

  it('affecte un véhicule disponible et le passe en AFFECTE', () => {
    createVehicle('DISPONIBLE');
    const vehicle = vehicles.vehicles()[0];
    const result = assignments.create({
      vehiculeId: vehicle.id,
      conducteurId: 'driver-1',
      dateDebut: '2026-01-01',
      dateFin: '2026-01-10',
      motif: 'Livraison',
    });
    expect(result.ok).toBe(true);
    expect(vehicles.getById(vehicle.id)?.statut).toBe('AFFECTE');
  });

  it('refuse un véhicule non disponible', () => {
    createVehicle('HORS_SERVICE');
    const vehicle = vehicles.vehicles()[0];
    const result = assignments.create({
      vehiculeId: vehicle.id,
      conducteurId: 'driver-1',
      dateDebut: '2026-01-01',
      dateFin: '2026-01-10',
      motif: 'Livraison',
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Véhicule non disponible');
  });

  it('refuse un chevauchement de période', () => {
    createVehicle('DISPONIBLE');
    const vehicle = vehicles.vehicles()[0];
    assignments.create({
      vehiculeId: vehicle.id,
      conducteurId: 'driver-1',
      dateDebut: '2026-01-01',
      dateFin: '2026-01-15',
      motif: 'A',
    });
    const result = assignments.create({
      vehiculeId: vehicle.id,
      conducteurId: 'driver-2',
      dateDebut: '2026-01-10',
      dateFin: '2026-01-20',
      motif: 'B',
    });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Période en conflit');
  });

  it('clôture une affectation et libère le véhicule', () => {
    createVehicle('DISPONIBLE');
    const vehicle = vehicles.vehicles()[0];
    assignments.create({
      vehiculeId: vehicle.id,
      conducteurId: 'driver-1',
      dateDebut: '2026-01-01',
      dateFin: '2026-01-15',
      motif: 'A',
    });
    const assignment = assignments.assignments()[0];
    assignments.terminate(assignment.id);
    expect(assignments.getById(assignment.id)?.statut).toBe('TERMINEE');
    expect(vehicles.getById(vehicle.id)?.statut).toBe('DISPONIBLE');
  });
});
