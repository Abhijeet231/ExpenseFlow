import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

const expenseSchema = z.object({
  date: z.string({ required_error: "Date is required" }).min(1, "Date is required"),
  category: z.string({ required_error: "Category is required" }).trim().min(1, "Category is required"),
  amount: z.coerce.number({ invalid_type_error: "Amount must be a number" }).min(0, "Amount cannot be negative"),
  description: z.string({ required_error: "Description is required" }).trim().min(1, "Description is required").max(500, "Max 500 characters"),
});

const CATEGORIES = ["Travel", "Food", "Accommodation", "Office Supplies", "Medical", "Training", "Other"];

const InputField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</label>
    {children}
    {error && <p className="text-xs text-red-400">{error.message}</p>}
  </div>
);

export default function ExpenseModal({ isOpen, onClose, expense, onSuccess }) {
  const isEditing = !!expense;
  const [loading, setLoading] = useState(null); // "draft" | "submit"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          date: expense.date?.slice(0, 10),
          category: expense.category,
          amount: expense.amount,
          description: expense.description,
        });
      } else {
        reset({ date: "", category: "", amount: "", description: "" });
      }
    }
  }, [isOpen, expense]);

  const onSubmit = async (data, status) => {
    try {
      setLoading(status);
      await onSuccess({ ...data, status });
      onClose();
    } catch (err) {
      // error handled in parent
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">
              {isEditing ? "Edit Expense" : "New Expense"}
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
              {isEditing ? "Update your expense" : "Add an expense"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" error={errors.date}>
              <input
                type="date"
                className={`border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all
                  ${errors.date ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
                {...register("date")}
              />
            </InputField>

            <InputField label="Category" error={errors.category}>
              <select
                className={`border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all bg-white
                  ${errors.category ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
                {...register("category")}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </InputField>
          </div>

          <InputField label="Amount (₹)" error={errors.amount}>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className={`border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all
                ${errors.amount ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
              {...register("amount")}
            />
          </InputField>

          <InputField label="Description" error={errors.description}>
            <textarea
              rows={3}
              placeholder="What was this expense for?"
              className={`border px-3 py-2.5 text-sm text-gray-900 outline-none transition-all resize-none
                ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
              {...register("description")}
            />
          </InputField>

          <InputField label="Receipt (optional)">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border file:border-gray-200 file:text-xs file:font-medium file:text-gray-600 file:bg-gray-50 hover:file:bg-gray-100 file:cursor-pointer"
              {...register("receipt")}
            />
          </InputField>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, "draft"))}
            disabled={!!loading}
            className="flex-1 border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading === "draft" ? "Saving..." : isEditing ? "Update Draft" : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, "submitted"))}
            disabled={!!loading}
            className="flex-1 bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading === "submitted" ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}