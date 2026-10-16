import { Injectable, inject } from '@angular/core';
import { AssignmentService } from './assignment.service';
import { FuelService } from './fuel.service';
import { MaintenanceService } from './maintenance.service';
import { VehicleService } from './vehicle.service';
import { VehicleStatus } from '../models/vehicle';

export interface StatusCount {
  statut: VehicleStatus;
  count: number;
}

export interface TopVehicle {
  vehicleId: string;
  immatriculation: string;
  label: string;
  usageCount: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly vehicles = inject(VehicleService);
  private readonly assignments = inject(AssignmentService);
  private readonly maintainances = inject(MaintenanceService);
  private readonly fuel = inject(FuelService);

  get totalVehicles(): number {
    return this.vehicles.vehicles().length;
  }

  get statusCounts(): StatusCount[] {
    const statuses: VehicleStatus[] = [
      'DISPONIBLE',
      'AFFECTE',
      'EN_ENTRETIEN',
      'HORS_SERVICE',
    ];
    return statuses.map((statut) => ({
      statut,
      count: this.vehicles.vehicles().filter((v) => v.statut === statut).length,
    }));
  }

  get monthFuelCost(): number {
    return this.fuel.getMonthFuelCost();
  }

  get upcomingMaintenanceCount(): number {
    return this.maintainances.getUpcomingMaintenances(7).length;
  }

  get topVehicles(): TopVehicle[] {
    return this.vehicles
      .vehicles()
      .map((vehicle) => ({
        vehicleId: vehicle.id,
        immatriculation: vehicle.immatriculation,
        label: `${vehicle.marque} ${vehicle.modele}`,
        usageCount: this.assignments.getByVehicle(vehicle.id).length,
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);
  }
}
