import { Pool, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Render PostgreSQL, use SSL in production
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test connection on startup
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

// Initialize database - create users table if it doesn't exist
export const initializeDatabase = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database initialized - users table ready");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};

// User interface matching database schema
export interface User {
  id: number;
  email: string;
  password: string;
  created_at: Date;
}

// Database queries
export const db = {
  // Find user by email
  findUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const result: QueryResult<User> = await pool.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  // Create new user
  createUser: async (email: string, password: string): Promise<User> => {
    try {
      const result: QueryResult<User> = await pool.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
        [email.toLowerCase(), password]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User | null> => {
    try {
      const result: QueryResult<User> = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  },
};

export default pool;
