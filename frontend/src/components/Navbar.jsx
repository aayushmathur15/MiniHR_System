import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

export default function Navbar({ onMobileToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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

        <div className="hidden items-center gap-2 xl:flex">
          <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <StatusBadge status={isAdmin ? "Admin" : "Employee"} />
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
            <div className="absolute right-0 top-full mt-2 w-[240px] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="space-y-2">
                <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Account</p>
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <StatusBadge status={isAdmin ? "Admin" : "Employee"} />
                </div>
                <Button size="sm" variant="ghost" className="w-full justify-start gap-2" onClick={() => {navigate("/profile"); setMenuOpen(false);}}>
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
                <Button size="sm" variant="ghost" className="w-full justify-start gap-2 text-rose-600 hover:text-rose-700" onClick={logout}>
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
