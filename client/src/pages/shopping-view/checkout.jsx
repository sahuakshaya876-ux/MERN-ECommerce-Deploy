

import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import img from "../../assets/account.jpg";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);


  /* ================= TOTAL ================= */
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item.quantity,
          0
        )
      : 0;

  /* ================= PAYPAL HANDLER ================= */
  const handleInitialPaypalPayment = () => {
    
    if(cartItems.length===0)
    {
      toast({
        title:"Your cart is empty.Please add items to proceed",
        variant:"destructive"
      });
      return;
    }

    if (currentSelectedAddress===null) {
      toast({
        title: "Please select one address to proceed",
        variant: "destructive",
      });
      return;
    }

     setIsPaymentStart(true);

    const orderData = {
      userId: user?._id,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData));
  };

  /* ================= REDIRECT TO PAYPAL ================= */
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="checkout-banner"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {/* LEFT : ADDRESSES */}
        <Address 
        selectedId={currentSelectedAddress}
        setCurrentSelectedAddress={setCurrentSelectedAddress} />

        {/* RIGHT : CART SUMMARY */}
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent
                key={item.productId || item._id}
                cartItem={item}
              />
            ))
          ) : (
            <p className="text-gray-500">Cart is empty</p>
          )}

          {/* TOTAL */}
          <div className="mt-6 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalCartAmount}</span>
          </div>

          {/* PAYPAL BUTTON */}
          <Button
            className="mt-4 w-full bg-black text-white disabled:opacity-50"
            onClick={handleInitialPaypalPayment}
          >
            {
              isPaymentStart ? 'Processing Paypal Payment...':'Checkout with Paypal'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
