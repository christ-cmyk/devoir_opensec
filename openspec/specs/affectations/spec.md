# affectations Specification

## Purpose
Permettre à un gestionnaire d'affecter un véhicule disponible à un conducteur sur une période donnée, sans conflit de dates, et de clôturer ou modifier ces affectations.

## Requirements

### Requirement: Affecter un véhicule
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE d'affecter un véhicule
à un conducteur sur une période donnée.

Une affectation SHALL contenir : id, vehiculeId, conducteurId, dateDebut, dateFin,
motif, statut (EN_COURS | TERMINEE | ANNULEE).

#### Scenario: Affectation valide
- GIVEN un véhicule avec statut DISPONIBLE
- AND un conducteur existant
- WHEN le gestionnaire crée une affectation avec dates valides
- THEN l'affectation est enregistrée
- AND le véhicule passe au statut AFFECTE

#### Scenario: Véhicule non disponible
- GIVEN un véhicule avec statut AFFECTE
- WHEN le gestionnaire tente de l'affecter à nouveau
- THEN un message "Véhicule non disponible" s'affiche

#### Scenario: Chevauchement de dates
- GIVEN un véhicule déjà affecté du 01/11 au 15/11
- WHEN le gestionnaire tente une affectation du 10/11 au 20/11
- THEN un message "Période en conflit" s'affiche

### Requirement: Clôturer une affectation
Le système SHALL permettre de marquer une affectation comme TERMINEE.
Le véhicule repasse alors au statut DISPONIBLE.

#### Scenario: Clôture
- GIVEN une affectation EN_COURS
- WHEN le gestionnaire clique sur "Terminer"
- THEN l'affectation passe à TERMINEE
- AND le véhicule redevient DISPONIBLE

### Requirement: Éditer une affectation
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de modifier une affectation
existante (période, motif, conducteur) en conservant son identifiant.

#### Scenario: Modification du motif
- GIVEN une affectation EN_COURS
- WHEN le gestionnaire modifie le motif et valide
- THEN la modification est enregistrée
- AND le nouveau motif apparaît dans la liste

### Requirement: Supprimer une affectation
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de supprimer une affectation
après confirmation.

#### Scenario: Suppression d'une affectation en cours
- GIVEN une affectation EN_COURS sur un véhicule AFFECTE
- WHEN le gestionnaire confirme la suppression
- THEN l'affectation est supprimée
- AND le véhicule repasse au statut DISPONIBLE

#### Scenario: Annulation de la suppression
- GIVEN une affectation affichée
- WHEN l'utilisateur annule la confirmation
- THEN l'affectation est conservée
