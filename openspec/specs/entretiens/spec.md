# entretiens Specification

## Purpose
Planifier, suivre et clôturer les entretiens des véhicules, avec alerte pour les échéances à sept jours.

## Requirements

### Requirement: Planifier un entretien
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de planifier un entretien.

Un entretien SHALL contenir : id, vehiculeId, type (PREVENTIF | CORRECTIF | CONTROLE_TECHNIQUE),
description, datePrevue, coutEstime, coutReel (optionnel),
statut (PLANIFIE | EN_COURS | TERMINE | ANNULE).

#### Scenario: Planification
- GIVEN un véhicule existant
- WHEN le gestionnaire crée un entretien avec date et type
- THEN l'entretien est enregistré avec statut PLANIFIE

### Requirement: Alerte entretien à venir
Le système SHALL afficher une alerte sur le dashboard pour les entretiens
planifiés dans les 7 prochains jours.

#### Scenario: Alerte
- GIVEN un entretien PLANIFIE dans 3 jours
- WHEN le dashboard est chargé
- THEN l'entretien apparaît dans la section "Alertes"

### Requirement: Terminer un entretien
Le système SHALL permettre de marquer un entretien comme TERMINE avec un coût réel.

#### Scenario: Clôture
- GIVEN un entretien EN_COURS
- WHEN le gestionnaire saisit le coût réel et valide
- THEN l'entretien passe à TERMINE
- AND le véhicule repasse à DISPONIBLE

### Requirement: Éditer un entretien
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de modifier un entretien
existant (type, description, date, coût estimé) en conservant son identifiant.

#### Scenario: Modification de la date
- GIVEN un entretien PLANIFIE
- WHEN le gestionnaire change la date prévue et valide
- THEN la nouvelle date est enregistrée
- AND l'entretien reste en statut PLANIFIE

### Requirement: Supprimer un entretien
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de supprimer un entretien
après confirmation.

#### Scenario: Suppression d'un entretien non terminé
- GIVEN un entretien PLANIFIE sur un véhicule EN_ENTRETIEN
- WHEN le gestionnaire confirme la suppression
- THEN l'entretien est supprimé
- AND le véhicule repasse au statut DISPONIBLE
