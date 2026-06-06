const STATUS_STYLES = {
  submitted: "bg-blue-50 text-blue-500",
  approved:  "bg-emerald-50 text-emerald-600",
  rejected:  "bg-red-50 text-red-500",
  draft:     "bg-gray-100 text-gray-500",
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-400">{message}</p>
    <p className="text-xs text-gray-300 mt-1">Check back later</p>
  </div>
);

export default function PendingExpenses({ expenses, loading, onApprove, onReject, processingId }) {
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const formatAmount = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(a);

  return (
    <div className="bg-white border border-gray-100 shadow-[0_1px_12px_0_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Pending Reviews</h2>
          <p className="text-xs text-gray-400 mt-0.5">Expenses waiting for your action</p>
        </div>
        {expenses.length > 0 && (
          <span className="text-xs font-semibold bg-blue-50 text-blue-500 px-2.5 py-1 rounded-full">
            {expenses.length} pending
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState message="No pending expenses" />
      ) : (
        <div className="divide-y divide-gray-50">
          {expenses.map((expense) => {
            const isProcessing = processingId === expense._id;
            return (
              <div key={expense._id} className="px-6 py-4 flex items-center gap-4">
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
                    <p className="text-xs text-gray-400">{expense.userId?.email}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">{expense.category}</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-xs text-gray-400 truncate max-w-50">{expense.description}</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-xs text-gray-400">{formatDate(expense.date)}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{formatAmount(expense.amount)}</p>
                  {expense.receiptUrl?.url && (
                    <a
                      href={expense.receiptUrl.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      View receipt
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onReject(expense._id)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "..." : "Reject"}
                  </button>
                  <button
                    onClick={() => onApprove(expense._id)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-900 text-white hover:bg-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "..." : "Approve"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}