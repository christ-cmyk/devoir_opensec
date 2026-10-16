import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuelService } from '../../core/services/fuel.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-fuel-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './fuel-form.html',
  styleUrl: './fuel-form.css',
})
export class FuelForm {
  protected readonly fuelService = inject(FuelService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly userService = inject(UserService);
  protected readonly auth = inject(AuthService);
  protected readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly recordId = signal<string | null>(null);
  protected readonly error = signal('');

  protected readonly form = signal({
    vehiculeId: '',
    conducteurId: '',
    date: new Date().toISOString().slice(0, 10),
    litres: 0,
    prixTotal: 0,
    kilometrageAuPlein: 0,
    station: '',
  });

  constructor() {
    const user = this.auth.currentUser();
    if (user && user.role === 'CONDUCTEUR') {
      this.form.update((current) => ({ ...current, conducteurId: user.id }));
    } else if (user) {
      const driver = this.userService.getDrivers()[0];
      if (driver) {
        this.form.update((current) => ({ ...current, conducteurId: driver.id }));
      }
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const record = this.fuelService.getById(id);
      if (record) {
        this.isEdit.set(true);
        this.recordId.set(record.id);
        this.form.set({
          vehiculeId: record.vehiculeId,
          conducteurId: record.conducteurId,
          date: record.date,
          litres: record.litres,
          prixTotal: record.prixTotal,
          kilometrageAuPlein: record.kilometrageAuPlein,
          station: record.station,
        });
      } else {
        this.notifications.error('Plein introuvable');
        this.router.navigate(['/carburant']);
      }
    }
  }

  protected get vehicles() {
    return this.vehicleService.vehicles();
  }

  protected get drivers() {
    return this.userService.getDrivers();
  }

  protected get isConducteur(): boolean {
    return this.auth.currentUser()?.role === 'CONDUCTEUR';
  }

  protected update(
    field:
      | 'vehiculeId'
      | 'conducteurId'
      | 'date'
      | 'litres'
      | 'prixTotal'
      | 'kilometrageAuPlein'
      | 'station',
    value: string | number
  ): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  protected submit(): void {
    this.error.set('');
    const value = this.form();

    if (this.isConducteur && !value.conducteurId) {
      const user = this.auth.currentUser();
      value.conducteurId = user?.id ?? '';
    }

    if (this.isEdit() && this.recordId()) {
      const existing = this.fuelService.getById(this.recordId()!);
      if (!existing) {
        this.error.set('Plein introuvable');
        return;
      }
      const result = this.fuelService.update({ ...existing, ...value });
      if (!result.ok) {
        this.error.set(result.error ?? 'Modification impossible');
        return;
      }
      this.notifications.success('Plein modifié, consommation recalculée');
      this.router.navigate(['/carburant']);
      return;
    }

    const result = this.fuelService.create(value);
    if (!result.ok) {
      this.error.set(result.error ?? 'Création impossible');
      return;
    }
    this.notifications.success('Plein enregistré');
    this.router.navigate(['/carburant']);
  }
}
