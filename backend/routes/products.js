import express from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products - public, list active products (optionally filter by category/search)
router.get("/", async (req, res) => {
  const { category, q } = req.query;
  const filter = { active: true };
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id - public
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// GET /api/products/admin/all - admin, includes inactive products
router.get("/admin/all", requireAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// POST /api/products - admin, create product
router.post("/", requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Could not create product", error: err.message });
  }
});

// PUT /api/products/:id - admin, update product
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Could not update product", error: err.message });
  }
});

// DELETE /api/products/:id - admin, remove product
router.delete("/:id", requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

export default router;
