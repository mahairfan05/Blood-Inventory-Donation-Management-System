import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { session, profile, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";
  if (!loading && session && profile) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    if (error)
      setError(error.message === "Invalid login credentials"
        ? "Incorrect email or password." : error.message);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-red-700">BloodLink</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Sign in to continue</p>

        <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500" />

        <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
        <input id="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500" />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}