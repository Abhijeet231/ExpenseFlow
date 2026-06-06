import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth.validation.js"
import { registerUser } from "../../service/auth.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const InputField = ({ label, id, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      id={id}
      className={`w-full border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 outline-none transition-all
        ${error
          ? "border-red-400 bg-red-50 focus:border-red-500"
          : "border-gray-200 bg-white focus:border-gray-900"
        }`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error.message}</p>}
  </div>
);

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "user" },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = data;
      const res = await registerUser(payload);
      // manually set auth state since register also logs in
      await login({ email: data.email, password: data.password });
      toast.success("Account created successfully!");
      navigate(data.role === "manager" ? "/manager/dashboard" : "/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-16">
        <div>
          <span className="text-white text-xl font-bold tracking-tight">ExpenseFlow</span>
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">Track. Submit. Approve.</p>
          <h2 className="text-white text-5xl font-light leading-tight">
            Manage expenses<br />
            <span className="text-gray-400">without the chaos.</span>
          </h2>
        </div>
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} ExpenseFlow</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Get started</p>
            <h1 className="text-3xl font-semibold text-gray-900">Create an account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <InputField
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Doe"
              error={errors.name}
              {...register("name")}
            />

            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="john@example.com"
              error={errors.email}
              {...register("email")}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              error={errors.password}
              {...register("password")}
            />

            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />

            {/* Role selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["user", "manager"].map((role) => (
                  <label
                    key={role}
                    className="relative flex items-center gap-3 border border-gray-200 px-4 py-3 cursor-pointer has-checked:border-gray-900 has-checked:bg-gray-900 transition-all group"
                  >
                    <input
                      type="radio"
                      value={role}
                      className="sr-only"
                      {...register("role")}
                    />
                    <span className="text-sm font-medium capitalize text-gray-600 group-has-checked:text-white transition-colors">
                      {role === "user" ? "Employee" : "Manager"}
                    </span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-gray-900 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}