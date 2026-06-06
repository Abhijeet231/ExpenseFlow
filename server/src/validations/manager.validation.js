import { z } from "zod";

export const updateExpenseStatusSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    required_error: "Status is required",
    message: "Status must be either 'approved' or 'rejected'",
  }),
});

export const managerHistoryQuerySchema = z.object({
  status: z
    .enum(["draft", "submitted", "approved", "rejected"], {
      message: "Invalid status value",
    })
    .optional(),

  
  user: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid user ID format")
    .optional(),

  search: z.string().trim().optional(),
});