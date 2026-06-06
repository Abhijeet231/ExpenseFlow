import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  createExpense,
  getMyExpenses,
  updateExpense,
  deleteExpense,
} from "../../service/expense.service.js";
import ExpenseModal from "../../component/Expensemodal.jsx";
import ExpenseList from "../../component/Expenselist.jsx";

const STATS = [
  { label: "Total", filter: "all", color: "text-gray-900" },
  { label: "Drafts", filter: "draft", color: "text-gray-400" },
  { label: "Submitted", filter: "submitted", color: "text-blue-500" },
  { label: "Approved", filter: "approved", color: "text-emerald-500" },
  { label: "Rejected", filter: "rejected", color: "text-red-400" },
];

export default function Dashboard() {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const filters = activeFilter !== "all" ? { status: activeFilter } : {};
      const res = await getMyExpenses(filters);
      console.log("RES:", res);
      console.log("Res.Data:", res.data)
      setExpenses(res.data || []);
    } catch (err) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Stats counts — always from full list so we refetch without filter for counts
  const [allExpenses, setAllExpenses] = useState([]);
  useEffect(() => {
    getMyExpenses({})
      .then((res) => setAllExpenses(res.data || []))
      .catch(() => {});
  }, [expenses]); // refresh counts whenever list changes

  const countByStatus = (status) =>
    status === "all"
      ? allExpenses.length
      : allExpenses.filter((e) => e.status === status).length;

  // Open modal for create
  const handleCreate = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  // Modal submit handler
  const handleModalSuccess = async (data) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, data);
        toast.success(
          data.status === "submitted" ? "Expense submitted!" : "Draft updated!",
        );
      } else {
        await createExpense(data);
        toast.success(
          data.status === "submitted" ? "Expense submitted!" : "Draft saved!",
        );
      }
      setEditingExpense(null);
      setModalOpen(false);
      setActiveFilter("all");
      // Fetch all directly instead of relying on stale activeFilter
      const res = await getMyExpenses({});
      setExpenses(res.data || []);
      setAllExpenses(res.data || []);
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
      throw err;
    }
  };

  // Delete
  const handleDelete = async (expenseId) => {
    if (!window.confirm("Delete this draft?")) return;
    try {
      await deleteExpense(expenseId);
      toast.success("Expense deleted");
      fetchExpenses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hey, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Track and manage your expense reports
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Expense
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {STATS.map(({ label, filter, color }) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`bg-white border text-left px-4 py-4 transition-all shadow-[0_1px_8px_0_rgba(0,0,0,0.04)]
                ${activeFilter === filter ? "border-gray-900" : "border-gray-100 hover:border-gray-300"}`}
            >
              <p className={`text-2xl font-bold ${color}`}>
                {countByStatus(filter)}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
            </button>
          ))}
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          loading={loading}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        expense={editingExpense}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
