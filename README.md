# Pathlight

Pathlight is a React single-page application for student career exploration and learning planning. It uses Vite for development and production builds, Firebase Authentication for sign-in, and Cloud Firestore for user profiles.

> **Implementation status:** this repository is an evolving prototype, not a finished full-stack product. The Career Explorer uses local mock data. Learning Hub, AI Mentor, Assessments, Scholarships, and Opportunities currently render placeholder screens. No backend service is included in this repository.

## What is implemented

- **Public experience:** landing page, registration, and login routes.
- **Authentication:** email/password sign-up and sign-in through Firebase Authentication.
- **Profile and onboarding:** profile state is shared through React context; profile documents are stored in the Firestore `users` collection.
- **Career Explorer:** searchable/filterable career cards and detail pages driven by local catalogue data. Interest overlap is derived from explicit profile tags; it is not an AI recommendation model. Salary ranges and market outlook labels in the catalogue remain illustrative placeholders.
- **Application shell:** protected routes, dashboard, profile/settings screens, reusable UI/design-system components, and an English-only interface until complete translations are available.
- **API client foundation:** a small fetch client exists for a future backend. It does not mean the backend is included or deployed.

## Stack

- React 18, React Router, Vite 5
- Tailwind CSS 4
- Firebase Authentication and Cloud Firestore
- i18next / react-i18next
- React Leaflet (dependency available for map-related features)

## Requirements

- Node.js 20 or a compatible supported Node.js version
- npm (the lockfile is committed; use `npm ci` for reproducible installs)
- A Firebase project with **Email/Password Authentication** enabled and Cloud Firestore configured to use the app. The public landing page can load without Firebase variables; login and registration will show setup instructions until the required values are configured.

## Run locally

1. Clone and enter the repository:

   ```bash
   git clone https://github.com/guruPrasath4707/FireStarter4.git
   cd FireStarter4
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create your local environment file:

   **PowerShell**
   ```powershell
   Copy-Item .env.example .env.local
   ```

   **macOS / Linux**
   ```bash
   cp .env.example .env.local
   ```

4. Fill the `VITE_FIREBASE_*` values with the web-app configuration from your Firebase project settings. Leave `VITE_API_URL` at its default unless you have a compatible backend running.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Vite prints the local URL in the terminal (normally `http://localhost:5173`).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the built app locally |

There is a Node.js built-in unit test suite for route decisions, Firebase environment validation, career-interest matching, and profile-form logic. CI runs `npm ci`, `npm test`, and `npm run build`; a successful build is not proof that Firebase rules, authentication flows, or all UI interactions work end to end.

## Environment variables

See [`.env.example`](.env.example). Vite exposes variables prefixed with `VITE_` to client-side code, so **never put private keys, service-account credentials, or other server secrets in these variables**. Firebase web configuration is intended for client apps, but secure the project with appropriate API-key restrictions, Firebase Authentication settings, and Firestore Security Rules. Do not rely on the front end alone to protect user data.

The API client currently defaults to `http://localhost:5000` when `VITE_API_URL` is unset. No server for that URL is included here.

## Project map

```text
src/
  components/       Shared layout and UI components
  context/          Authentication and profile state
  design-system/    Reusable visual components and tokens
  features/careers/ Career Explorer, details, service, and mock dataset
  layouts/          Public, authenticated, and auth layouts
  pages/            Public, auth, app, and placeholder pages
  routes/           Route definitions and navigation metadata
  services/         Firestore helpers and generic API client
  firebase.js       Firebase client setup from environment variables
  i18n.js            i18next initialization
```

## Current priorities

1. Establish repeatable CI and local configuration (this baseline).
2. Add tests around authentication/profile behavior and career filtering.
3. Replace placeholder screens incrementally with working, accessible features.
4. Replace mock career data only after a real data source and recommendation criteria are defined.
5. Add an actual backend only when its API contract, authorization, deployment, and error handling are ready.

## Contributing

Work on a feature branch, keep secrets and local environment files out of commits, run `npm ci` and `npm run build`, and open a pull request with a summary of behavior changes and test results.
