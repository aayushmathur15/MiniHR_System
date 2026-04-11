import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [details, setDetails] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/employees");
      setEmployees(response.data.data || []);
    } catch (error) {
      toast({
        title: "Unable to load employees",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const term = search.toLowerCase();
      return (
        employee.fullName.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term)
      );
    });
  }, [employees, search]);

  const openDetail = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/users/employees/${id}`);
      setDetails(response.data.data || null);
      setSelectedEmployee(id);
    } catch (error) {
      toast({
        title: "Unable to load details",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !details) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Employee directory</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">All employees</h1>
          </div>
          <Button variant="outline" onClick={fetchEmployees}>Reload</Button>
        </div>
      </section>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700">Search employees</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
            No employees match your search.
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Full name</th>
                  <th className="px-4 py-4 text-left font-semibold">Email</th>
                  <th className="px-4 py-4 text-left font-semibold">Joined</th>
                  <th className="px-4 py-4 text-left font-semibold">Leave balance</th>
                  <th className="px-4 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-4 py-4 text-slate-900">{employee.fullName}</td>
                    <td className="px-4 py-4 text-slate-700">{employee.email}</td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(employee.dateOfJoining)}</td>
                    <td className="px-4 py-4 text-slate-700">{employee.leaveBalance}</td>
                    <td className="px-4 py-4">
                      <Button size="sm" variant="outline" onClick={() => openDetail(employee._id)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(selectedEmployee)} title="Employee details" onClose={() => setSelectedEmployee(null)}>
        {details ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{details.fullName}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 text-slate-900">{details.email}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Joined</p>
                <p className="mt-1 text-slate-900">{formatDate(details.dateOfJoining)}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Leave balance</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{details.leaveBalance}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Role</p>
              <StatusBadge status={details.role === "admin" ? "Admin" : "Employee"} />
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">Loading employee details...</div>
        )}
      </Modal>
    </div>
  );
}
