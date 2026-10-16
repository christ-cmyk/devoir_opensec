import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FuelService } from '../../core/services/fuel.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'app-fuel-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe, ConfirmDialog],
  templateUrl: './fuel-list.html',
  styleUrl: './fuel-list.css',
})
export class FuelList {
  protected readonly fuelService = inject(FuelService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly auth = inject(AuthService);
  protected readonly notifications = inject(NotificationService);

  protected readonly vehicleFilter = signal('');
  protected readonly pendingDelete = signal<string | null>(null);

  protected get records() {
    const user = this.auth.currentUser();
    const vehicleId = this.vehicleFilter();
    return this.fuelService
      .records()
      .filter((record) => (user?.role === 'CONDUCTEUR' ? record.conducteurId === user.id : true))
      .filter((record) => (vehicleId === '' ? true : record.vehiculeId === vehicleId))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  protected get vehicles() {
    if (this.auth.currentUser()?.role === 'CONDUCTEUR') {
      const userId = this.auth.currentUser()?.id;
      const ownedIds = new Set(
        this.fuelService
          .records()
          .filter((record) => record.conducteurId === userId)
          .map((record) => record.vehiculeId)
      );
      return this.vehicleService.vehicles().filter((v) => ownedIds.has(v.id));
    }
    return this.vehicleService.vehicles();
  }

  protected get averageConsumption(): number | null {
    if (!this.vehicleFilter()) {
      return null;
    }
    return this.fuelService.getAverageConsumption(this.vehicleFilter());
  }

  protected vehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicleService.getById(vehicleId);
    return vehicle ? `${vehicle.immatriculation} — ${vehicle.marque} ${vehicle.modele}` : '—';
  }

  protected get totalCost(): number {
    return Math.round(
      this.records.reduce((total, record) => total + record.prixTotal, 0) * 100
    ) / 100;
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
    const result = this.fuelService.delete(id);
    this.pendingDelete.set(null);
    if (result.ok) {
      this.notifications.success('Plein supprimé, consommation recalculée');
    } else {
      this.notifications.error(result.error ?? 'Suppression impossible');
    }
  }
}
