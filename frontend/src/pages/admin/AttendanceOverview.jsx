import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function AttendanceOverview() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({ date: "", employee: "" });
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.date) params.set("date", filters.date);
    if (filters.employee) params.set("employee", filters.employee);
    return params.toString();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employeeRes, attendanceRes] = await Promise.all([
        api.get("/users/employees"),
        api.get(`/attendance/all${queryString ? `?${queryString}` : ""}`),
      ]);
      setEmployees(employeeRes.data.data || []);
      setAttendance(attendanceRes.data.data || []);
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

  useEffect(() => {
    fetchData();
  }, [queryString]);

  const handleClear = () => {
    setFilters({ date: "", employee: "" });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Attendance overview</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Filter records</h1>
          </div>
          <Button variant="outline" onClick={handleClear}>Clear filters</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Date</span>
            <input
              type="date"
              value={filters.date}
              onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Employee</span>
            <select
              value={filters.employee}
              onChange={(event) => setFilters((current) => ({ ...current, employee: event.target.value }))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All employees</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>{employee.fullName}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {attendance.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          No attendance records match the filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Employee</th>
                <th className="px-4 py-4 text-left font-semibold">Email</th>
                <th className="px-4 py-4 text-left font-semibold">Date</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td className="px-4 py-4 text-slate-900">{record.employee?.fullName}</td>
                  <td className="px-4 py-4 text-slate-700">{record.employee?.email}</td>
                  <td className="px-4 py-4 text-slate-700">{formatDate(record.date)}</td>
                  <td className="px-4 py-4"><StatusBadge status={record.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
