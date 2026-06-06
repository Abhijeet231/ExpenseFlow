const STATUS_FILTERS = ["all", "draft", "submitted", "approved", "rejected"];

const STATUS_STYLES = {
  draft:     "bg-gray-100 text-gray-500",
  submitted: "bg-blue-50 text-blue-500",
  approved:  "bg-emerald-50 text-emerald-600",
  rejected:  "bg-red-50 text-red-500",
};

const EmptyState = ({ activeFilter }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-400">
      {activeFilter === "all" ? "No expenses yet" : `No ${activeFilter} expenses`}
    </p>
    <p className="text-xs text-gray-300 mt-1">
      {activeFilter === "all" ? "Create your first expense to get started" : "Try a different filter"}
    </p>
  </div>
);

export default function ExpenseList({ expenses, loading, activeFilter, onFilterChange, onEdit, onDelete }) {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-white border border-gray-100 shadow-[0_1px_12px_0_rgba(0,0,0,0.04)]">
      {/* List Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-900">My Expenses</h2>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-sm">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 text-xs font-semibold capitalize transition-all rounded-sm
                ${activeFilter === f
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState activeFilter={activeFilter} />
      ) : (
        <div className="divide-y divide-gray-50">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors group"
            >
              {/* Category icon circle */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-gray-400">
                  {expense.category?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{expense.category}</p>
                  <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLES[expense.status]}`}>
                    {expense.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{expense.description}</p>
              </div>

              {/* Amount + date */}
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900">{formatAmount(expense.amount)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(expense.date)}</p>
              </div>

              {/* Actions — only for draft */}
              {expense.status === "draft" && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(expense)}
                    className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}