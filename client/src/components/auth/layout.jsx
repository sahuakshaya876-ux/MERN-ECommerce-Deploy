
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left - branding */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-brandPink via-brandSky to-sky-200 px-12">
        {/* Remove the semi-opaque box around the heading so the text sits directly on the gradient */}
        <div className="px-6 py-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-center text-white">
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

