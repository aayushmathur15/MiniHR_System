import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get("/leave/all");
      setLeaves(response.data.data || []);
    } catch (error) {
      toast({
        title: "Unable to load requests",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    const confirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`);
    if (!confirmed) return;

    try {
      await api.patch(`/leave/${id}/action`, { status });
      toast({ title: `Request ${status.toLowerCase()}`, description: "The request has been updated.", variant: "success" });
      fetchLeaves();
    } catch (error) {
      toast({
        title: "Unable to update",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Leave requests</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">All employee requests</h1>
          </div>
          <Button variant="outline" onClick={fetchLeaves}>Reload</Button>
        </div>
      </section>

      {leaves.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          No leave requests found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Employee</th>
                <th className="px-4 py-4 text-left font-semibold">Type</th>
                <th className="px-4 py-4 text-left font-semibold">Dates</th>
                <th className="px-4 py-4 text-left font-semibold">Days</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Reason</th>
                <th className="px-4 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-4 py-4 text-slate-900">
                    <div className="font-medium">{leave.employee?.fullName}</div>
                    <div className="text-sm text-slate-500">{leave.employee?.email}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{leave.leaveType}</td>
                  <td className="px-4 py-4 text-slate-700">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
                  <td className="px-4 py-4 text-slate-700">{leave.totalDays}</td>
                  <td className="px-4 py-4"><StatusBadge status={leave.status} /></td>
                  <td className="px-4 py-4 text-slate-700">{leave.reason || "—"}</td>
                  <td className="px-4 py-4 space-x-2">
                    {leave.status === "Pending" ? (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => handleAction(leave._id, "Approved")}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleAction(leave._id, "Rejected")}>Reject</Button>
                      </>
                    ) : (
                      <span className="text-slate-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
