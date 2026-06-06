import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createExpense,
  getExpenseById,
  getMyExpenses,
  deleteExpense,
  updateExpense,
} from "../controllers/expense.controller.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
} from "../validations/expense.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { verifyRoles } from "../middleware/verifyRoles.js";

const router = Router();

// authentication for all routes
router.use(verifyJWT, verifyRoles("user") );

//Create Expense:  /api/expenses
router.post(
  "/",
  upload.single("receipt"),
  validate(createExpenseSchema),
  createExpense
);

// Get My Expenses :  GET /api/expenses/my
router.get(
  "/my",
  validate(expenseQuerySchema, "query"),
  getMyExpenses
);

// Get Specific Expense :   GET /api/expenses/:expenseId
router.get("/:expenseId", getExpenseById);


// Update Expense:  PATCH /api/expenses/:expenseId
router.patch(
  "/:expenseId",
  upload.single("receipt"),
  validate(updateExpenseSchema),
  updateExpense
);

// Delete Expense :  DELETE /api/expenses/:expenseId
router.delete("/:expenseId", deleteExpense);

export default router;