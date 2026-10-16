import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssignmentService } from '../../core/services/assignment.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './assignment-form.html',
  styleUrl: './assignment-form.css',
})
export class AssignmentForm {
  protected readonly assignmentService = inject(AssignmentService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly userService = inject(UserService);
  protected readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly assignmentId = signal<string | null>(null);
  protected readonly error = signal('');

  protected readonly form = signal({
    vehiculeId: '',
    conducteurId: '',
    dateDebut: new Date().toISOString().slice(0, 10),
    dateFin: '',
    motif: '',
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const assignment = this.assignmentService.getById(id);
      if (assignment) {
        this.isEdit.set(true);
        this.assignmentId.set(assignment.id);
        this.form.set({
          vehiculeId: assignment.vehiculeId,
          conducteurId: assignment.conducteurId,
          dateDebut: assignment.dateDebut,
          dateFin: assignment.dateFin,
          motif: assignment.motif,
        });
      } else {
        this.notifications.error('Affectation introuvable');
        this.router.navigate(['/affectations']);
      }
    }
  }

  protected get availableVehicles() {
    const currentId = this.form().vehiculeId;
    return this.vehicleService
      .vehicles()
      .filter(
        (vehicle) => vehicle.statut === 'DISPONIBLE' || vehicle.id === currentId
      );
  }

  protected get drivers() {
    return this.userService.getDrivers();
  }

  protected update(
    field: 'vehiculeId' | 'conducteurId' | 'dateDebut' | 'dateFin' | 'motif',
    value: string
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
    if (!value.conducteurId) {
      this.error.set('Sélectionnez un conducteur');
      return;
    }
    if (!value.motif.trim()) {
      this.error.set('Le motif est obligatoire');
      return;
    }

    if (this.isEdit() && this.assignmentId()) {
      const existing = this.assignmentService.getById(this.assignmentId()!);
      if (!existing) {
        this.error.set('Affectation introuvable');
        return;
      }
      const result = this.assignmentService.update({ ...existing, ...value });
      if (!result.ok) {
        this.error.set(result.error ?? 'Modification impossible');
        return;
      }
      this.notifications.success('Affectation modifiée');
      this.router.navigate(['/affectations']);
      return;
    }

    const result = this.assignmentService.create(value);
    if (!result.ok) {
      this.error.set(result.error ?? 'Création impossible');
      return;
    }
    this.notifications.success('Affectation créée, véhicule marqué comme affecté');
    this.router.navigate(['/affectations']);
  }
}
