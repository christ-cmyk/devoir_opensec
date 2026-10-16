import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  FUEL_TYPE_LABEL,
  VEHICLE_STATUS_LABEL,
} from '../../core/utils/labels';
import { FuelType, VehicleStatus } from '../../core/models/vehicle';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.css',
})
export class VehicleForm {
  protected readonly vehicleService = inject(VehicleService);
  protected readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly statusLabels = VEHICLE_STATUS_LABEL;
  protected readonly fuelLabels = FUEL_TYPE_LABEL;
  protected readonly statuses = Object.keys(VEHICLE_STATUS_LABEL) as VehicleStatus[];
  protected readonly fuelTypes = Object.keys(FUEL_TYPE_LABEL) as FuelType[];

  protected readonly isEdit = signal(false);
  protected readonly vehicleId = signal<string | null>(null);
  protected readonly error = signal('');

  protected readonly form = signal({
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    kilometrage: 0,
    statut: 'DISPONIBLE' as VehicleStatus,
    typeCarburant: 'DIESEL' as FuelType,
    dateAcquisition: new Date().toISOString().slice(0, 10),
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const vehicle = this.vehicleService.getById(id);
      if (vehicle) {
        this.isEdit.set(true);
        this.vehicleId.set(vehicle.id);
        this.form.set({
          immatriculation: vehicle.immatriculation,
          marque: vehicle.marque,
          modele: vehicle.modele,
          annee: vehicle.annee,
          kilometrage: vehicle.kilometrage,
          statut: vehicle.statut,
          typeCarburant: vehicle.typeCarburant,
          dateAcquisition: vehicle.dateAcquisition,
        });
      } else {
        this.notifications.error('Véhicule introuvable');
        this.router.navigate(['/vehicules']);
      }
    }
  }

  protected update(
    field:
      | 'immatriculation'
      | 'marque'
      | 'modele'
      | 'annee'
      | 'kilometrage'
      | 'statut'
      | 'typeCarburant'
      | 'dateAcquisition',
    value: string | number
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected submit(): void {
    this.error.set('');
    const value = this.form();

    if (!value.immatriculation.trim()) {
      this.error.set("L'immatriculation est obligatoire");
      return;
    }
    if (!value.marque.trim() || !value.modele.trim()) {
      this.error.set('La marque et le modèle sont obligatoires');
      return;
    }
    if (value.annee < 1950 || value.annee > new Date().getFullYear() + 1) {
      this.error.set('Année invalide');
      return;
    }
    if (value.kilometrage < 0) {
      this.error.set('Kilométrage invalide');
      return;
    }

    if (this.isEdit() && this.vehicleId()) {
      const result = this.vehicleService.update({
        ...value,
        id: this.vehicleId()!,
      });
      if (!result.ok) {
        this.error.set(result.error ?? 'Modification impossible');
        return;
      }
      this.notifications.success('Véhicule modifié');
      this.router.navigate(['/vehicules']);
      return;
    }

    const result = this.vehicleService.create({
      ...value,
      statut: 'DISPONIBLE',
    });
    if (!result.ok) {
      this.error.set(result.error ?? 'Création impossible');
      return;
    }
    this.notifications.success('Véhicule créé');
    this.router.navigate(['/vehicules']);
  }
}
