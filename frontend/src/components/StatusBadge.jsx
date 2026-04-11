import { cn } from "@/lib/utils";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-800",
  Present: "bg-emerald-100 text-emerald-800",
  Absent: "bg-rose-100 text-rose-800",
  Employee: "bg-slate-100 text-slate-800",
  Admin: "bg-indigo-100 text-indigo-800",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]",
        statusStyles[status] || "bg-slate-100 text-slate-800"
      )}
    >
      {status}
    </span>
  );
}
