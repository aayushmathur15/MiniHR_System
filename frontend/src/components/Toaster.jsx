import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

let dispatchToast;

export const toast = ({ title, description, variant = "default" }) => {
  if (typeof dispatchToast === "function") {
    dispatchToast({ title, description, variant });
  }
};

const variantStyles = {
  default: "bg-slate-950 text-white",
  success: "bg-emerald-600 text-white",
  destructive: "bg-rose-600 text-white",
  warning: "bg-amber-500 text-slate-950",
};

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    dispatchToast = (toastData) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, ...toastData }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 4200);
    };

    return () => {
      dispatchToast = undefined;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-3 px-4 sm:items-end">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={cn(
            "pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 shadow-xl",
            variantStyles[variant] || variantStyles.default
          )}
        >
          <div className="flex items-start justify-between gap-4 p-4">
            <div className="space-y-1">
              <p className="font-semibold">{title}</p>
              {description ? <p className="text-sm opacity-90">{description}</p> : null}
            </div>
            <button
              onClick={() => setToasts((current) => current.filter((item) => item.id !== id))}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
