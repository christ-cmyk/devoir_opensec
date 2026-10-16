# devoir_openspec — Gestion de parc automobile

Application front-end de gestion d'une flotte de véhicules d'entreprise,
développée selon la méthodologie **Spec-Driven Development (OpenSpec)**.

## Stack

| Domaine      | Technologie                                        |
| ------------ | -------------------------------------------------- |
| Framework    | Angular 21 (standalone components, signals)        |
| UI           | TailwindCSS 3                                      |
| Graphiques   | Chart.js 4 + ng2-charts 10                         |
| Persistance  | `localStorage` via un `StorageService` abstrait    |
| Auth         | Web Crypto API (SHA-256 + salt), 100 % front-end   |
| Tests        | Vitest (`ng test`)                                 |
| Déploiement  | Vercel                                             |

## Démarrage

```bash
cd app
npm install
npm start        # http://localhost:4200
```

Build de production :

```bash
cd app
npm run build    # sortie dans dist/app/browser
```

Tests unitaires :

```bash
cd app
ng test --watch=false
```

## Comptes de démonstration

Au premier lancement, un jeu de données de démonstration est injecté
(utilisateurs, véhicules, affectations, entretiens, pleins).

| Rôle         | Email                 | Mot de passe   |
| ------------ | --------------------- | -------------- |
| ADMIN        | admin@parc.fr         | Admin12345     |
| GESTIONNAIRE | gestion@parc.fr       | Gestion12345   |
| CONDUCTEUR   | conducteur@parc.fr    | Conduct12345   |

Le bouton **« Réinitialiser les données »** (barre latérale) vide le
`localStorage` puis restaure ce jeu de démonstration.

## Rôles et droits

- **ADMIN** : accès total, dont la gestion des utilisateurs
- **GESTIONNAIRE** : véhicules, affectations, entretiens, carburant, dashboard
- **CONDUCTEUR** : dashboard limité (ses affectations, ses derniers pleins),
  saisie de ses pleins

Les routes sont protégées par des guards fonctionnels
(`authGuard`, `roleGuard`). Un accès refusé redirige vers `/dashboard`
avec le message « Accès refusé ».

## Architecture

```
app/src/app/
├── core/
│   ├── models/     user, vehicle, assignment, maintenance, fuel-record
│   ├── services/   storage, auth, vehicle, assignment, maintenance,
│   │               fuel, dashboard, user, notification, seed
│   ├── guards/     auth.guard.ts, role.guard.ts
│   └── utils/      crypto.util.ts, labels.ts
├── features/
│   ├── auth/       login, register
│   ├── dashboard/  KPIs, graphique, alertes
│   ├── vehicules/  liste, formulaire, détail
│   ├── affectations/ liste, formulaire
│   ├── entretiens/ liste, formulaire
│   ├── carburant/  liste, formulaire
│   └── utilisateurs/ liste (ADMIN)
├── shared/components/  header, sidebar, confirm-dialog, toast
├── pages/not-found.ts
├── app.routes.ts
└── app.config.ts
```

## Méthodologie OpenSpec

Le projet suit la règle « pas de code sans spec ». Les artefacts sont dans
`openspec/` :

- `openspec/specs/` : spécifications de référence (7 capacités, 22 exigences)
- `openspec/changes/archive/` : changements archivés
  - `2026-10-16-init-parc-auto` : initialisation du projet
  - `2026-10-16-crud-complet` : édition et suppression complètes

```bash
openspec list --specs
openspec view
```

## Déploiement Vercel

1. Importer le dépôt GitHub dans Vercel
2. **Root Directory** : `app`
3. **Framework Preset** : Angular
4. **Build Command** : `ng build`
5. **Output Directory** : `dist/app/browser`
6. Deploy (les rewrites SPA sont définis dans `app/vercel.json`)

## Limites connues

- Données locales au navigateur (`localStorage`) : pas de partage multi-postes
- Pas de backend ni de synchronisation distante
- Pas de récupération de mot de passe (hash SHA-256 salé côté client)
