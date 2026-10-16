import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { AssignmentService } from '../../core/services/assignment.service';
import { FuelService } from '../../core/services/fuel.service';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { UserService } from '../../core/services/user.service';
import {
  MAINTENANCE_TYPE_LABEL,
  VEHICLE_STATUS_LABEL,
} from '../../core/utils/labels';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, DatePipe, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
  protected readonly dashboard = inject(DashboardService);
  protected readonly assignmentService = inject(AssignmentService);
  protected readonly fuelService = inject(FuelService);
  protected readonly maintenanceService = inject(MaintenanceService);
  protected readonly vehicleService = inject(VehicleService);
  protected readonly userService = inject(UserService);

  protected readonly statusLabels = VEHICLE_STATUS_LABEL;
  protected readonly maintenanceTypeLabels = MAINTENANCE_TYPE_LABEL;

  protected readonly isConducteur = computed(
    () => this.auth.currentUser()?.role === 'CONDUCTEUR'
  );

  protected readonly statusChartData = computed<ChartConfiguration<'doughnut'>['data']>(
    () => {
      const counts = this.dashboard.statusCounts;
      return {
        labels: counts.map((count) => VEHICLE_STATUS_LABEL[count.statut]),
        datasets: [
          {
            data: counts.map((count) => count.count),
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      };
    }
  );

  protected readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '65%',
  };

  protected get totalVehicles(): number {
    return this.dashboard.totalVehicles;
  }

  protected get monthFuelCost(): number {
    return this.dashboard.monthFuelCost;
  }

  protected get upcomingCount(): number {
    return this.dashboard.upcomingMaintenanceCount;
  }

  protected get activeAssignmentsCount(): number {
    return this.assignmentService
      .assignments()
      .filter((assignment) => assignment.statut === 'EN_COURS').length;
  }

  protected get topVehicles() {
    return this.dashboard.topVehicles;
  }

  protected get upcomingMaintenances() {
    return this.maintenanceService.getUpcomingMaintenances(7);
  }

  protected get myAssignments() {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return [];
    }
    return this.assignmentService
      .getByDriver(userId)
      .filter((assignment) => assignment.statut === 'EN_COURS')
      .sort((a, b) => a.dateDebut.localeCompare(b.dateDebut));
  }

  protected get myFuelRecords() {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return [];
    }
    return this.fuelService.getByDriver(userId).slice(0, 5);
  }

  protected vehicleLabel(vehicleId: string): string {
    const vehicle = this.vehicleService.getById(vehicleId);
    return vehicle ? `${vehicle.immatriculation} — ${vehicle.marque} ${vehicle.modele}` : '—';
  }

  protected driverLabel(driverId: string): string {
    const driver = this.userService.getById(driverId);
    return driver ? `${driver.prenom} ${driver.nom}` : '—';
  }
}
