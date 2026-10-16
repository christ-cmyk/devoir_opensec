# Livrable — Gestion de parc automobile

## Liens

| Ressource | Lien |
| --- | --- |
| **Application en ligne** | https://app-ten-ruby-98.vercel.app |
| **Dépôt GitHub (public)** | https://github.com/christ-cmyk/devoir_opensec |

Les deux ressources sont **publiques** : aucune authentification n'est requise
pour consulter l'application ou le code source.

## Comptes de démonstration

Le jeu de données de démonstration est injecté automatiquement au premier
lancement.

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| ADMIN | admin@parc.fr | Admin12345 |
| GESTIONNAIRE | gestion@parc.fr | Gestion12345 |
| CONDUCTEUR | conducteur@parc.fr | Conduct12345 |

Le bouton **« Réinitialiser les données »** (barre latérale) restaure ce jeu
de démonstration.

## Lancer l'application en local

Prérequis : Node.js 20+ et npm.

```bash
git clone https://github.com/christ-cmyk/devoir_opensec.git
cd devoir_opensec/app
npm install
npm start
```

L'application est alors disponible sur **http://localhost:4200**.

## Lancer les tests

```bash
cd devoir_opensec/app
ng test --watch=false
```

## Build de production

```bash
cd devoir_opensec/app
npm run build
```

La sortie est générée dans `app/dist/app/browser`.

## Méthodologie

Projet développé en **Spec-Driven Development** avec OpenSpec : les
spécifications (`openspec/specs/`) ont été rédigées et validées avant toute
implémentation. Voir `README.md` à la racine pour l'architecture détaillée.
