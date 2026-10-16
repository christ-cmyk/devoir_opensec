import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AssignmentService } from '../../core/services/assignment.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog';
import { ASSIGNMENT_STATUS_LABEL } from '../../core/utils/labels';

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, ConfirmDialog],
  templateUrl: './assignment-list.html',
  styleUrl: './assignment-list.css',
})
export class AssignmentList {
  protected readonly assignmentService = inject(AssignmentService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly userService = inject(UserService);
  protected readonly notifications = inject(NotificationService);

  protected readonly statutFilter = signal('');
  protected readonly pendingDelete = signal<string | null>(null);

  protected readonly statusLabels = ASSIGNMENT_STATUS_LABEL;
  protected readonly statuses = ['EN_COURS', 'TERMINEE', 'ANNULEE'];

  protected get assignments() {
    const statut = this.statutFilter();
    return this.assignmentService
      .assignments()
      .filter((assignment) => statut === '' || assignment.statut === statut)
      .sort((a, b) => b.dateDebut.localeCompare(a.dateDebut));
  }

  protected vehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicleService.getById(vehicleId);
    return vehicle ? `${vehicle.immatriculation} — ${vehicle.marque} ${vehicle.modele}` : '—';
  }

  protected driverLabel(driverId: string): string {
    const driver = this.userService.getById(driverId);
    return driver ? `${driver.prenom} ${driver.nom}` : '—';
  }

  protected terminate(id: string): void {
    const result = this.assignmentService.terminate(id);
    if (result.ok) {
      this.notifications.success('Affectation terminée, véhicule de nouveau disponible');
    } else {
      this.notifications.error(result.error ?? 'Action impossible');
    }
  }

  protected cancelAssignment(id: string): void {
    const result = this.assignmentService.cancel(id);
    if (result.ok) {
      this.notifications.success('Affectation annulée');
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
    const result = this.assignmentService.delete(id);
    this.pendingDelete.set(null);
    if (result.ok) {
      this.notifications.success('Affectation supprimée');
    } else {
      this.notifications.error(result.error ?? 'Suppression impossible');
    }
  }
}
