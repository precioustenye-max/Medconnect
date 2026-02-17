import { Menu } from "lucide-react";

export default function Topbar({ setOpen }) {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Menu
          className="w-6 h-6 cursor-pointer lg:hidden"
          onClick={() => setOpen(true)}
        />
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-2xl font-medium">Admin User</p>
          <p className="text-base text-gray-500">admin@pharma.com</p>
        </div>
        <div className="w-13 h-13 rounded-full bg-indigo-100 text-teal-600 flex items-center justify-center font-semibold">
          AU
        </div>
      </div>
    </header>
  );
}
