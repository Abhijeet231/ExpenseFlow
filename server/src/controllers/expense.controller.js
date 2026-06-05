import Expense from "../models/expense.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { date, category, amount, description, status } = req.body;

    if (!date || !category || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: "date, category, amount, and description are required",
      });
    }

    const allowedStatuses = ["draft", "submitted"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    let receiptUrl = {};

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (!uploaded) {
        return res.status(500).json({
          success: false,
          message: "Receipt upload failed",
        });
      }
      receiptUrl = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const expense = await Expense.create({
      userId: req.user._id,
      date,
      category,
      amount,
      description,
      receiptUrl,
      status: status || "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/expenses/my
const getMyExpenses = async (req, res) => {
  try {
    const { status, search, category } = req.query;

    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = { $regex: category, $options: "i" };
    if (search) filter.description = { $regex: search, $options: "i" };

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET /api/expenses/:expenseId
const getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this expense",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// PATCH /api/expenses/:expenseId
const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { date, category, amount, description } = req.body;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this expense",
      });
    }

    if (expense.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft expenses can be edited",
      });
    }

    if (date) expense.date = date;
    if (category) expense.category = category;
    if (amount !== undefined) expense.amount = amount;
    if (description) expense.description = description;

    if (req.file) {
      if (expense.receiptUrl?.public_id) {
        await deleteFromCloudinary(expense.receiptUrl.public_id);
      }

      const uploaded = await uploadOnCloudinary(req.file.path);
      if (!uploaded) {
        return res.status(500).json({
          success: false,
          message: "Receipt upload failed",
        });
      }

      expense.receiptUrl = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// DELETE /api/expenses/:expenseId
const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this expense",
      });
    }

    if (expense.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft expenses can be deleted",
      });
    }

    if (expense.receiptUrl?.public_id) {
      await deleteFromCloudinary(expense.receiptUrl.public_id);
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { createExpense, getMyExpenses, getExpenseById, updateExpense, deleteExpense };