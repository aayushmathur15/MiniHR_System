import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import StatusBadge from "@/components/StatusBadge";

export default function ApplyLeave() {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState("Casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(0, Math.floor((end - start) / 86400000) + 1);
  }, [startDate, endDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/leave/apply", { leaveType, startDate, endDate, reason });
      toast({ title: "Leave requested", description: "Your leave application has been submitted.", variant: "success" });
      navigate("/leave-history");
    } catch (error) {
      toast({
        title: "Application failed",
        description: error.response?.data?.message || "Please check your input.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-slate-500">Apply leave</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Submit a new request</h1>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">Balance</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">{user?.leaveBalance} / 20 days</p>
            <StatusBadge status={user?.role === "admin" ? "Admin" : "Employee"} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Leave type</span>
              <select
                value={leaveType}
                onChange={(event) => setLeaveType(event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Casual</option>
                <option>Sick</option>
                <option>Paid</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <span>Total days</span>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">{totalDays}</div>
            </div>
          </div>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Reason (optional)</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Leave balance is checked before submitting.</p>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Apply leave"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
