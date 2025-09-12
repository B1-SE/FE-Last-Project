
# Advanced React + Firebase E-Commerce App

## Features
- Product catalog with category filtering (React Query, Firestore)
- Shopping cart with Redux Toolkit and sessionStorage persistence
- User authentication and profile management (Firebase Auth)
- Product and order management (Firestore)
- Checkout simulation and order history
- CI/CD with GitHub Actions and Vercel
- TypeScript, ESLint, Prettier, and TDD (Vitest)

## Setup
1. Clone the repo and install dependencies:
   ```sh
   git clone <your-repo-url>
   cd FE-Last-Project
   npm ci
   ```
2. Create a `.env` file with your Firebase config and Vercel token (see `.env.example` if present).
3. Start the dev server:
   ```sh
   npm start
   ```

## Environment
- Node.js 20+
- Vite
- Firebase project with Auth and Firestore enabled
- Vercel for deployment

## Testing & Linting
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Lint: `npm run lint`
- Format: `npm run format`

## Deployment
CI/CD is automated via GitHub Actions:
- On push to `main`, the app is built, tested, linted, and deployed to Vercel if all checks pass.
- Manual deploy: `npx vercel --yes --token $VERCEL_TOKEN`

## Troubleshooting
- **Build/test fails:** Run `npm run lint` and `npm test` locally to debug.
- **Firebase errors:** Check your `.env` and Firebase project settings.
- **Vercel deploy issues:** Ensure your Vercel token is set in GitHub secrets and your project is linked.

## Contributing
Open issues or PRs for improvements, bug fixes, or new features!
