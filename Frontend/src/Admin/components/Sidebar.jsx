import {
  Activity,
  LayoutDashboard,
  Store,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Pharmacies", icon: Store, path: "/admin/pharmacies" },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-72 border-r border-slate-200 bg-white/95 p-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">MedConnect</p>
            <h2 className="truncate text-xl font-bold text-slate-900">Admin Panel</h2>
          </div>
          <X
            className="h-5 w-5 cursor-pointer text-slate-500 lg:hidden"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Activity className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wide">System Status</p>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-700">Operational and syncing</p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition
                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
