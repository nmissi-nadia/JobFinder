# JobFinder - Application de Recherche d'Emploi

## 📋 Description du Projet

JobFinder est une application web Angular moderne permettant aux utilisateurs de rechercher des offres d'emploi, de gérer leurs favoris et de suivre leurs candidatures. L'application utilise l'API TheMuse pour récupérer les offres d'emploi en temps réel et offre une expérience utilisateur fluide et intuitive.

## 🎯 Objectifs

- Faciliter la recherche d'emploi avec des filtres avancés
- Permettre aux utilisateurs de sauvegarder leurs offres favorites
- Suivre l'état des candidatures (en attente, accepté, refusé)
- Gérer un profil utilisateur personnalisé
- Offrir une interface moderne et responsive

## 🚀 Technologies Utilisées

### Frontend
- **Angular 19** - Framework principal
- **TypeScript** - Langage de programmation
- **NgRx** - Gestion d'état (Redux pattern)
- **RxJS** - Programmation réactive
- **Tailwind CSS** - Framework CSS utilitaire
- **Reactive Forms** - Gestion des formulaires avec validation

### Backend (Simulation)
- **JSON Server** - API REST simulée pour la persistance des données

### API Externe
- **TheMuse API** - Source des offres d'emploi

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd job-finder
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Installer JSON Server globalement** (si ce n'est pas déjà fait)
```bash
npm install -g json-server
```

## 🎮 Démarrage de l'Application

### 1. Démarrer le serveur JSON Server (Backend simulé)
```bash
json-server --watch db.json --port 3000
```

Le serveur sera accessible sur `http://localhost:3000`

### 2. Démarrer l'application Angular (Frontend)
Dans un nouveau terminal :
```bash
npm start
```
ou
```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## 📁 Structure du Projet

```
job-finder/
├── src/
│   ├── app/
│   │   ├── core/                    # Services et modèles partagés
│   │   │   ├── guards/              # Guards de navigation
│   │   │   ├── interceptors/        # HTTP Interceptors
│   │   │   ├── models/              # Modèles de données
│   │   │   └── services/            # Services métier
│   │   ├── features/                # Modules fonctionnels
│   │   │   ├── auth/                # Authentification
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── jobs/                # Gestion des offres
│   │   │   │   ├── job-list/
│   │   │   │   └── job-detail/
│   │   │   ├── favorites/           # Favoris
│   │   │   ├── applications/        # Suivi des candidatures
│   │   │   ├── profile/             # Profil utilisateur
│   │   │   └── dashboard/           # Tableau de bord
│   │   ├── shared/                  # Composants partagés
│   │   │   └── components/
│   │   │       ├── header/
│   │   │       ├── footer/
│   │   │       └── loading-spinner/
│   │   ├── state/                   # NgRx State Management
│   │   │   ├── favorites/
│   │   │   │   ├── favorites.actions.ts
│   │   │   │   ├── favorites.reducer.ts
│   │   │   │   ├── favorites.effects.ts
│   │   │   │   └── favorites.selectors.ts
│   │   │   └── applications/
│   │   │       ├── applications.actions.ts
│   │   │       ├── applications.reducer.ts
│   │   │       ├── applications.effects.ts
│   │   │       └── applications.selectors.ts
│   │   ├── app.config.ts            # Configuration de l'application
│   │   └── app.routes.ts            # Configuration des routes
│   ├── styles.css                   # Styles globaux
│   └── index.html
├── db.json                          # Base de données JSON Server
├── package.json
└── README.md
```

## ✨ Fonctionnalités Implémentées

### 🔐 Authentification
- ✅ Inscription avec validation complète (email, mot de passe fort)
- ✅ Connexion sécurisée
- ✅ Gestion de session avec sessionStorage
- ✅ Guards pour protéger les routes

### 🔍 Recherche d'Emploi
- ✅ Recherche par mots-clés et localisation
- ✅ Affichage paginé avec infinite scroll
- ✅ Détails complets de chaque offre
- ✅ Lien direct vers l'offre originale

### ⭐ Gestion des Favoris (NgRx)
- ✅ Ajout/Retrait des favoris
- ✅ Page dédiée aux favoris
- ✅ Indicateurs visuels sur les offres favorites
- ✅ Persistance des données

### 📋 Suivi des Candidatures (NgRx)
- ✅ Ajout de candidatures depuis les offres
- ✅ Gestion des statuts (En attente, Accepté, Refusé)
- ✅ Notes personnelles pour chaque candidature
- ✅ Filtrage par statut
- ✅ Indicateurs visuels sur les offres suivies
- ✅ Validation des notes (max 500 caractères)

### 👤 Profil Utilisateur
- ✅ Affichage et modification du profil
- ✅ Validation des champs (Reactive Forms)
- ✅ Mise à jour en temps réel

### 🎨 Interface Utilisateur
- ✅ Design moderne et responsive
- ✅ Animations et transitions fluides
- ✅ Messages d'erreur et de succès
- ✅ Composant de chargement réutilisable
- ✅ Navigation intuitive avec header/footer

### 🛡️ Validation et Gestion des Erreurs
- ✅ Reactive Forms avec validations métier
- ✅ Validation email (format)
- ✅ Validation mot de passe (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)
- ✅ Messages d'erreur contextuels par champ
- ✅ Intercepteur HTTP pour gestion centralisée des erreurs
- ✅ Redirection automatique sur erreur 401

## 🏗️ Architecture et Bonnes Pratiques

### NgRx State Management
- **Actions** : Définition des actions pour favorites et applications
- **Reducers** : Gestion immutable de l'état
- **Effects** : Gestion des effets de bord (appels API)
- **Selectors** : Sélection optimisée des données

### Reactive Forms
- Validation déclarative avec Validators
- Messages d'erreur dynamiques
- Gestion de l'état des formulaires

### Guards et Interceptors
- **AuthGuard** : Protection des routes authentifiées
- **ErrorInterceptor** : Gestion centralisée des erreurs HTTP

### Lazy Loading
- Routes chargées à la demande pour optimiser les performances

### Composants Réutilisables
- Header, Footer, LoadingSpinner
- Séparation claire des responsabilités

## 🧪 Tests

### Lancer les tests unitaires
```bash
npm test
```

### Lancer les tests avec couverture
```bash
npm run test:coverage
```

## 🔧 Configuration

### Variables d'environnement
Les URLs des API sont configurées dans les services :
- **TheMuse API** : `https://www.themuse.com/api/public/jobs`
- **JSON Server** : `http://localhost:3000`

## 📊 Redux DevTools

L'application est configurée pour fonctionner avec Redux DevTools. Pour l'utiliser :
1. Installer l'extension Redux DevTools dans votre navigateur
2. Ouvrir les DevTools du navigateur
3. Sélectionner l'onglet "Redux"

## 🎓 Concepts Angular Utilisés

- **Standalone Components** (Angular 19)
- **Signals** pour la réactivité
- **Dependency Injection**
- **RxJS Operators** (map, switchMap, catchError, etc.)
- **Reactive Forms** avec validations
- **Route Guards**
- **HTTP Interceptors**
- **Lazy Loading**
- **OnPush Change Detection Strategy**

## 📝 Notes Techniques

### Choix de sessionStorage
L'application utilise `sessionStorage` pour stocker les données utilisateur pour des raisons de sécurité :
- Les données sont effacées à la fermeture du navigateur
- Réduit les risques de vol de session
- Alternative : `localStorage` pour une session persistante

### Gestion d'État
NgRx est utilisé pour :
- **Favorites** : Centralisation de la logique métier
- **Applications** : Cohérence des données à travers l'application

## 🚀 Améliorations Futures

- [ ] Authentification JWT avec backend réel
- [ ] Notifications push pour les nouvelles offres
- [ ] Export des candidatures en PDF
- [ ] Statistiques et graphiques de suivi
- [ ] Mode sombre
- [ ] Tests E2E avec Cypress

## 👥 Auteur

**Nadia Youcoubi**  
Projet réalisé dans le cadre du cours Angular - 2026

## 📄 Licence

Ce projet est à usage éducatif.

---

**Date de soutenance** : 13 février 2026  
**Version** : 1.0.0
