import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useEffect, useState } from "react";
import { getMyPharmacyProfile } from "../../services/pharmacy.api";

export default function PharmacyTopbar({ setOpen }) {
  const user = useAuthStore((state) => state.user);
  const [pharmacyName, setPharmacyName] = useState("Pharmacy");

  useEffect(() => {
    const fetchPharmacyName = async () => {
      try {
        const profile = await getMyPharmacyProfile();
        if (profile?.name) {
          setPharmacyName(profile.name);
        }
      } catch (err) {
        console.error("Failed to fetch pharmacy name");
      }
    };
    fetchPharmacyName();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/50 bg-white backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer text-slate-600 hover:text-slate-900 lg:hidden" onClick={() => setOpen(true)} />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome to {pharmacyName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your pharmacy operations</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white px-4 py-2 backdrop-blur">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">{user?.name || "Pharmacy Owner"}</p>
            <p className="text-xs text-slate-500">{user?.role || "Pharmacy Admin"}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "PH"}
          </div>
        </div>
      </div>
    </header>
  );
}
