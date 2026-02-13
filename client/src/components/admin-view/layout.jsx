import { useState } from "react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
  <div className="flex min-h-screen w-full bg-gradient-to-br from-brandPink/40 via-brandSky/30 to-sky-50">

      {/* Sidebar */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* Content area */}
      <div className="flex flex-1 flex-col">
        <AdminHeader setOpen={setOpen} />

        <main className="flex-1 p-6">
          <div className="w-full rounded-lg card-soft p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
