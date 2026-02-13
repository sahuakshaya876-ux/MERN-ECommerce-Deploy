

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { clearCart, fetchCartItems } from "@/store/shop/cart-slice";
import { resetOrderState } from "@/store/shop/order-slice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  // 🔒 Prevent double execution (React StrictMode fix)
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    if (
      hasCapturedRef.current ||
      !paymentId ||
      !payerId ||
      !user?._id
    ) {
      return;
    }

    hasCapturedRef.current = true;

    const orderId = JSON.parse(
      sessionStorage.getItem("currentOrderId")
    );

    if (!orderId) return;

    dispatch(capturePayment({ paymentId, payerId, orderId }))
      .then((res) => {
        if (res?.payload?.success) {
          // ✅ CLEAR REDUX CART
          dispatch(clearCart());

          // ✅ SYNC CART WITH DB (cart was deleted server-side)
          dispatch(fetchCartItems(user._id));

          // ✅ RESET ORDER STATE (stops PayPal redirect loop)
          dispatch(resetOrderState());

          // ✅ CLEAN SESSION
          sessionStorage.removeItem("currentOrderId");

          navigate("/shop/payment-success", { replace: true });
        }
      });
  }, [paymentId, payerId, user, dispatch, navigate]);

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center">
          Processing Payment… Please wait
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
