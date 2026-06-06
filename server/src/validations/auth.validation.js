import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters long"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please use a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),

  role: z
    .enum(["user", "manager"], {
      message: "Role must be either 'user' or 'manager'",
    })
    .optional()
    .default("user"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please use a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});