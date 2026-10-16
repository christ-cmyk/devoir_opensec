## ADDED Requirements

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
