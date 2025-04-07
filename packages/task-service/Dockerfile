FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copy workspace package files
COPY packages/task-service/package.json ./packages/task-service/

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY packages/task-service ./packages/task-service

# Build
RUN pnpm --filter @product-factory/task-service build

EXPOSE 3001

CMD ["pnpm", "--filter", "@product-factory/task-service", "start"] 