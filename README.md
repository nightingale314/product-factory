## Description

Fullstack app built with Next 15, Prisma, Postgres (NeonTech). Next 15 uses React 19, but as I have never used React 19 before and for the interest of time, I will instead use React 18 principles.

## Setup

1. Setup an account + project at neon tech, it's a managed Postgres provider.
2. Paste your project's database url at `DATABASE_URL`
3. Generate a random Auth secret at `AUTH_SECRET`
4. Run `yarn prisma generate`
5. Run `npx prisma migrate dev`

## Running local

Run the development server

```bash
yarn dev
```
