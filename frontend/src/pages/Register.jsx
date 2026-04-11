import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/Toaster";

export default function Register() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register({ fullName, email, password });
      toast({ title: "Account created", description: "Please log in to continue.", variant: "success" });
      navigate("/login", { replace: true });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Unable to create account.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <p className="text-sm text-slate-500">Create a new</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">MiniHR account</h1>
          <p className="mt-2 text-sm text-slate-500">Register as an employee to start managing leave and attendance.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Full name</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
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
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Sign in</a>
        </p>
      </div>
    </div>
  );
}
