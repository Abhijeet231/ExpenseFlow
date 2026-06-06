import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isManager = user?.role === "manager";

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-[0_1px_12px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-900 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">EF</span>
          </div>
          <span className="text-gray-900 font-semibold text-base tracking-tight">
            ExpenseFlow
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* User info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name + role */}
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-800 leading-tight">
                {user?.name}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-widest leading-tight
                ${isManager ? "text-violet-500" : "text-emerald-500"}`}>
                {isManager ? "Manager" : "Employee"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden sm:inline">
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}