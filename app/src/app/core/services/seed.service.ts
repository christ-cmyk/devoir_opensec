import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { Vehicle } from '../models/vehicle';
import { Assignment } from '../models/assignment';
import { Maintenance } from '../models/maintenance';
import { FuelRecord } from '../models/fuel-record';
import { STORAGE_KEYS, StorageService } from './storage.service';
import { generateSalt, hashPassword } from '../utils/crypto.util';
import { AssignmentService } from './assignment.service';
import { FuelService } from './fuel.service';
import { MaintenanceService } from './maintenance.service';
import { VehicleService } from './vehicle.service';

@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly store = inject(StorageService);
  private readonly vehicles = inject(VehicleService);
  private readonly assignments = inject(AssignmentService);
  private readonly maintainances = inject(MaintenanceService);
  private readonly fuel = inject(FuelService);

  async init(): Promise<void> {
    if (this.store.readValue(STORAGE_KEYS.seeded)) {
      return;
    }
    if (this.store.getAll<User>(STORAGE_KEYS.users).length > 0) {
      this.store.writeValue(STORAGE_KEYS.seeded, true);
      return;
    }

    const users: User[] = [];
    const accounts: Array<[string, string, string, string, User['role']]> = [
      ['admin@parc.fr', 'Admin12345', 'Durand', 'Alice', 'ADMIN'],
      ['gestion@parc.fr', 'Gestion12345', 'Martin', 'Bruno', 'GESTIONNAIRE'],
      ['conducteur@parc.fr', 'Conduct12345', 'Bernard', 'Claire', 'CONDUCTEUR'],
    ];

    for (const [email, password, nom, prenom, role] of accounts) {
      const salt = generateSalt();
      users.push({
        id: '',
        email,
        passwordHash: await hashPassword(password, salt),
        salt,
        nom,
        prenom,
        role,
        createdAt: new Date().toISOString(),
      });
    }
    users.forEach((user) => this.store.create<User>(STORAGE_KEYS.users, user));

    const driver = users[2].id;

    const vehicles: Array<Omit<Vehicle, 'id'>> = [
      {
        immatriculation: 'AB-123-CD',
        marque: 'Renault',
        modele: 'Master',
        annee: 2021,
        kilometrage: 84500,
        statut: 'AFFECTE',
        typeCarburant: 'DIESEL',
        dateAcquisition: '2021-03-15',
      },
      {
        immatriculation: 'EF-456-GH',
        marque: 'Peugeot',
        modele: 'Partner',
        annee: 2022,
        kilometrage: 52300,
        statut: 'DISPONIBLE',
        typeCarburant: 'DIESEL',
        dateAcquisition: '2022-06-01',
      },
      {
        immatriculation: 'IJ-789-KL',
        marque: 'Citroën',
        modele: 'Jumpy',
        annee: 2020,
        kilometrage: 118900,
        statut: 'EN_ENTRETIEN',
        typeCarburant: 'ESSENCE',
        dateAcquisition: '2020-01-20',
      },
      {
        immatriculation: 'MN-321-OP',
        marque: 'Renault',
        modele: 'Kangoo',
        annee: 2023,
        kilometrage: 21400,
        statut: 'DISPONIBLE',
        typeCarburant: 'ELECTRIQUE',
        dateAcquisition: '2023-09-10',
      },
      {
        immatriculation: 'QR-654-ST',
        marque: 'Fiat',
        modele: 'Ducato',
        annee: 2019,
        kilometrage: 167200,
        statut: 'HORS_SERVICE',
        typeCarburant: 'DIESEL',
        dateAcquisition: '2019-05-05',
      },
    ];
    const createdVehicles = vehicles.map((vehicle) =>
      this.store.create<Vehicle>(STORAGE_KEYS.vehicles, vehicle as Vehicle)
    );

    const inDays = (days: number): string => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    };

    const assignments: Array<Omit<Assignment, 'id'>> = [
      {
        vehiculeId: createdVehicles[0].id,
        conducteurId: driver,
        dateDebut: inDays(-30),
        dateFin: inDays(30),
        motif: 'Livraisons quotidiennes zone nord',
        statut: 'EN_COURS',
      },
    ];
    assignments.forEach((assignment) =>
      this.store.create<Assignment>(STORAGE_KEYS.assignments, assignment as Assignment)
    );

    const maintainances: Array<Omit<Maintenance, 'id'>> = [
      {
        vehiculeId: createdVehicles[2].id,
        type: 'CONTROLE_TECHNIQUE',
        description: 'Contrôle technique annuel',
        datePrevue: inDays(3),
        coutEstime: 120,
        statut: 'PLANIFIE',
      },
      {
        vehiculeId: createdVehicles[0].id,
        type: 'PREVENTIF',
        description: 'Vidange et remplacement des plaquettes',
        datePrevue: inDays(5),
        coutEstime: 350,
        statut: 'PLANIFIE',
      },
      {
        vehiculeId: createdVehicles[4].id,
        type: 'CORRECTIF',
        description: 'Remplacement embrayage',
        datePrevue: inDays(-10),
        coutEstime: 900,
        coutReel: 940,
        statut: 'TERMINE',
      },
    ];
    maintainances.forEach((maintenance) =>
      this.store.create<Maintenance>(STORAGE_KEYS.maintainances, {
        ...maintenance,
      } as Maintenance)
    );

    const day = 24 * 60 * 60 * 1000;
    const dateFor = (offsetDays: number): string =>
      new Date(Date.now() - offsetDays * day).toISOString().slice(0, 10);

    const fuelRecords: Array<Omit<FuelRecord, 'id'>> = [
      {
        vehiculeId: createdVehicles[0].id,
        conducteurId: driver,
        date: dateFor(45),
        litres: 55,
        prixTotal: 92.4,
        kilometrageAuPlein: 76000,
        station: 'Total Energies A1',
      },
      {
        vehiculeId: createdVehicles[0].id,
        conducteurId: driver,
        date: dateFor(20),
        litres: 52,
        prixTotal: 87.35,
        kilometrageAuPlein: 80500,
        station: 'Esso Centre',
      },
      {
        vehiculeId: createdVehicles[0].id,
        conducteurId: driver,
        date: dateFor(3),
        litres: 49.5,
        prixTotal: 83.15,
        kilometrageAuPlein: 84500,
        station: 'Total Energies A1',
      },
      {
        vehiculeId: createdVehicles[1].id,
        conducteurId: driver,
        date: dateFor(10),
        litres: 40,
        prixTotal: 67.2,
        kilometrageAuPlein: 51000,
        station: 'BP Ouest',
      },
      {
        vehiculeId: createdVehicles[1].id,
        conducteurId: driver,
        date: dateFor(2),
        litres: 38.2,
        prixTotal: 64.2,
        kilometrageAuPlein: 52300,
        station: 'BP Ouest',
      },
    ];
    fuelRecords.forEach((record) =>
      this.store.create<FuelRecord>(STORAGE_KEYS.fuel, record as FuelRecord)
    );

    this.store.writeValue(STORAGE_KEYS.seeded, true);
    this.vehicles.refresh();
    this.assignments.refresh();
    this.maintainances.refresh();
    this.fuel.refresh();
  }
}
