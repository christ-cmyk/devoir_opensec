## ADDED Requirements

### Requirement: CRUD Véhicules
Le système SHALL permettre à un ADMIN ou GESTIONNAIRE de créer, consulter, modifier
et supprimer un véhicule.

Un véhicule SHALL contenir : id, immatriculation (unique), marque, modele, annee,
kilometrage, statut (DISPONIBLE | AFFECTE | EN_ENTRETIEN | HORS_SERVICE),
typeCarburant (ESSENCE | DIESEL | ELECTRIQUE), dateAcquisition.

#### Scenario: Création d'un véhicule
- GIVEN un GESTIONNAIRE connecté sur /vehicules/new
- WHEN il soumet le formulaire avec des données valides
- THEN le véhicule est enregistré avec statut DISPONIBLE
- AND il apparaît dans la liste

#### Scenario: Immatriculation en doublon
- GIVEN un GESTIONNAIRE sur /vehicules/new
- WHEN il saisit une immatriculation déjà existante
- THEN un message d'erreur s'affiche

#### Scenario: Suppression d'un véhicule affecté
- GIVEN un véhicule avec statut AFFECTE
- WHEN un ADMIN tente de le supprimer
- THEN la suppression est refusée
- AND un message "Véhicule actuellement affecté" s'affiche

### Requirement: Recherche et filtres
Le système SHALL permettre de rechercher un véhicule par immatriculation ou marque,
et de filtrer par statut.

#### Scenario: Recherche par immatriculation
- GIVEN la liste des véhicules
- WHEN l'utilisateur tape "AB-123" dans la barre de recherche
- THEN seuls les véhicules correspondants s'affichent

#### Scenario: Filtre par statut
- GIVEN la liste des véhicules
- WHEN l'utilisateur sélectionne "DISPONIBLE"
- THEN seuls les véhicules disponibles s'affichent
