import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, FileText, CalendarDays, Users, ClipboardCheck } from "lucide-react";

const employeeLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/apply-leave", label: "Apply Leave", icon: FileText },
  { to: "/leave-history", label: "Leave History", icon: ClipboardCheck },
  { to: "/attendance", label: "Attendance", icon: CalendarDays },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/leave-requests", label: "Leave Requests", icon: ClipboardCheck },
  { to: "/admin/attendance", label: "Attendance Overview", icon: CalendarDays },
  { to: "/admin/employees", label: "Employees", icon: Users },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <div
      className={
        `fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 xl:static xl:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`
      }
    >
      <div className="flex items-center justify-between gap-4 pb-6 xl:hidden">
        <p className="text-lg font-semibold">MiniHR</p>
        <button
          onClick={onClose}
          className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>
      <div className="space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick links</p>
          <nav className="mt-4 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
