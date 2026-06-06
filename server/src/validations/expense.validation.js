import { z } from "zod";

export const createExpenseSchema = z.object({
  // createExpenseSchema and updateExpenseSchema
  date: z
    .string({ required_error: "Expense date is required" })
    .min(1, "Date is required"),

  category: z
    .string({ required_error: "Category is required" })
    .trim()
    .min(1, "Category cannot be empty"),

  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount cannot be negative")
    .optional(),

  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters"),

  status: z
    .enum(["draft", "submitted"], {
      message: "Status must be either 'draft' or 'submitted'",
    })
    .optional()
    .default("draft"),
});

export const updateExpenseSchema = z.object({
  // createExpenseSchema and updateExpenseSchema
  date: z
    .string({ required_error: "Expense date is required" })
    .min(1, "Date is required")
    .optional(),

  category: z.string().trim().min(1, "Category cannot be empty").optional(),

  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0, "Amount cannot be negative")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z
    .enum(["draft", "submitted"], {
      message: "Status must be draft or submitted",
    })
    .optional(),
});

export const expenseQuerySchema = z.object({
  status: z
    .enum(["draft", "submitted", "approved", "rejected"], {
      message: "Invalid status value",
    })
    .optional(),

  category: z.string().trim().optional(),

  search: z.string().trim().optional(),
});
