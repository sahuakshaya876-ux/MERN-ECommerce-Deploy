
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems ,setOpenCartSheet}) {

  const navigate=useNavigate();

  const totalCartAmount=
  cartItems && cartItems.length>0
   ?cartItems.reduce(
    (sum,currentItem)=>
      sum+(currentItem?.salePrice>0
        ?currentItem?.salePrice
        :currentItem?.price)*
        currentItem?.quantity,0
    ):0;
  

  return (
    <SheetContent className="w-full sm:max-w-md h-screen bg-white text-black p-6">
      <SheetHeader>
        <SheetTitle className="text-xl font-semibold text-black">
          Your Cart
        </SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item?.productId || item?._id}   // ✅ important
              cartItem={item}
            />
          ))
        ) : (
          <p className="text-gray-500">Cart is empty</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>

      <Button onClick={()=>
        {
          navigate('/shop/checkout');
          setOpenCartSheet(false);
          }} className="w-full mt-6 bg-black text-white">Checkout</Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
