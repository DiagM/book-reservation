This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
npm run prisma:seed  #for admin User
Admin USER:
email: admin@example.com
password: password
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Application de Réservation de Livres

Une application web pour la gestion des réservations de livres, permettant aux utilisateurs de se connecter, de s'inscrire et de gérer efficacement leurs réservations. Cette application est construite avec Next.js pour le frontend et Prisma avec PostgreSQL pour le backend.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Endpoints API](#endpoints-api)
- [Utilisation de l'application](#utilisation-de-lapplication)
- [Tests](#tests)
- [Contribuer](#contribuer)
- [Licence](#licence)
- [Contact](#contact)

## Fonctionnalités

- **Authentification Utilisateur** : Connexion et inscription sécurisées.
- **Gestion des Livres** : Les utilisateurs peuvent consulter les livres disponibles et effectuer des réservations.
- **Panneau Administratif** : Les utilisateurs administrateurs peuvent gérer les les livres.

## Technologies Utilisées

- **Frontend**: 
  - [Next.js](https://nextjs.org/) - Framework React pour les applications rendues côté serveur.
  - [React](https://reactjs.org/) - Bibliothèque JavaScript pour la création d'interfaces utilisateur.
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire pour le style.

- **Backend**: 
  - [Express.js](https://expressjs.com/) - Framework web pour Node.js.
  - [Prisma](https://www.prisma.io/) - ORM pour interagir avec la base de données.
  - [PostgreSQL](https://www.postgresql.org/) - Système de gestion de base de données relationnelle.
  - [bcrypt](https://www.npmjs.com/package/bcrypt) - Bibliothèque pour le hachage des mots de passe.
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Bibliothèque pour la génération et la vérification des JWT.





