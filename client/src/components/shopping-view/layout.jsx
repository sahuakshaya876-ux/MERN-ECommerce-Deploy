import ShoppingHeader from "./header";

import { Outlet } from "react-router-dom";


function ShoppingLayout()
{
    return(
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-brandPink via-brandSky to-sky-200 overflow-hidden">
            {/* common header */}
            <ShoppingHeader/>
            <main className="flex flex-col w-full py-6">
                {/* page content gets a soft muted background */}
                <div className="w-full">
                    <Outlet/>
                </div>
            </main>
        </div>
    )
}

export default ShoppingLayout;