import express from "express";
import crypto from "crypto";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { razorpay } from "../utils/razorpay.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders/create
// Body: { items: [{ productId, quantity }], customer: {...} }
// Recalculates the amount from the database (never trust prices sent by the browser)
// and creates a Razorpay order for that amount.
router.post("/create", async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let amount = 0;
    const orderItems = [];

    for (const line of items) {
      const product = await Product.findById(line.productId);
      if (!product || !product.active) {
        return res.status(400).json({ message: `Product unavailable: ${line.productId}` });
      }
      if (product.stock < line.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      amount += product.price * line.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: line.quantity
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    const order = await Order.create({
      items: orderItems,
      amount,
      customer,
      razorpayOrderId: razorpayOrder.id,
      status: "created"
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ message: "Could not create order", error: err.message });
  }
});

// POST /api/orders/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the payment signature server-side, then marks the order paid and
// decrements stock. This is the step that actually confirms money was received.
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.json({ message: "Payment verified", order });
  } catch (err) {
    res.status(500).json({ message: "Verification error", error: err.message });
  }
});

// GET /api/orders/admin - admin, list all orders
router.get("/admin", requireAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
