// sessionMiddleware.ts
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import { Pool } from 'pg'

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Conectando `connect-pg-simple` com session
const PgSession = pgSession(session)

// Middleware de sessão
const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: 'user_sessions', // pode customizar
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
  },
})

export default sessionMiddleware
