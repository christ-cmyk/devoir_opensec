# Design technique

## Stack
- Angular 17+ (standalone, signals, @if/@for)
- TailwindCSS
- Chart.js + ng2-charts
- localStorage via StorageService
- Web Crypto API (SHA-256 + salt)

## Architecture
src/app/
├── core/
│   ├── models/       (user, vehicle, assignment, maintenance, fuel-record)
│   ├── services/     (storage, auth, vehicle, assignment, maintenance, fuel, dashboard)
│   ├── guards/       (auth.guard.ts, role.guard.ts)
│   └── utils/        (crypto.util.ts)
├── features/
│   ├── auth/         (login, register)
│   ├── dashboard/
│   ├── vehicules/
│   ├── affectations/
│   ├── entretiens/
│   ├── carburant/
│   └── utilisateurs/
├── shared/
│   ├── components/   (header, sidebar, confirm-dialog)
│   └── pipes/
├── app.routes.ts
└── app.config.ts
```

### Modèles TypeScript
```typescript
export type Role = 'ADMIN' | 'GESTIONNAIRE' | 'CONDUCTEUR';
export interface User {
  id: string; email: string; passwordHash: string; salt: string;
  nom: string; prenom: string; role: Role; createdAt: string;
}
export type VehicleStatus = 'DISPONIBLE' | 'AFFECTE' | 'EN_ENTRETIEN' | 'HORS_SERVICE';
export type FuelType = 'ESSENCE' | 'DIESEL' | 'ELECTRIQUE';
export interface Vehicle {
  id: string; immatriculation: string; marque: string; modele: string;
  annee: number; kilometrage: number; statut: VehicleStatus;
  typeCarburant: FuelType; dateAcquisition: string;
}
export interface Assignment {
  id: string; vehiculeId: string; conducteurId: string;
  dateDebut: string; dateFin: string; motif: string;
  statut: 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
}
export interface Maintenance {
  id: string; vehiculeId: string;
  type: 'PREVENTIF' | 'CORRECTIF' | 'CONTROLE_TECHNIQUE';
  description: string; datePrevue: string; coutEstime: number;
  coutReel?: number;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
}
export interface FuelRecord {
  id: string; vehiculeId: string; conducteurId: string; date: string;
  litres: number; prixTotal: number; kilometrageAuPlein: number; station: string;
}
```

### Sécurité
- SHA-256 + salt via `crypto.subtle.digest`
- Session en localStorage avec expiration 24h
- Guards fonctionnels sur les routes

### Alternatives écartées
- Firebase, IndexedDB, NgRx : non nécessaires pour ce périmètre
