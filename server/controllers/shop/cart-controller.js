

const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

/* =========================
   FORMAT CART ITEMS
========================= */
const formatCartItems = (cart) => {
  return cart.items
    .filter((item) => item.productId)
    .map((item) => ({
      productId: item.productId._id,
      title: item.productId.title || "Product",
      image: item.productId.image || "",
      price: Number(item.productId.price) || 0,
      salePrice: Number(item.productId.salePrice) || 0,
      quantity: Number(item.quantity) || 1,
      totalStock: Number(item.productId.totalStock) || 0, // ✅ IMPORTANT
    }));
};

/* =========================
   ADD TO CART
========================= */
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({ success: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + quantity;

    // 🔴 HARD STOCK CHECK
    if (newQty > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} quantity can be added for this item`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price salePrice image totalStock"
    );

    res.status(200).json({
      success: true,
      data: {
        items: formatCartItems(populatedCart),
      },
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   FETCH CART ITEMS
========================= */
exports.fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price salePrice image totalStock"
    );

    res.status(200).json({
      success: true,
      data: {
        items: cart ? formatCartItems(cart) : [],
      },
    });
  } catch (error) {
    console.error("FETCH CART ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   UPDATE CART QUANTITY
========================= */
exports.updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({ success: false });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false });
    }

    // 🔴 HARD STOCK CHECK
    if (quantity > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} quantity can be added for this item`,
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(400).json({ success: false });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price salePrice image totalStock"
    );

    res.status(200).json({
      success: true,
      data: {
        items: formatCartItems(populatedCart),
      },
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   DELETE CART ITEM
========================= */
exports.deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price salePrice image totalStock"
    );

    res.status(200).json({
      success: true,
      data: {
        items: formatCartItems(populatedCart),
      },
    });
  } catch (error) {
    console.error("DELETE CART ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   CLEAR CART (USED AFTER ORDER)
========================= */
exports.clearCartByUserId = async (userId) => {
  await Cart.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(userId),
  });
};
