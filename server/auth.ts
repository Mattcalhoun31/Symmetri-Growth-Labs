import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import type { Express, Request, Response, NextFunction } from "express";
import type { AdminUser } from "@shared/schema";

// Extend Express session types
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface User extends AdminUser {}
  }
}

export function setupAuth(app: Express) {
  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || "symmetri-dev-secret-change-in-production";
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for username/password auth
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getAdminUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }

        // Update last login
        await storage.updateAdminLastLogin(user.id);
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user: AdminUser, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getAdminUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
}

// Helper to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Helper to create the initial admin user if none exists
export async function ensureAdminUser() {
  try {
    const existingAdmin = await storage.getAdminUserByUsername("admin");
    
    if (!existingAdmin) {
      // Create default admin user
      const defaultPassword = process.env.ADMIN_PASSWORD || "symmetri-admin-2024";
      const passwordHash = await hashPassword(defaultPassword);
      
      await storage.createAdminUser({
        username: "admin",
        email: "admin@symmetri.com",
        passwordHash,
        role: "admin",
      });
      
      console.log("Created default admin user (username: admin)");
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}
