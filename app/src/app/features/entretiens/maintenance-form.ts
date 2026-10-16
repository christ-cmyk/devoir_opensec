import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  MAINTENANCE_STATUS_LABEL,
  MAINTENANCE_TYPE_LABEL,
} from '../../core/utils/labels';
import { MaintenanceType } from '../../core/models/maintenance';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.css',
})
export class MaintenanceForm {
  protected readonly maintenanceService = inject(MaintenanceService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly maintenanceId = signal<string | null>(null);
  protected readonly error = signal('');

  protected readonly typeLabels = MAINTENANCE_TYPE_LABEL;
  protected readonly statusLabels = MAINTENANCE_STATUS_LABEL;
  protected readonly types = Object.keys(MAINTENANCE_TYPE_LABEL) as MaintenanceType[];

  protected readonly form = signal({
    vehiculeId: '',
    type: 'PREVENTIF' as MaintenanceType,
    description: '',
    datePrevue: new Date().toISOString().slice(0, 10),
    coutEstime: 0,
    statut: 'PLANIFIE',
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const maintenance = this.maintenanceService.getById(id);
      if (maintenance) {
        this.isEdit.set(true);
        this.maintenanceId.set(maintenance.id);
        this.form.set({
          vehiculeId: maintenance.vehiculeId,
          type: maintenance.type,
          description: maintenance.description,
          datePrevue: maintenance.datePrevue,
          coutEstime: maintenance.coutEstime,
          statut: maintenance.statut,
        });
      } else {
        this.notifications.error('Entretien introuvable');
        this.router.navigate(['/entretiens']);
      }
    }
  }

  protected get vehicles() {
    return this.vehicleService.vehicles();
  }

  protected update(
    field: 'vehiculeId' | 'type' | 'description' | 'datePrevue' | 'coutEstime' | 'statut',
    value: string | number
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected submit(): void {
    this.error.set('');
    const value = this.form();

    if (!value.vehiculeId) {
      this.error.set('Sélectionnez un véhicule');
      return;
    }
    if (!value.description.trim()) {
      this.error.set('La description est obligatoire');
      return;
    }
    if (value.coutEstime < 0) {
      this.error.set('Coût estimé invalide');
      return;
    }

    if (this.isEdit() && this.maintenanceId()) {
      const existing = this.maintenanceService.getById(this.maintenanceId()!);
      if (!existing) {
        this.error.set('Entretien introuvable');
        return;
      }
      const result = this.maintenanceService.update({
        ...existing,
        vehiculeId: value.vehiculeId,
        type: value.type,
        description: value.description,
        datePrevue: value.datePrevue,
        coutEstime: value.coutEstime,
        statut: value.statut as typeof existing.statut,
      });
      if (!result.ok) {
        this.error.set(result.error ?? 'Modification impossible');
        return;
      }
      this.notifications.success('Entretien modifié');
      this.router.navigate(['/entretiens']);
      return;
    }

    const result = this.maintenanceService.create({
      vehiculeId: value.vehiculeId,
      type: value.type,
      description: value.description,
      datePrevue: value.datePrevue,
      coutEstime: value.coutEstime,
    });
    if (!result.ok) {
      this.error.set(result.error ?? 'Création impossible');
      return;
    }
    this.notifications.success('Entretien planifié');
    this.router.navigate(['/entretiens']);
  }
}
