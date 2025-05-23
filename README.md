## Description

Fullstack app built with Next 15, Prisma, Postgres (NeonTech). Will use React 18 implementation as I am not familiar with React 19.

## Incomplete features

1. Product detail page does not support datetime attributes. (Lack of time)
2. Partial validation for product attribute values update. (Lack of time)
3. Product table sort not completed. (Lack of time)
4. Product table partially completed. Only Range, String, Boolean filters are working. Complex task to build the serialiser + deserialiser for the filter parser. (Lack of time)
5. Product import does not create product attribute change logs. (Lack of time)

## Architecture

### Frontend

1. NextJS (FE + BFF)
2. UI Library: Shadcn
3. State management: Native react

### Backend

1. PostgresSQL (Deployed on NeonTech)
2. Prisma as ORM
3. Serverless framework for IaaC with AWS
4. AWS SQS for Enrichment / Import service queues
5. AWS Lambda
6. AWS S3 for file storage

### Auth

1. Session token auth stored on DB. Validated on FE server.

### Project structure

1. Monorepo workspace setup with pnpm. (Very very difficult to setup because of Prisma binaries... T_T)

### Notes

1. This proejct uses NextJS as the fullstack framework, alongside with AWS serverless services for long live tasks (Import service + Enrichment service). All components are in a monorepo setup. Due to lack of time, deployment for the BE services are done locally instead of in a pipeline. serverless framework is used for orchestrating the services via IaaC.

2. SQL is chosen for it's relational properties. In the concept of Products paired with dynamic Attributes, it is of a many to many relationship. With that it's easier and more performant to perform queries. a JSONValue with GIN index is used for the ProductAttributes table's value field, where it is optimized for searching complex data types. As such NeonTech (Postgres provider) was selected just for ease of setup and free tier.

3. Queues are used for the import and enrichment services as they are long running tasks.

### Import service

1. The select header step is done on the client as the step has high risks of cancellation. Because the CSV is processed as a stream with max row count, the performance is very fast.

2. Once the header is selected, the selection index will be sent to the import queue worker.

3. The mapping step has a suggestion step, where the worker will suggest the mapping of attributes based on the header by embedding the Supplier attributes and the CSV file headers. The embeddings are the ranked by cosine similarity. The suggested mapping is then returned along with a confidence score based on the similarity.

### Enrichment service

1. Simple SQS to handle enrichment tasks, for now it only does 1 product at a time due to token limit.
2. The enrichment task is split into 2 stages, first is the context generation stage, where the worker will extract the data from the product attributes and generate context. First is via Web search and second is via OCR.
   - OCR is done via GPT vision, only for Primary media attributes.
   - Web search uses only attribute data that was updated by the User to generate context. It will not use AI generated attributes.
3. The second stage is the enrichment stage, where the worker will use the context to generate the attribute values.
4. JSON schema is used for strict type adherence, where zod is used to generate schemas on runtime.

## NextJS architecture design

1. Server actions are used for mutations whereas API Route handlers are used for data fetching. Reason is because data fetching is a HTTP network request that can be cached easily with conventional methods.

2. All DB queries are done in the NextJS platform. This is to streamline development efforts.

3. This project skipped the usage of NextJS middleware because of it's edge runtime. Prisma ORM does not support edge runtime as of now.

## Scalability notes

1. Requirements mentioned products volume per supplier ranging from 10k to 1M. Assuming worst case operational context, where clients are primarily enterprises with 1M products volume and has has 1000 attributes in their set up. Their total product attribute row count will be around 1B assuming each product has 1000 attributes assigned. Purely using this design will result in the ProductAttribute table to grow very large, causing issues in index maintenance and query performance.

   Since attributes and products are always under a specific supplier, a solution would be to partition them based on supplier id. As Prisma does not support partitions in the schema definition itself, and for the interest of time, this part will be skipped.

2. Also, the business would fit a multi tenant database design instead, where each customer is a tenant who has their own dedicated database instance. Advantages includes better scalability, isolation, and resource utilization. Moreover with attribute enrichment being a high I/O operation, having dedicated database instances would help with performance.

## Bug list

1. Client component with useState seems to be intentionally forced to run on the server even with the use client directive, causing a useState null error. https://github.com/vercel/next.js/discussions/75993, can't seem to find what's the root cause. Instead, have disabled SSR for product data table.
