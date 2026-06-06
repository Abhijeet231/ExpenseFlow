import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getPendingExpenses,
  updateExpenseStatus,
  getExpenseHistory,
} from "../../service/manager.service.js";
import PendingExpenses from "../../component/manager/Pendingexpenses.jsx";
import ExpenseHistory from "../../component/manager/Expensehistory.jsx";

const STATS = [
  { label: "Pending",  key: "submitted", color: "text-blue-500" },
  { label: "Approved", key: "approved",  color: "text-emerald-500" },
  { label: "Rejected", key: "rejected",  color: "text-red-400" },
];

export default function Manager() {
  const { user } = useAuth();

  const [pending, setPending]           = useState([]);
  const [history, setHistory]           = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // History filters
  const [historyFilter, setHistoryFilter] = useState("all");
  const [search, setSearch]               = useState("");

  // Fetch pending
  const fetchPending = useCallback(async () => {
    try {
      setPendingLoading(true);
      const res = await getPendingExpenses();
      setPending(res.data || []);
    } catch (err) {
      toast.error("Failed to load pending expenses");
    } finally {
      setPendingLoading(false);
    }
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const filters = {};
      if (historyFilter !== "all") filters.status = historyFilter;
      if (search.trim()) filters.search = search.trim();
      const res = await getExpenseHistory(filters);
      setHistory(res.data || []);
    } catch (err) {
      toast.error("Failed to load expense history");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilter, search]);

  useEffect(() => { fetchPending(); }, [fetchPending]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Approve
  const handleApprove = async (expenseId) => {
    try {
      setProcessingId(expenseId);
      await updateExpenseStatus(expenseId, "approved");
      toast.success("Expense approved");
      await Promise.all([fetchPending(), fetchHistory()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve expense");
    } finally {
      setProcessingId(null);
    }
  };

  // Reject
  const handleReject = async (expenseId) => {
    try {
      setProcessingId(expenseId);
      await updateExpenseStatus(expenseId, "rejected");
      toast.success("Expense rejected");
      await Promise.all([fetchPending(), fetchHistory()]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject expense");
    } finally {
      setProcessingId(null);
    }
  };

  // Stats from history
  const countByStatus = (key) => {
    if (key === "submitted") return pending.length;
    return history.filter((e) => e.status === key).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hey, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review and manage your team's expense requests
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {STATS.map(({ label, key, color }) => (
            <div
              key={key}
              className="bg-white border border-gray-100 px-5 py-4 shadow-[0_1px_8px_0_rgba(0,0,0,0.04)]"
            >
              <p className={`text-2xl font-bold ${color}`}>{countByStatus(key)}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending expenses */}
        <div className="mb-6">
          <PendingExpenses
            expenses={pending}
            loading={pendingLoading}
            onApprove={handleApprove}
            onReject={handleReject}
            processingId={processingId}
          />
        </div>

        {/* History */}
        <ExpenseHistory
          expenses={history}
          loading={historyLoading}
          activeFilter={historyFilter}
          onFilterChange={setHistoryFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  );
}