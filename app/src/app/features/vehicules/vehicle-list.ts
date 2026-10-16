import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import {
  FUEL_TYPE_LABEL,
  VEHICLE_STATUS_LABEL,
} from '../../core/utils/labels';
import { VehicleStatus } from '../../core/models/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialog, DecimalPipe],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList {
  protected readonly vehicleService = inject(VehicleService);
  protected readonly notifications = inject(NotificationService);
  protected readonly auth = inject(AuthService);

  protected readonly query = signal('');
  protected readonly statutFilter = signal('');
  protected readonly pendingDelete = signal<string | null>(null);

  protected readonly statusLabels = VEHICLE_STATUS_LABEL;
  protected readonly fuelLabels = FUEL_TYPE_LABEL;
  protected readonly statuses = Object.keys(VEHICLE_STATUS_LABEL) as VehicleStatus[];

  protected get vehicles() {
    return this.vehicleService.filter(this.query(), this.statutFilter());
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
    const result = this.vehicleService.delete(id);
    this.pendingDelete.set(null);
    if (result.ok) {
      this.notifications.success('Véhicule supprimé');
    } else {
      this.notifications.error(result.error ?? 'Suppression impossible');
    }
  }

  protected trackById(_index: number, vehicle: { id: string }): string {
    return vehicle.id;
  }
}
