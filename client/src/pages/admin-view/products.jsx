import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sheet } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/product-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const initialFormData={
    image:null,
    title:'',
    description:'',
    category:'',
    brand:'',
    price:'',
    salePrice:'',
    totalStock:'',
}

function AdminProducts()
{
    const[openCreateProductsDialog,setOPenCreateProductDialog]=useState(false);
    const [formData,setFormData]=useState(initialFormData);
    const[imageFile,setImageFile]=useState(null);
    const[uploadedImageUrl,setUploadedImageUrl]=useState('');
    const [imageLoadingState,setImageLoadingState]=useState(false);
    const [currentEditedId,setCurrentEditedId]=useState(null);


    const {productList}=useSelector(state=>state.adminProducts);
    const dispatch=useDispatch();
    const {toast}=useToast();

    function onSubmit(event)
    {
        event.preventDefault();

        currentEditedId!==null ?
        dispatch(editProduct({
            id:currentEditedId,formData
        })).then((data)=>{
            console.log(data,"edit");

            if(data?.payload?.success)
            {
                dispatch(fetchAllProducts());
                setFormData(initialFormData);
                setOPenCreateProductDialog(false);
                setCurrentEditedId(null);
            }
        }):
        dispatch(addNewProduct({
            ...formData,
            image:uploadedImageUrl
        })).then((data)=>{
            console.log(data);
            if(data?.payload?.success)
            {
                dispatch(fetchAllProducts());
                setOPenCreateProductDialog(false);
                setImageFile(null);
                setFormData(initialFormData);
                toast({
                    title:"Product added successfully"
                })
            }
        })

    }

    function handleDelete(getCurrentProductId)
    {
        dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
            if(data?.payload?.success)
            {
                dispatch(fetchAllProducts());
            }
        })
    }


    function isFormValid()
    {
        return Object.keys(formData)
        .map(key=>formData[key]!=="")
        .every((item)=>item);
    }

    useEffect(()=>
    {
        dispatch(fetchAllProducts());
    },[dispatch]);

    console.log(productList,uploadedImageUrl,'productList');
    return(
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={()=>setOPenCreateProductDialog(true)}
                className="bg-black text-white">Add New Product</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length>0?
                    productList.map(productItem=> 
                    <AdminProductTile setFormData={setFormData}
                     setOPenCreateProductDialog={setOPenCreateProductDialog} 
                     setCurrentEditedId={setCurrentEditedId} 
                     product={productItem}
                     handleDelete={handleDelete}
                     />):null
                }
            </div>
            <Sheet open={openCreateProductsDialog}
            onOpenChange={()=>{
                setOPenCreateProductDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
            }}>
                <SheetContent side="right" className="fixed top-0 right-0 h-screen w-[420px] z-50 overflow-y-auto  bg-white text-black">
                    <SheetHeader>
                        <SheetTitle>
                            {
                                currentEditedId!==null?
                                'Edit Product':'Add New Product'
                            }
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload 
                    imageFile={imageFile} 
                    setImageFile={setImageFile} 
                    uploadedImageUrl={uploadedImageUrl} 
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={currentEditedId!==null}
                    />
                    <div className="py-6">
                        <CommonForm 
                        onSubmit={onSubmit}
                        formData={formData} 
                        setFormData={setFormData} 
                        buttonText={currentEditedId!==null? 'Edit':'Add'}
                        formControls={addProductFormElements}
                        isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    )
}

export default AdminProducts;