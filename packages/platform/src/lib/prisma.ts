import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

import ws from "ws";
import { PrismaClient } from "@prisma/client";

neonConfig.webSocketConstructor = ws;

// To work in edge enviro nments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
