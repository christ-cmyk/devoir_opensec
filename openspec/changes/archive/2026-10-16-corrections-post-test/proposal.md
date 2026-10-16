# Proposition : Corrections post-tests — données et identifiants

## Why
La phase de vérification (tests unitaires Vitest) a révélé deux défauts :
1. Un élément créé avec un identifiant vide se retrouve dupliqué sans clé
   exploitable, ce qui empêche toute lecture/édition ultérieure fiable.
2. La réinitialisation des données ne supprimait pas toutes les clés
   applicatives, laissant des données résiduelles incohérentes.

De plus, le comportement d'amorçage (jeu de démonstration au premier
lancement) n'était pas spécifié alors qu'il conditionne l'existence du
premier compte ADMIN.

## What Changes
- Garantie d'identifiants uniques à la création de toute entité
- Réinitialisation complète de toutes les clés applicatives
- Spécification du jeu de démonstration initial et de sa restauration
  après réinitialisation

## Impact
- Code : `StorageService` (create, clearAll), `SeedService`
- Nouvelle capacité spécifiée : `donnees`
