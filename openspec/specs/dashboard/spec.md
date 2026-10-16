# dashboard Specification

## Purpose
Offrir une vision synthétique de la flotte : indicateurs clés, répartition par statut, coûts carburant, alertes d'entretien, adaptée au rôle de l'utilisateur.

## Requirements

### Requirement: Indicateurs clés
Le tableau de bord SHALL afficher :
- Nombre total de véhicules
- Répartition par statut (graphique en anneau)
- Coût total carburant du mois en cours
- Nombre d'entretiens planifiés dans les 7 jours
- Top 3 véhicules les plus utilisés

#### Scenario: Affichage
- GIVEN un utilisateur connecté
- WHEN il accède à /dashboard
- THEN les indicateurs s'affichent avec des données à jour

### Requirement: Accès selon rôle
Le CONDUCTEUR SHALL voir uniquement : ses affectations en cours, ses derniers pleins.
Pas les indicateurs financiers globaux.

#### Scenario: Dashboard conducteur
- GIVEN un CONDUCTEUR connecté
- WHEN il accède à /dashboard
- THEN il voit ses affectations en cours et ses derniers pleins
- AND les indicateurs financiers globaux ne sont pas affichés
