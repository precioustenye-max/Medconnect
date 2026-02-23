import { Menu, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function Topbar({ setOpen }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") return "Admin Dashboard";
    if (location.pathname.startsWith("/admin/users")) return "User Management";
    if (location.pathname.startsWith("/admin/pharmacies")) return "Pharmacy Management";
    return "Admin Panel";
  }, [location.pathname]);

  const subtitle = useMemo(() => {
    if (location.pathname.startsWith("/admin/users")) return "Manage platform users and roles";
    if (location.pathname.startsWith("/admin/pharmacies")) return "Review pharmacy status and operations";
    return "Monitor platform activity and operational health";
  }, [location.pathname]);

  const displayName = user?.name || "Admin User";
  const displayEmail = user?.email || "admin@pharma.com";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AU";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open admin menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">{pageTitle}</h1>
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 sm:px-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">{displayEmail}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
