import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Login() {
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(isAdmin ? "/admin/dashboard" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      toast({ title: "Welcome back", description: `Hi ${user.fullName}!` });
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <p className="text-sm text-slate-500">Welcome back to</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">MiniHR Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your account details to continue.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New to MiniHR? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Create an account</a>
        </p>
      </div>
    </div>
  );
}
