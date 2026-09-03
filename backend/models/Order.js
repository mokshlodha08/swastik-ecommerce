import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    amount: { type: Number, required: true },
    customer: {
      name: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      pincode: String
    },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
