import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'vehicules',
        canActivate: [roleGuard('ADMIN', 'GESTIONNAIRE')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/vehicules/vehicle-list').then(
                (m) => m.VehicleList
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/vehicules/vehicle-form').then(
                (m) => m.VehicleForm
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/vehicules/vehicle-detail').then(
                (m) => m.VehicleDetail
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/vehicules/vehicle-form').then(
                (m) => m.VehicleForm
              ),
          },
        ],
      },
      {
        path: 'affectations',
        canActivate: [roleGuard('ADMIN', 'GESTIONNAIRE')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/affectations/assignment-list').then(
                (m) => m.AssignmentList
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/affectations/assignment-form').then(
                (m) => m.AssignmentForm
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/affectations/assignment-form').then(
                (m) => m.AssignmentForm
              ),
          },
        ],
      },
      {
        path: 'entretiens',
        canActivate: [roleGuard('ADMIN', 'GESTIONNAIRE')],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/entretiens/maintenance-list').then(
                (m) => m.MaintenanceList
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/entretiens/maintenance-form').then(
                (m) => m.MaintenanceForm
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/entretiens/maintenance-form').then(
                (m) => m.MaintenanceForm
              ),
          },
        ],
      },
      {
        path: 'carburant',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/carburant/fuel-list').then((m) => m.FuelList),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/carburant/fuel-form').then((m) => m.FuelForm),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/carburant/fuel-form').then((m) => m.FuelForm),
          },
        ],
      },
      {
        path: 'utilisateurs',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () =>
          import('./features/utilisateurs/user-list').then((m) => m.UserList),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
  },
];
