## ADDED Requirements

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
