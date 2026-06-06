const STATUS_FILTERS = ["all", "submitted", "approved", "rejected"];

const STATUS_STYLES = {
  submitted: "bg-blue-50 text-blue-500",
  approved:  "bg-emerald-50 text-emerald-600",
  rejected:  "bg-red-50 text-red-500",
  draft:     "bg-gray-100 text-gray-500",
};

const EmptyState = ({ activeFilter }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-400">
      {activeFilter === "all" ? "No expense history yet" : `No ${activeFilter} expenses`}
    </p>
  </div>
);

export default function ExpenseHistory({ expenses, loading, activeFilter, onFilterChange, search, onSearchChange }) {
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formatAmount = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a);

  return (
    <div className="bg-white border border-gray-100 shadow-[0_1px_12px_0_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Expense History</h2>
          <p className="text-xs text-gray-400 mt-0.5">All processed expenses</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 outline-none focus:border-gray-900 transition-all w-48"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 bg-gray-50 p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize transition-all
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
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState activeFilter={activeFilter} />
      ) : (
        <div className="divide-y divide-gray-50">
          {expenses.map((expense) => (
            <div key={expense._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-gray-400">
                  {expense.userId?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900">{expense.userId?.name}</p>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-gray-500">{expense.category}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLES[expense.status]}`}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}