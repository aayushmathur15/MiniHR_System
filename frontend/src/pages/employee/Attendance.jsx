import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayMarked, setTodayMarked] = useState(false);

  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await api.get("/attendance/my");
        const records = response.data.data || [];
        setAttendance(records);
        setTodayMarked(records.some((item) => new Date(item.date).toISOString().slice(0, 10) === todayDate));
      } catch (error) {
        toast({
          title: "Unable to load attendance",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [todayDate]);

  const handleMark = async (status) => {
    setSaving(true);
    try {
      await api.post("/attendance/mark", { status });
      setTodayMarked(true);
      const response = await api.get("/attendance/my");
      setAttendance(response.data.data || []);
      toast({ title: "Attendance saved", description: `Marked ${status.toLowerCase()} for today.`, variant: "success" });
    } catch (error) {
      toast({
        title: "Unable to save attendance",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
            <p className="text-sm text-slate-500">Mark today’s attendance</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">{new Date(todayDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleMark("Present")} disabled={todayMarked || saving}>
              Mark Present
            </Button>
            <Button variant="outline" onClick={() => handleMark("Absent")} disabled={todayMarked || saving}>
              Mark Absent
            </Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          {todayMarked ? "Already marked for today." : "You have not marked attendance yet."}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Attendance history</p>
            <p className="mt-1 text-slate-700">Most recent records appear first.</p>
          </div>
          <StatusBadge status={todayMarked ? "Present" : "Absent"} />
        </div>

        {attendance.length === 0 ? (
          <div className="mt-8 text-center text-sm text-slate-500">No attendance records yet.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {attendance.map((record) => (
              <div key={record._id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-950">{formatDate(record.date)}</p>
                <StatusBadge status={record.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
