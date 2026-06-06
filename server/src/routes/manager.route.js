import { Router } from "express";
import {
  getPendingExpenses,
  updateExpenseStatus,
  getExpenseHistory,
} from "../controllers/manager.controller.js";
import { managerHistoryQuerySchema, updateExpenseStatusSchema } from "../validations/manager.validation.js";
import { validate } from "../middleware/validate.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { verifyRoles } from "../middleware/verifyRoles.middleware.js";

const router = Router();

// Auth
router.use(verifyJWT, verifyRoles("manager"));

// Get all Pending requests:  GET /api/manager/pending
router.get("/pending", getPendingExpenses);

// Change Status :  PATCH /api/manager/:expenseId/status
router.patch(
  "/:expenseId/status",
  validate(updateExpenseStatusSchema),
  updateExpenseStatus
);

// Get History :   GET /api/manager/history
router.get(
  "/history",
  validate(managerHistoryQuerySchema, "query"),
  getExpenseHistory
);

export default router;