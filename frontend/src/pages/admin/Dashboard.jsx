import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayString = useMemo(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [employeeRes, leaveRes, attendanceRes] = await Promise.all([
        api.get("/users/employees"),
        api.get("/leave/all"),
        api.get(`/attendance/all?date=${todayString}`),
      ]);
      setEmployees(employeeRes.data.data || []);
      setLeaves(leaveRes.data.data || []);
      setAttendance(attendanceRes.data.data || []);
    } catch (error) {
      toast({
        title: "Unable to load dashboard",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [todayString]);

  const pendingLeaves = useMemo(() => leaves.filter((item) => item.status === "Pending"), [leaves]);
  const stats = useMemo(
    () => [
      { label: "Total employees", value: employees.length },
      { label: "Pending leave requests", value: pendingLeaves.length },
      { label: "Attendance today", value: attendance.length },
    ],
    [employees.length, pendingLeaves.length, attendance.length]
  );

  const handleAction = async (id, status) => {
    const confirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this request?`);
    if (!confirmed) return;

    try {
      await api.patch(`/leave/${id}/action`, { status });
      toast({ title: `Leave ${status.toLowerCase()}`, description: "Request updated successfully.", variant: "success" });
      refreshData();
    } catch (error) {
      toast({
        title: "Action failed",
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Overview</h1>
          </div>
          <Button variant="outline" onClick={refreshData}>Refresh</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pending approvals</p>
            <p className="mt-1 text-slate-700">Latest requests waiting for action.</p>
          </div>
          <StatusBadge status="Pending" />
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="mt-8 text-center text-sm text-slate-500">There are no pending leave requests at the moment.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {pendingLeaves.slice(0, 5).map((leave) => (
              <div key={leave._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{leave.employee?.fullName}</p>
                    <p className="text-sm text-slate-600">{leave.employee?.email}</p>
                  </div>
                  <StatusBadge status={leave.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <p className="font-medium">Type</p>
                    <p className="mt-1">{leave.leaveType}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                    <p className="font-medium">Dates</p>
                    <p className="mt-1">{formatDate(leave.startDate)} — {formatDate(leave.endDate)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" onClick={() => handleAction(leave._id, "Approved")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(leave._id, "Rejected")}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
