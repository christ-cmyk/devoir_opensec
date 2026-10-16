# Proposition : Initialisation du projet — Gestion de parc automobile

## Contexte
Une entreprise dispose d'une flotte de véhicules (voitures, utilitaires, camions).
Aujourd'hui, le suivi se fait sur Excel : entretiens oubliés, carburant non tracé,
affectations floues. L'objectif est de centraliser la gestion dans une application web.

## Pourquoi
- Réduire les oublis d'entretien (amendes, pannes)
- Tracer la consommation de carburant par véhicule
- Savoir qui conduit quel véhicule et quand
- Donner une vision claire au gestionnaire de parc

## Ce qui change
- Création d'une application Angular (front-end only)
- Authentification locale (inscription, connexion, déconnexion, hash SHA-256 + salt)
- Gestion de 3 rôles : ADMIN, GESTIONNAIRE, CONDUCTEUR
- CRUD complet sur : Véhicules, Affectations, Entretiens, Pleins de carburant
- Recherche et filtres sur la liste des véhicules
- Tableau de bord avec indicateurs clés (statuts, coûts, alertes)

## Hors périmètre
- Backend / base de données distante (localStorage pour cette version)
- Gestion des amendes et assurances
- Intégration GPS temps réel
- Notifications email

## Retour arrière
- Les données sont stockées en localStorage, un bouton "Réinitialiser" permet
  de repartir de zéro. Aucune migration destructive.

## Critères de succès
- Un ADMIN peut gérer tous les utilisateurs et véhicules
- Un GESTIONNAIRE peut affecter un véhicule et planifier un entretien
- Un CONDUCTEUR voit ses affectations et saisit ses pleins
- Le dashboard affiche au moins 4 indicateurs
