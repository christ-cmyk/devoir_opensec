# donnees Specification

## Purpose
Garantir des identifiants uniques, une réinitialisation complète des données locales et un jeu de démonstration au premier lancement.

## Requirements

### Requirement: Identifiants uniques
Le système SHALL attribuer un identifiant unique à toute entité créée,
y compris lorsque l'identifiant fourni est vide.

#### Scenario: Création avec identifiant vide
- GIVEN un appel de création avec un identifiant vide
- WHEN l'entité est persistée
- THEN un identifiant unique non vide lui est attribué
- AND l'entité est relisible par cet identifiant

### Requirement: Réinitialisation des données
Le système SHALL permettre de supprimer l'intégralité des données
applicatives stockées localement.

#### Scenario: Purge complète
- GIVEN des données applicatives présentes (utilisateurs, véhicules, etc.)
- WHEN l'utilisateur confirme la réinitialisation
- THEN toutes les clés applicatives sont supprimées
- AND la session courante est invalidée

### Requirement: Jeu de démonstration
Le système SHALL injecter un jeu de démonstration au premier lancement
(3 comptes, véhicules, affectations, entretiens, pleins) afin de rendre
l'application immédiatement utilisable, et le restaurer après
réinitialisation.

#### Scenario: Premier lancement
- GIVEN un stockage local vide
- WHEN l'application démarre
- THEN un compte ADMIN, un GESTIONNAIRE et un CONDUCTEUR sont créés
- AND des véhicules, affectations, entretiens et pleins de démonstration existent

#### Scenario: Restauration après réinitialisation
- GIVEN une réinitialisation confirmée
- WHEN l'application est rechargée
- THEN le jeu de démonstration est réinjecté
