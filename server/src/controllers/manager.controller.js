import Expense from "../models/expense.model.js";

// GET PENDING EXPENSES:   GET /api/manager/pending --------------------------------------------------------------------------------------------------------------------
const getPendingExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ status: "submitted" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// UPDATE EXPENSE STATUS:  PATCH /api/manager/:expenseId/status -------------------------------------------------------------------------------------------------------
const updateExpenseStatus = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["approved", "rejected"];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Only submitted expenses can be approved or rejected",
      });
    }

    expense.status = status;
    await expense.save();

    const message =
      status === "approved"
        ? "Expense approved successfully"
        : "Expense rejected successfully";

    return res.status(200).json({
      success: true,
      message,
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET EXPENSE HISTROY:  GET /api/manager/history ----------------------------------------------------------------------------------------------------------------------
const getExpenseHistory = async (req, res) => {
  try {
    const { status, user, search } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (user) filter.userId = user;
    if (search) filter.description = { $regex: search, $options: "i" };

    const expenses = await Expense.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Expense history fetched successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { getPendingExpenses, updateExpenseStatus, getExpenseHistory };