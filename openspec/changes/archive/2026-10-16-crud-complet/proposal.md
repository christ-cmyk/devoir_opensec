# Proposition : CRUD complet sur Affectations, Entretiens et Pleins

## Why
Les exigences communes du projet imposent un CRUD complet (créer, consulter,
modifier, supprimer) sur les quatre entités métier : Véhicules, Affectations,
Entretiens et Pleins de carburant. La spec initiale `init-parc-auto` ne couvre
que la création, la consultation et les actions métier (clôture) pour
Affectations, Entretiens et Pleins. Il manque l'édition et la suppression.

## What Changes
- Ajout des exigences d'édition et de suppression pour les affectations
- Ajout des exigences d'édition et de suppression pour les entretiens
- Ajout des exigences d'édition et de suppression pour les pleins de carburant

## Impact
- Specs affectées : openspec/specs/affectations, openspec/specs/entretiens,
  openspec/specs/carburant
- Code : services (méthodes update/delete) et composants de formulaire/liste
