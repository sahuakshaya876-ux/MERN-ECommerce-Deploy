
import {
  LayoutDashboard,
  ShoppingBasket,
  BadgeCheck,
  ChartNoAxesCombined,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 flex flex-col gap-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => {
              navigate(item.path)
              setOpen?setOpen(false):null
            }}
            className="group flex cursor-pointer items-center gap-3 rounded-md px-4 py-2 text-xl text-gray-700 hover:bg-white/90 hover:text-gray-900"
          >
            <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-900" />
            {item.label}
          </div>
        );
      })}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* MOBILE SIDEBAR (OVERLAY) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white p-4">
          <SheetHeader className="border-b pb-3">
            <SheetTitle
              onClick={() => {
                navigate("/admin/dashboard");
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-2 text-xl font-bold mb-5"
            >
              <ChartNoAxesCombined />
              <h1 className="text-2xl font-extrabold">Admin Panel</h1>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* DESKTOP SIDEBAR (FIXED) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/30 bg-white/70 p-6">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex cursor-pointer items-center gap-2 text-xl font-bold"
        >
          <ChartNoAxesCombined className="text-brandSky" />
          <h1 className="text-2xl font-extrabold text-brandSky">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
