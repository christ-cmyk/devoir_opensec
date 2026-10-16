## ADDED Requirements

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
