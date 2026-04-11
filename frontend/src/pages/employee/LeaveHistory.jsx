import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLeave, setEditingLeave] = useState(null);
  const [editData, setEditData] = useState({ leaveType: "Casual", startDate: "", endDate: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await api.get("/leave/my");
      setLeaves(response.data.data || []);
    } catch (error) {
      toast({
        title: "Unable to fetch leaves",
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

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setEditData({
      leaveType: leave.leaveType,
      startDate: leave.startDate.slice(0, 10),
      endDate: leave.endDate.slice(0, 10),
      reason: leave.reason || "",
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingLeave) return;

    setSaving(true);
    try {
      await api.patch(`/leave/${editingLeave._id}/edit`, editData);
      toast({ title: "Leave updated", description: "Your leave request has been updated.", variant: "success" });
      setEditingLeave(null);
      fetchLeaves();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Please check the values.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Cancel this leave request?");
    if (!confirmed) return;

    try {
      await api.delete(`/leave/${id}/cancel`);
      toast({ title: "Cancelled", description: "The leave request has been cancelled.", variant: "success" });
      fetchLeaves();
    } catch (error) {
      toast({
        title: "Unable to cancel",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalDays = useMemo(() => {
    if (!editData.startDate || !editData.endDate) return 0;
    const start = new Date(editData.startDate);
    const end = new Date(editData.endDate);
    return Math.max(0, Math.floor((end - start) / 86400000) + 1);
  }, [editData.startDate, editData.endDate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Leave history</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">All requests</h1>
          </div>
         </div>
      </section>

      {leaves.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
          No leave requests found yet. Apply for leave to see your history here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Type</th>
                <th className="px-4 py-4 text-left font-semibold">Dates</th>
                <th className="px-4 py-4 text-left font-semibold">Days</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Applied</th>
                <th className="px-4 py-4 text-left font-semibold">Reason</th>
                <th className="px-4 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-4 py-4 text-slate-900">{leave.leaveType}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{leave.totalDays}</td>
                  <td className="px-4 py-4"><StatusBadge status={leave.status} /></td>
                  <td className="px-4 py-4 text-slate-700">{formatDate(leave.appliedDate)}</td>
                  <td className="px-4 py-4 text-slate-700">{leave.reason || "—"}</td>
                  <td className="px-4 py-4 space-x-2 text-right">
                    {leave.status === "Pending" ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(leave)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleCancel(leave._id)}>Cancel</Button>
                      </>
                    ) : (
                      <span className="text-slate-500">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(editingLeave)} title="Edit leave request" onClose={() => setEditingLeave(null)}>
        <form className="space-y-5" onSubmit={handleUpdate}>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Leave type</span>
              <select
                value={editData.leaveType}
                onChange={(event) => setEditData({ ...editData, leaveType: event.target.value })}
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
                value={editData.startDate}
                onChange={(event) => setEditData({ ...editData, startDate: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>End date</span>
              <input
                type="date"
                value={editData.endDate}
                onChange={(event) => setEditData({ ...editData, endDate: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <span>Total days</span>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">{totalDays}</div>
            </div>
          </div>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Reason</span>
            <textarea
              value={editData.reason}
              onChange={(event) => setEditData({ ...editData, reason: event.target.value })}
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEditingLeave(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Updating..." : "Save changes"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
