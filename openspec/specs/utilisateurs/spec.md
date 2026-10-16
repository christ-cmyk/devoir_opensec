# utilisateurs Specification

## Purpose
Permettre à un administrateur de lister les utilisateurs, modifier leurs rôles et supprimer des comptes.

## Requirements

### Requirement: Gestion des utilisateurs
Le système SHALL permettre à un ADMIN de lister tous les utilisateurs,
changer leur rôle, et les supprimer (sauf lui-même).

#### Scenario: Changement de rôle
- GIVEN un ADMIN sur /utilisateurs
- WHEN il change le rôle d'un utilisateur de CONDUCTEUR à GESTIONNAIRE
- THEN le rôle est mis à jour immédiatement
