import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaveRes, attendanceRes] = await Promise.all([
          api.get("/leave/my"),
          api.get("/attendance/my"),
        ]);

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

    fetchData();
  }, []);

  const totalLeaves = leaves.length;
  const pendingLeaves = leaves.filter((item) => item.status === "Pending").length;
  const approvedLeaves = leaves.filter((item) => item.status === "Approved").length;
  const recentAttendance = attendance.slice(0, 5);
  const balancePercentage = user ? Math.min(100, Math.round((user.leaveBalance / 20) * 100)) : 0;

  const stats = useMemo(
    () => [
      { label: "Total leaves", value: totalLeaves },
      { label: "Pending leaves", value: pendingLeaves },
      { label: "Approved leaves", value: approvedLeaves },
    ],
    [totalLeaves, pendingLeaves, approvedLeaves]
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">{user?.fullName}</h1>
          <p className="mt-2 text-slate-600">Ready to manage leave and attendance today?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/apply-leave")}>Apply Leave</Button>
            <Button variant="outline" onClick={() => navigate("/attendance")}>Mark Attendance</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Leave balance</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{user?.leaveBalance} / 20 days</p>
            </div>
            <StatusBadge status={user?.role === "admin" ? "Admin" : "Employee"} />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${balancePercentage}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-500">{balancePercentage}% remaining</p>
        </section>
      </div>

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
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent attendance</p>
            <p className="mt-1 text-slate-700">Last 5 records</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/attendance")}>View history</Button>
        </div>

        {recentAttendance.length === 0 ? (
          <div className="mt-8 text-center text-sm text-slate-500">No attendance records yet.</div>
        ) : (
          <div className="mt-6 grid gap-3">
            {recentAttendance.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-950">{formatDate(item.date)}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
