# Tâches d'implémentation

## 0. Setup projet
- [x] Créer projet Angular (ng new)
- [x] Installer TailwindCSS
- [x] Installer Chart.js + ng2-charts
- [x] Configurer routing
- [x] Créer structure dossiers (core, features, shared)

## 1. Core
- [x] Modèles TypeScript
- [x] StorageService (CRUD localStorage)
- [x] crypto.util.ts (hash SHA-256 + salt)
- [x] AuthService (register, login, logout, currentUser)
- [x] authGuard + roleGuard

## 2. Auth
- [x] Page /login
- [x] Page /register
- [x] Header avec nom utilisateur + bouton déconnexion
- [x] Redirection selon rôle

## 3. Véhicules
- [x] VehicleService
- [x] Liste + recherche + filtre statut
- [x] Formulaire création/édition
- [x] Suppression avec confirmation
- [x] Détail véhicule

## 4. Affectations
- [x] AssignmentService
- [x] Liste avec filtres
- [x] Formulaire création
- [x] Règle : véhicule disponible + pas de chevauchement
- [x] Action "Terminer"

## 5. Entretiens
- [x] MaintenanceService
- [x] Liste + filtres
- [x] Formulaire création
- [x] Action "Terminer avec coût réel"
- [x] Alerte 7 jours

## 6. Carburant
- [x] FuelService
- [x] Liste par véhicule
- [x] Formulaire saisie plein
- [x] Calcul consommation moyenne

## 7. Dashboard
- [x] KPIs
- [x] Graphique répartition statuts
- [x] Coût carburant du mois
- [x] Alertes entretiens
- [x] Vue adaptée selon rôle

## 8. Utilisateurs
- [x] Liste utilisateurs
- [x] Changement de rôle
- [x] Suppression

## 9. Finitions
- [x] Page 404
- [x] Responsive mobile
- [x] Bouton "Réinitialiser les données"
- [x] README.md

## 10. Déploiement
- [x] ng build --configuration production
- [ ] Push GitHub
- [ ] Déploiement Vercel
