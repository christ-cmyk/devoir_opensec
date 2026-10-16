# carburant Specification

## Purpose
Tracer les pleins de carburant par véhicule et conducteur et calculer la consommation moyenne (L/100km).

## Requirements

### Requirement: Saisir un plein
Le système SHALL permettre à un utilisateur connecté de saisir un plein.

Un plein SHALL contenir : id, vehiculeId, conducteurId, date, litres, prixTotal,
kilometrageAuPlein, station.

#### Scenario: Saisie valide
- GIVEN un utilisateur connecté
- WHEN il saisit un plein avec litres, prix, km
- THEN le plein est enregistré
- AND il apparaît dans l'historique du véhicule

### Requirement: Consommation moyenne
Le système SHALL calculer la consommation moyenne (L/100km) par véhicule
à partir des pleins enregistrés.

#### Scenario: Calcul
- GIVEN un véhicule avec au moins 2 pleins
- WHEN on consulte sa fiche
- THEN la consommation moyenne s'affiche

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
