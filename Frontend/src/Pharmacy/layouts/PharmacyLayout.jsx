import { useState } from "react";
import { Outlet } from "react-router-dom";
import PharmacySidebar from "../components/PharmacySidebar";
import PharmacyTopbar from "../components/PharmacyTopbar";

export default function PharmacyLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PharmacySidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <PharmacyTopbar setOpen={setOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
