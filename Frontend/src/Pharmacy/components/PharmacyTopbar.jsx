import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

export default function PharmacyTopbar({ setOpen }) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 cursor-pointer lg:hidden" onClick={() => setOpen(true)} />
        <h1 className="text-2xl font-semibold">Pharmacy Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-base font-medium">{user?.name || "Pharmacy Owner"}</p>
          <p className="text-sm text-gray-500">{user?.role || ""}</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : "PO"}
        </div>
      </div>
    </header>
  );
}
