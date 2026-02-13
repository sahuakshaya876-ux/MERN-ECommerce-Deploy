
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useParams } from "react-router-dom";

/* ================= HELPERS ================= */

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }

  return queryParams.join("&");
}

function getFiltersFromSearchParams(searchParams) {
  const filters = {};

  for (const [key, value] of searchParams.entries()) {
    if (value) {
      filters[key] = value.split(",");
    }
  }

  return filters;
}

/* ================= COMPONENT ================= */

function ShoppingListing() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.shopCart);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);

  const userId = user?.id || user?._id;

  const params = useParams();

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { toast } = useToast();

  // DEBUG: trace lifecycle values to diagnose category -> listing reset on refresh
  console.debug("[Listing] params:", params);
  console.debug("[Listing] searchParams:", Object.fromEntries([...searchParams]));
  console.debug("[Listing] filters(state):", filters);

  /* ================= HANDLERS ================= */

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(sectionId, option) {
    setFilters((prev) => {
      const updated = { ...prev };

      if (!updated[sectionId]) {
        updated[sectionId] = [];
      }

      const index = updated[sectionId].indexOf(option);

      if (index === -1) {
        updated[sectionId].push(option);
      } else {
        updated[sectionId].splice(index, 1);
      }

      if (updated[sectionId].length === 0) {
        delete updated[sectionId];
      }

      sessionStorage.setItem("filters", JSON.stringify(updated));
      return updated;
    });
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

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

  /* ================= EFFECTS ================= */

  // 1️⃣ Sync filters from URL (CRITICAL FIX)
  useEffect(() => {
    const urlFilters = getFiltersFromSearchParams(searchParams);

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
      sessionStorage.setItem("filters", JSON.stringify(urlFilters));
    } else if (params?.category) {
      // If we have a category in the path but no query param yet,
      // prefer the path param so refresh doesn't clear the category.
      const c = params.category;
      const catFilters = { category: [c] };
      setFilters(catFilters);
      sessionStorage.setItem("filters", JSON.stringify(catFilters));
      setSearchParams(new URLSearchParams(`category=${encodeURIComponent(c)}`));
    } else {
      setFilters({});
      sessionStorage.removeItem("filters");
    }
    // also re-run if the category param (path) changes
  }, [searchParams, params?.category]);

  // 2️⃣ Update URL when filters change
  useEffect(() => {
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(queryString ? new URLSearchParams(queryString) : {});
  }, [filters]);

  // 2.1️⃣ Support direct category routes like /shop/men
  useEffect(() => {
    if (params?.category) {
      // If there's a category param, set filters and search params accordingly.
      const c = params.category;
      const newFilters = { ...filters, category: [c] };
      setFilters(newFilters);
      setSearchParams(new URLSearchParams(`category=${encodeURIComponent(c)}`));
    }
    // only run when params.category changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.category]);

  // 3️⃣ Fetch products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: filters,
        sortParams: sort,
      })
    );
  }, [filters, sort, dispatch]);

  // 4️⃣ Open product details dialog
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  // 5️⃣ Fetch cart
  useEffect(() => {
    if (userId) dispatch(fetchCartItems(userId));
  }, [userId, dispatch]);

  /* ================= JSX ================= */

  console.log(productList,"productList");


  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-white/80 w-full rounded-lg shadow-soft border border-white/60">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-primary-700">All Products</h2>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length || 0} Products
            </span>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList?.length ? (
            productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No products found
            </p>
          )}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
