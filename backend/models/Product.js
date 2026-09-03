import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, default: "pc" },
    imageUrl: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
