import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Enable WebSocket support for Node.js server runtimes
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

let prismaInstance;

function createNeonPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // Prevent crashes during static compilation/build if environment variables are not set
    return new PrismaClient({
      adapter: {
        provider: 'postgres',
        queryRaw: async () => [],
        executeRaw: async () => 0
      }
    });
  }

  const dbUrl = new URL(process.env.DATABASE_URL);
  
  // Inject database environment variables for Node-postgres fallback resolver
  process.env.PGHOST = dbUrl.hostname;
  process.env.PGUSER = dbUrl.username;
  process.env.PGDATABASE = dbUrl.pathname.replace('/', '');
  process.env.PGPASSWORD = dbUrl.password;
  process.env.PGPORT = dbUrl.port || "5432";

  const pool = new Pool({ ssl: true });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    if (typeof window !== 'undefined') {
      return undefined;
    }
    if (!prismaInstance) {
      if (process.env.NODE_ENV === 'production') {
        prismaInstance = createNeonPrismaClient();
      } else {
        if (!global.prisma) {
          global.prisma = createNeonPrismaClient();
        }
        prismaInstance = global.prisma;
      }
    }
    return prismaInstance[prop];
  }
});
