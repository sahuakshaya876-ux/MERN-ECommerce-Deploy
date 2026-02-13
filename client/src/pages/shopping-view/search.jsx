import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";


function SearchProducts()
{
    const [keyword,setKeyword]=useState('');
    const [openDetailsDialog,setOpenDetailsDialog]=useState(false);
    const [searchParams,setSearchParams]=useSearchParams();
    const {searchResults}=useSelector(state=>state.shopSearch);
    const dispatch=useDispatch();
    const {cartItems}=useSelector((state)=>state.shopCart);
    const {productDetails}=useSelector((state)=>state.shopProducts);
    const {user}=useSelector((state)=>state.auth);
    const userId = user?.id || user?._id;
    const {toast}=useToast();

    useEffect(()=>{
        if(keyword && keyword.trim()!=='' && keyword.trim().length>3)
        {
            setTimeout(()=>{
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            },1000)
        }
        else{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults());
        }
    },[keyword]);


function handleAddToCart(productId,getTotalStock) {
    console.log(cartItems,"cartItems");

    let getCartItems = cartItems || [];

const indexOfCurrentItem = getCartItems.findIndex(
  item => item.productId === productId
);

if (indexOfCurrentItem > -1) {
  const getQuantity = getCartItems[indexOfCurrentItem].quantity;

  if (getQuantity>=getTotalStock) {
    toast({
      title: `Only ${getTotalStock} quantity can be added for this item`,
      variant: "destructive",
    });
    return;
  }
}
    dispatch(
      addToCart({
        userId,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(userId));
        toast({ title: "Product added to cart" });
      }
    });
  }

    function handleGetProductDetails(productId) {
        dispatch(fetchProductDetails(productId));
      }
    

     useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);


    console.log(searchResults,'searchResults');
    

    return(
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input 
                    value={keyword}
                    name="keyword" 
                    onChange={(event)=>setKeyword(event.target.value)} 
                    className="py-6" 
                    placeholder="Search Products..."
                    />
                </div>
            </div>
            {
                !searchResults.length?<h1 className="text-5xl font-extrabold">No result found!</h1>:
                null
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    searchResults.map(item=>
                    <ShoppingProductTile 
                    handleAddToCart={handleAddToCart} 
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                    />)
                }
            </div>
            <ProductDetailsDialog
               open={openDetailsDialog}
               setOpen={setOpenDetailsDialog}
               productDetails={productDetails}
            />
        </div>
    )
}

export default SearchProducts;