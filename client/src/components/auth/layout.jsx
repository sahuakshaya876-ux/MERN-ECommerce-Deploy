
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left - branding */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-brandPink via-brandSky to-sky-200 px-12">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-center text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.65)]">
            Welcome to ECommerce Shopping
          </h1>
        </div>
      </div>

      {/* Right - form area */}
      <div className="flex flex-1 items-center justify-center bg-transparent p-6">
        <div className="w-full max-w-md card-soft p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

