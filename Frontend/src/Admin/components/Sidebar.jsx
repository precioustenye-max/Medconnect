import {
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/" },
  { name: "Users", icon: Users, path: "/admin/users" },
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
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white border-r p-6
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <X
            className="w-5 h-5 cursor-pointer lg:hidden"
            onClick={() => setOpen(false)}
          />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${
                  isActive
                    ? "bg-indigo-50 text-teal-500 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
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
