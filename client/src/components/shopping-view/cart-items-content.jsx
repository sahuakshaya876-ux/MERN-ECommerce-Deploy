
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const title = cartItem?.title;
  const image = cartItem?.image;
  const price = Number(cartItem?.price) || 0;
  const salePrice = Number(cartItem?.salePrice) || 0;
  const finalPrice = salePrice > 0 ? salePrice : price;

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const handleUpdateQuantity = (item, action) => {
    // 🔴 STOCK LIMIT CHECK (NO API CALL)
    if (action === "plus" && item.quantity >= item.totalStock) {
      toast({
        title: `Only ${item.totalStock} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    // 🔴 PREVENT < 1
    if (action === "minus" && item.quantity === 1) return;

    const updatedQuantity =
      action === "plus" ? item.quantity + 1 : item.quantity - 1;

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: item.productId,
        quantity: updatedQuantity,
      })
    ).then((res) => {
      if (!res?.payload?.success) {
        toast({
          title: res?.payload?.message || "Stock limit reached",
          variant: "destructive",
        });
        return;
      }
      dispatch(fetchCartItems(user?.id));
    });
  };

  /* =========================
     DELETE ITEM
  ========================= */
  const handleDelete = (item) => {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: item.productId,
      })
    ).then(() => dispatch(fetchCartItems(user?.id)));
  };

  return (
    <div className="flex items-center space-x-4">
      <img src={image} alt={title} className="w-20 h-20 rounded object-cover" />

      <div className="flex-1">
        <h3 className="font-extrabold">{title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            disabled={cartItem.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="font-semibold">{cartItem.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(finalPrice * cartItem.quantity).toFixed(2)}
        </p>

        <Trash
          onClick={() => handleDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
