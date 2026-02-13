

const mongoose = require("mongoose");
const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product=require("../../models/Product");


/* ================= CREATE ORDER ================= */
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Order Payment",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
        });
      }

      const newlyCreatedOrder = new Order({
        userId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      });

      await newlyCreatedOrder.save();

      const approvalURL = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder._id,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/* ================= CAPTURE PAYMENT ================= */
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // ✅ Update order first
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
  const productId =
    item.productId._id || item.productId.id || item.productId;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (product.totalStock < item.quantity) {
    return res.status(400).json({
      success: false,
      message: `Not enough stock for ${product.title}`,
    });
  }

  product.totalStock = product.totalStock - item.quantity;
  await product.save();
}



    await order.save();

    // 🔥 DELETE CART AFTER ORDER IS SAVED
    await Cart.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(order.userId.toString()),
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed & cart cleared",
      data: order,
    });
  } catch (e) {
    console.error("CAPTURE PAYMENT ERROR:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


const getAllOrdersByUser=async(req,res)=>{
  try
  {
     const {userId}=req.params;

     const orders=await Order.find({userId});

     if(!orders.length)
     {
      return res.status(404).json({
        success:false,
        message:"No orders found!"
      })
     }

     res.status(200).json({
      success:true,
      data:orders
     });

  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
      success:false,
      message:"Some error occred!",
    })
  }
}

const getOrderDetails=async(req,res)=>{
  try
  {
    const {id}=req.params;

    const order=await Order.findById(id);

    if(!order)
    {
      return res.status(404).json({
        success:false,
        message:'Order not found!'
      })
    }

    res.status(200).json({
      success:true,
      data:order
    })

  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
      success:false,
      message:"Some error occred!",
    })
  }
}

module.exports = { createOrder, capturePayment ,getAllOrdersByUser,getOrderDetails};