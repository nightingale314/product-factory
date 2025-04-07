## Description

Fullstack app built with Next 15, Prisma, Postgres (NeonTech). Will use React 18 implementation as I am not familiar with React 19.

## Setup

1. Setup an account + project at neon tech, it's a managed Postgres provider with free tier.
2. Paste your project's database url at `DATABASE_URL`
3. Generate a random Auth secret at `AUTH_SECRET`
4. Run `yarn prisma generate`
5. Run `npx prisma migrate dev`

## Running local

This project uses pnpm workspace for a monorepo setup.

Run the FE development server

```bash
pnpm run dev:platform
```

## Scalability notes

1. Requirements mentioned products volume per supplier ranging from 10k to 1M. Assuming worst case operational context, where clients are primarily enterprises with 1M products volume and has has 1000 attributes in their set up. Their total product attribute row count will be around 1B assuming each product has 1000 attributes assigned. Purely using this design will result in the ProductAttribute table to grow very large, causing issues in index maintenance and query performance.

   Since attributes and products are always under a specific supplier, a solution would be to partition them based on supplier id. As Prisma does not support partitions in the schema definition itself, and for the interest of time, this part will be skipped.

2. Due to time and resource constraints, it's not feasible to setup a object storage bucket, queue etc for an assignment, which is why some shortcuts were taken. E.g.

   For CSV product imports, ideally the client will upload the CSV to a storage bucket and send the file URL to the server for async processing. In this assignment, we will process it in the NextJS api router instead.

   For product enrichment, ideally there will be a queue to manage the processing of products. To keep this simple, we will only allow single enrichment instead of batch enrichment.
