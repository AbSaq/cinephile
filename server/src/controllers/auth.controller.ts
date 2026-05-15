import { Request, Response } from "express";
import { db } from "../db";
import { users, NewUser } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../schemas";

export async function register(req: Request, res: Response) {
  try {
    // Validate request body
    const validated = registerSchema.parse(req.body);
    const { name, email, password } = validated;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (existingUser) {
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser: NewUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    const inserted = await db.insert(users).values(newUser).returning().get();
    if (!inserted) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    // Generate token
    const token = generateToken(inserted.id, inserted.email);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: inserted.id,
        name: inserted.name,
        email: inserted.email,
        role: inserted.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    // Validate request body
    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
