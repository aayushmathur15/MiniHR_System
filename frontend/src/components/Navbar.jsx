import { useState } from "react";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

export default function Navbar({ onMobileToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 xl:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-lg font-semibold text-slate-950">MiniHR</p>
            <p className="text-sm text-slate-500">{isAdmin ? "Admin console" : "Employee workspace"}</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <StatusBadge status={isAdmin ? "Admin" : "Employee"} />
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800">
            {user?.fullName}
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="relative xl:hidden">
          <button
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span>{user?.fullName}</span>
            <ChevronDown className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : "rotate-0"}`} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-full mt-2 w-[220px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Account</p>
                  <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                  <StatusBadge status={isAdmin ? "Admin" : "Employee"} />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
