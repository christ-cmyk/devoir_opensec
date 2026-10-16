# Design technique

## Approche
- Réutilisation du `StorageService` générique (`update`, `delete`) déjà prévu
  dans le design de `init-parc-auto`
- Les formulaires d'édition réutilisent le même composant que la création,
  avec détection de la présence d'un id dans l'URL
- La suppression passe par une confirmation avant appel du service
- Aucune nouvelle dépendance, aucune modification d'architecture

## Règles de cohérence
- Supprimer une affectation qui est EN_COURS restitue le véhicule DISPONIBLE
- Supprimer un entretien non terminé restitue le véhicule DISPONIBLE s'il était
  en EN_ENTRETIEN
- La suppression d'un plein recalcule la consommation moyenne affichée
