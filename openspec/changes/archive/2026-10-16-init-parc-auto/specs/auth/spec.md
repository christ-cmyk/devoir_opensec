## ADDED Requirements

### Requirement: Inscription
Le système SHALL permettre à un visiteur de créer un compte avec email et mot de passe.
Le mot de passe SHALL être stocké hashé (SHA-256 + salt) et jamais en clair.

#### Scenario: Inscription réussie
- GIVEN un visiteur sur la page /register
- WHEN il saisit un email valide, un mot de passe (>= 8 caractères) et confirme
- THEN un compte est créé avec le rôle CONDUCTEUR par défaut
- AND il est redirigé vers /login

#### Scenario: Email déjà utilisé
- GIVEN un visiteur sur /register
- WHEN il saisit un email déjà présent en base
- THEN un message d'erreur s'affiche
- AND aucun compte n'est créé

### Requirement: Connexion
Le système SHALL authentifier un utilisateur avec email + mot de passe.

#### Scenario: Connexion réussie
- GIVEN un utilisateur inscrit
- WHEN il saisit ses identifiants corrects
- THEN il est redirigé vers /dashboard
- AND sa session est persistée (localStorage)

#### Scenario: Mauvais mot de passe
- GIVEN un utilisateur inscrit
- WHEN il saisit un mot de passe incorrect
- THEN un message "Identifiants invalides" s'affiche

### Requirement: Déconnexion
Le système SHALL permettre à un utilisateur connecté de se déconnecter.
Le système SHALL vider la session et rediriger vers /login.

#### Scenario: Déconnexion réussie
- GIVEN un utilisateur connecté sur /dashboard
- WHEN il clique sur "Déconnexion"
- THEN sa session est vidée
- AND il est redirigé vers /login

### Requirement: Rôles et droits
Le système SHALL gérer 3 rôles : ADMIN, GESTIONNAIRE, CONDUCTEUR.
- ADMIN : accès total
- GESTIONNAIRE : véhicules, affectations, entretiens, carburant, dashboard (pas utilisateurs)
- CONDUCTEUR : dashboard limité, ses affectations, ses pleins

#### Scenario: Accès refusé
- GIVEN un CONDUCTEUR connecté
- WHEN il tente d'accéder à /vehicules
- THEN il est redirigé vers /dashboard avec un message "Accès refusé"
