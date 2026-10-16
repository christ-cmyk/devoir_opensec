## ADDED Requirements

### Requirement: Éditer un plein
Le système SHALL permettre à un utilisateur de modifier un plein existant
(litres, prix total, kilométrage, station, date).

#### Scenario: Correction d'un plein
- GIVEN un plein déjà enregistré
- WHEN le conducteur corrige le prix total et valide
- THEN le plein est mis à jour
- AND la consommation moyenne du véhicule est recalculée

### Requirement: Supprimer un plein
Le système SHALL permettre de supprimer un plein après confirmation.

#### Scenario: Suppression d'un plein
- GIVEN un véhicule avec au moins 2 pleins
- WHEN l'utilisateur confirme la suppression d'un plein
- THEN le plein est supprimé de l'historique
- AND la consommation moyenne est recalculée
