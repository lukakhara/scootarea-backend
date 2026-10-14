import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

const PgStore = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

declare module "express-session" {
  interface SessionData {
    userId: string; // match your Prisma id type
    role: "USER" | "ADMIN" | "MODERATOR";
  }
}

export const sessionMiddleware = session({
  store: new PgStore({ pool, tableName: "session", createTableIfMissing: true }),
  name: "sid",
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
});