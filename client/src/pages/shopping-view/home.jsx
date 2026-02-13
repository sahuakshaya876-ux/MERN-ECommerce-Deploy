
import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  ArrowUpZA,
  BabyIcon,
  Baseline,
  CheckLine,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Fence,
  Heading4,
  PhilippinePeso,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

/* ================= DATA ================= */

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: CheckLine },
  { id: "adidas", label: "Adidas", icon: Baseline },
  { id: "puma", label: "Puma", icon: PhilippinePeso },
  { id: "levi", label: "Levi's", icon: Fence },
  { id: "zara", label: "Zara", icon: ArrowUpZA },
  { id: "h&m", label: "H&M", icon: Heading4 },
];

/* ================= COMPONENT ================= */

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList,productDetails} = useSelector((state) => state.shopProducts);
  const [openDetailsDialog,setOpenDetailsDialog]=useState(false);
  const {user}=useSelector((state)=>state.auth);
   const {featureImageList}=useSelector(state=>state.commonFeature);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {toast}=useToast();

  /* ================= FIXED NAVIGATION ================= */

  function handleNavigateToListingPage(item, section) {
    // For category navigation we prefer a clean route like /shop/men
    // so it persists across refreshes and is bookmarkable.
    if (section === "category") {
      navigate(`/shop/${item.id}`);
      return;
    }

    const params = new URLSearchParams();
    params.set(section, item.id);
    navigate(`/shop/listing?${params.toString()}`);
  }

  /* ================= EFFECTS ================= */

  function handleGetProductDetails(productId) {
      dispatch(fetchProductDetails(productId));
   }
  
  function handleAddToCart(getCurrentProductId) {
      dispatch(
        addToCart({
          userId:user.id,
          productId:getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast({ title: "Product added to cart" });
        }
      });
    }

  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImageList.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

   useEffect(()=>{
          dispatch(getFeatureImages())
      },[dispatch]);
  

  /* ================= JSX ================= */

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SLIDER */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? 
        featureImageList.map((slide, index) => (
          <img
            src={slide?.image}
            key={index}
            alt=""
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        )):null}

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* SHOP BY CATEGORY */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-700">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((category) => (
              <Card
                key={category.id}
                onClick={() =>
                  handleNavigateToListingPage(category, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <category.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-700">
            Shop by Brand
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brand.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE PRODUCTS */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0 &&
              productList.map((product) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  key={product._id}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              ))}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
