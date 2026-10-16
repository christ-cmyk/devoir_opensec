import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import {
  MAINTENANCE_STATUS_LABEL,
  MAINTENANCE_TYPE_LABEL,
} from '../../core/utils/labels';
import { MaintenanceStatus } from '../../core/models/maintenance';

interface CompleteState {
  id: string;
  coutReel: number;
}

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe, ConfirmDialog],
  templateUrl: './maintenance-list.html',
  styleUrl: './maintenance-list.css',
})
export class MaintenanceList {
  protected readonly maintenanceService = inject(MaintenanceService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly notifications = inject(NotificationService);

  protected readonly statutFilter = signal('');
  protected readonly pendingDelete = signal<string | null>(null);
  protected readonly completing = signal<CompleteState | null>(null);

  protected readonly statusLabels = MAINTENANCE_STATUS_LABEL;
  protected readonly typeLabels = MAINTENANCE_TYPE_LABEL;
  protected readonly statuses = Object.keys(MAINTENANCE_STATUS_LABEL);

  protected get maintainances() {
    const statut = this.statutFilter();
    return this.maintenanceService
      .maintainances()
      .filter((maintenance) => statut === '' || maintenance.statut === statut)
      .sort((a, b) => a.datePrevue.localeCompare(b.datePrevue));
  }

  protected get upcoming() {
    return this.maintenanceService.getUpcomingMaintenances(7);
  }

  protected vehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicleService.getById(vehicleId);
    return vehicle ? vehicle.immatriculation : '—';
  }

  protected start(id: string): void {
    const result = this.maintenanceService.start(id);
    if (result.ok) {
      this.notifications.success('Entretien démarré');
    } else {
      this.notifications.error(result.error ?? 'Action impossible');
    }
  }

  protected openComplete(id: string): void {
    const maintenance = this.maintenanceService.getById(id);
    this.completing.set({
      id,
      coutReel: maintenance?.coutEstime ?? 0,
    });
  }

  protected updateCompleteCost(value: string): void {
    const state = this.completing();
    if (!state) {
      return;
    }
    this.completing.set({ ...state, coutReel: Number(value) });
  }

  protected cancelComplete(): void {
    this.completing.set(null);
  }

  protected confirmComplete(): void {
    const state = this.completing();
    if (!state) {
      return;
    }
    const result = this.maintenanceService.complete(state.id, state.coutReel);
    this.completing.set(null);
    if (result.ok) {
      this.notifications.success('Entretien terminé, véhicule de nouveau disponible');
    } else {
      this.notifications.error(result.error ?? 'Action impossible');
    }
  }

  protected askDelete(id: string): void {
    this.pendingDelete.set(id);
  }

  protected cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const id = this.pendingDelete();
    if (!id) {
      return;
    }
    const result = this.maintenanceService.delete(id);
    this.pendingDelete.set(null);
    if (result.ok) {
      this.notifications.success('Entretien supprimé');
    } else {
      this.notifications.error(result.error ?? 'Suppression impossible');
    }
  }

  protected statusClass(statut: MaintenanceStatus): string {
    switch (statut) {
      case 'PLANIFIE':
        return 'bg-amber-100 text-amber-700';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-700';
      case 'TERMINE':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-200 text-slate-600';
    }
  }
}
