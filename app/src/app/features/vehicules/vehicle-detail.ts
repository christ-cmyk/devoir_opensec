import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { AssignmentService } from '../../core/services/assignment.service';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { FuelService } from '../../core/services/fuel.service';
import { UserService } from '../../core/services/user.service';
import {
  ASSIGNMENT_STATUS_LABEL,
  FUEL_TYPE_LABEL,
  MAINTENANCE_STATUS_LABEL,
  MAINTENANCE_TYPE_LABEL,
  VEHICLE_STATUS_LABEL,
} from '../../core/utils/labels';
import { Vehicle } from '../../core/models/vehicle';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [DecimalPipe, DatePipe, RouterLink],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail {
  protected readonly vehicleService = inject(VehicleService);
  protected readonly assignmentService = inject(AssignmentService);
  protected readonly maintenanceService = inject(MaintenanceService);
  protected readonly fuelService = inject(FuelService);
  protected readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly statusLabels = VEHICLE_STATUS_LABEL;
  protected readonly fuelLabels = FUEL_TYPE_LABEL;
  protected readonly assignmentLabels = ASSIGNMENT_STATUS_LABEL;
  protected readonly maintenanceLabels = MAINTENANCE_STATUS_LABEL;
  protected readonly maintenanceTypeLabels = MAINTENANCE_TYPE_LABEL;

  protected readonly vehicle = signal<Vehicle | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const vehicle = id ? this.vehicleService.getById(id) : null;
    if (!vehicle) {
      this.router.navigate(['/vehicules']);
      return;
    }
    this.vehicle.set(vehicle);
  }

  protected get assignments() {
    return this.assignmentService.getByVehicle(this.vehicle()?.id ?? '');
  }

  protected get maintainances() {
    return this.maintenanceService.getByVehicle(this.vehicle()?.id ?? '');
  }

  protected get fuelRecords() {
    return this.fuelService.getByVehicle(this.vehicle()?.id ?? '');
  }

  protected get averageConsumption(): number | null {
    return this.fuelService.getAverageConsumption(this.vehicle()?.id ?? '');
  }

  protected driverName(driverId: string): string {
    const driver = this.userService.getById(driverId);
    return driver ? `${driver.prenom} ${driver.nom}` : 'â€”';
  }
}
