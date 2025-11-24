import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase, db } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (viktigt för Render)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Meetup App API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes (kommer att byggas ut senare)
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

// Registration endpoint
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "E-post och lösenord krävs",
      });
    }

    // Email validation (simple check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Ogiltig e-postadress",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Lösenordet måste vara minst 6 tecken långt",
      });
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "En användare med denna e-postadress finns redan",
      });
    }

    // Create new user in database
    // Note: In production, password should be hashed with bcrypt before saving
    const newUser = await db.createUser(email, password);

    // Return success (don't send password)
    res.status(201).json({
      message: "Registrering lyckades!",
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle unique constraint violation (if email already exists)
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return res.status(409).json({
        error: "En användare med denna e-postadress finns redan",
      });
    }

    res.status(500).json({
      error: "Ett fel uppstod vid registrering",
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database (create tables if they don't exist)
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

      if (!process.env.DATABASE_URL) {
        console.warn("⚠️  WARNING: DATABASE_URL is not set!");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
