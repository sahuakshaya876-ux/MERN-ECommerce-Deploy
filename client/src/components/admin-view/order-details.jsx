import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";

const initialFormData={
    status:''
}

function AdminOrderDetailsView({orderDetails})
{
    const [formData,setFormData]=useState(initialFormData);
    const {user}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const {toast}=useToast();

    

    function handleUpdateStatus(event)
    {
        event.preventDefault();
        console.log(formData);
        const {status}=formData;

        dispatch(updateOrderStatus({id:orderDetails?._id,orderStatus:status})).then(data=>{
            if(data?.payload?.success)
            {
                dispatch(getOrderDetailsForAdmin(orderDetails?._id));
                dispatch(getAllOrdersForAdmin());
                setFormData(initialFormData);
                toast({
                    title:data?.payload?.message,
                })
            }
        })
    }

    return(
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-black border border-gray-200
    shadow-lg">
            <div className="grid gap-6">
                 <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                     <div className="flex mt-1 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className="flex mt-1 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex mt-1 items-center justify-between">
                        <p className="font-medium">Payment Method</p>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className="flex mt-1 items-center justify-between">
                        <p className="font-medium">Payment Status</p>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                     <div className="flex mt-1 items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Label>
                            <Badge
                            className={`py-1 px-3 ${
                                orderDetails?.orderStatus==="confirmed"
                                ?"bg-green-500":
                                orderDetails?.orderStatus==="rejected" ? 'bg-red-600'
                                :"bg-black text-white"
                            }`}
                            >
                                {orderDetails?.orderStatus}
                            </Badge>
                        </Label>
                    </div>
                </div>
                <Separator/>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order details</div>
                        <ul className="grid gap-3">
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems.length>0 ?
                                orderDetails?.cartItems.map(item=> <li className="flex items-center justify-between">
                                <span>Title:{item.title}</span>
                                <span>Quantity:{item.quantity}</span>
                                <span>Price:${item.price*item.quantity}</span>
                            </li>)
                                :null
                            }
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>{user.userName}</span>
                            <span>{orderDetails?.addressInfo?.address}</span>
                            <span>{orderDetails?.addressInfo?.city}</span>
                            <span>{orderDetails?.addressInfo?.pincode}</span>
                            <span>{orderDetails?.addressInfo?.phone}</span>
                            <span>{orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <CommonForm
                    formControls={[
                        {
                            label:"Order Status",
                            name:"status",
                            componentType:"select",
                            options:[
                                {id:"pending",label:"Pending"},
                                {id:"inProcess",label:"In Process"},
                                {id:"inShipping",label:"In Shipping"},
                                {id:"delivered",label:"Delivered"},
                                {id:"rejected",label:"Rejected"},
                            ],
                        }
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={'Update order Status'}
                    onSubmit={handleUpdateStatus}
                    />
                </div>
            </div>
        </DialogContent>
    )
}

export default AdminOrderDetailsView;