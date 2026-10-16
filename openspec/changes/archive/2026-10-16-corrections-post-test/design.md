# Design technique

## Identifiants
- `StorageService.create` génère un identifiant dès que l'identifiant fourni
  est absent **ou vide** (`crypto.randomUUID()` avec repli horodatage)

## Réinitialisation
- `StorageService.clearAll` supprime toutes les clés applicatives :
  clés connues (`pma_*`) et toute clé préfixée `pma_`
- Après purge, `SeedService` réinjecte le jeu de démonstration au
  rechargement suivant (le drapeau `pma_seeded` ayant été supprimé)

## Jeu de démonstration
- 3 comptes : ADMIN, GESTIONNAIRE, CONDUCTEUR
- 5 véhicules couvrant les 4 statuts
- 1 affectation en cours, 3 entretiens, 5 pleins

## Vérification
- Tests unitaires Vitest : `StorageService`, `crypto.util`,
  `AssignmentService`, `Login`, `VehicleList`, `App`
