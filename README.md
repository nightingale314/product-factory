## Description

Fullstack app built with Next 15, Prisma, Postgres (NeonTech). Will use React 18 implementation as I am not familiar with React 19.

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

## Scalability notes

1. Requirements mentioned products volume per supplier ranging from 10k to 1M. Assuming worst case operational context, where clients are primarily enterprises with 1M products volume and has has 1000 attributes in their set up. Their total product attribute row count will be around 1B assuming each product has 1000 attributes assigned. Purely using this design will result in the ProductAttribute table to grow very large, causing issues in index maintenance and query performance. Since attributes and products are always under a specific supplier, a solution would be to partition them based on supplier id. As Prisma does not support partitions in the schema definition itself, and for the interest of time, i will skip this part.
