import { LayoutDashboard, ShoppingCart, Package, Store, FileCheck2, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/pharmacy" },
  { name: "Orders", icon: ShoppingCart, path: "/pharmacy/orders" },
  { name: "Drugs", icon: Package, path: "/pharmacy/drugs" },
  { name: "Prescriptions", icon: FileCheck2, path: "/pharmacy/prescriptions" },
  { name: "Profile", icon: Store, path: "/pharmacy/profile" },
];

export default function PharmacySidebar({ open, setOpen }) {
  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky z-50 top-0 left-0 h-full lg:min-h-screen w-72 border-r border-slate-200 bg-slate-900 p-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Pharmacy</p>
            <h2 className="text-2xl font-bold text-white mt-1">Dashboard</h2>
          </div>
          <X className="w-5 h-5 cursor-pointer text-slate-400 lg:hidden hover:text-white transition" onClick={() => setOpen(false)} />
        </div>

        <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-slate-800 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wide text-cyan-300">Quick Access</p>
          <p className="text-sm text-cyan-100 mt-2">Manage your pharmacy inventory and orders</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                ${isActive ? "bg-cyan-500 text-white shadow-lg font-bold" : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300"}`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
