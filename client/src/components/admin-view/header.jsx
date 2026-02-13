import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {

  const dispatch=useDispatch();

  function handleLogout()
  {
    dispatch(logoutUser());
  }

  return (
  <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/30 bg-white/70 backdrop-blur-sm px-4 py-3">
      
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="lg:hidden bg-brandPink text-white hover:bg-white/90"
      >
        <AlignJustify className="h-5 w-5" />
      </Button>

      {/* Logout */}
      <Button onClick={handleLogout} className="ml-auto flex items-center gap-2 bg-brandSky text-white hover:bg-brandSky/90">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>

    </header>
  );
}

export default AdminHeader;

