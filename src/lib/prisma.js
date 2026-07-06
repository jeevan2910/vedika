import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Enable WebSocket support for Node.js server runtimes
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

let prismaInstance;

function createNeonPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set! Check your .env file.');
    return new PrismaClient();
  }

  console.log('✅ Creating Prisma client with Neon adapter...');

  // PrismaNeon in Prisma v7 takes a pool config object directly (not a Pool instance)
  // It internally creates the Pool using the config passed here.
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrisma() {
  if (process.env.NODE_ENV === 'production') {
    return createNeonPrismaClient();
  }
  // In development, reuse the instance across hot reloads
  if (!global._prismaClient) {
    global._prismaClient = createNeonPrismaClient();
  }
  return global._prismaClient;
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    if (typeof window !== 'undefined') {
      return undefined;
    }
    if (!prismaInstance) {
      prismaInstance = getPrisma();
    }
    const value = prismaInstance[prop];
    if (typeof value === 'function') {
      return value.bind(prismaInstance);
    }
    return value;
  }
});
