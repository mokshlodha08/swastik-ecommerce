// One-time setup script: creates the admin account and a few sample products.
// Run with: npm run seed
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const existing = await Admin.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log(`Admin account created for ${email}`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Heavy Duty Storage Bucket 20L",
        description: "Durable virgin plastic bucket with sturdy handle.",
        category: "Storage",
        price: 249,
        mrp: 299,
        stock: 50,
        unit: "pc"
      },
      {
        name: "Stackable Storage Basket - Set of 3",
        description: "Multipurpose kitchen and wardrobe storage baskets.",
        category: "Storage",
        price: 399,
        mrp: 499,
        stock: 30,
        unit: "set"
      },
      {
        name: "Plastic Dining Chair",
        description: "Lightweight, weatherproof, easy to clean.",
        category: "Furniture",
        price: 599,
        mrp: 699,
        stock: 20,
        unit: "pc"
      }
    ]);
    console.log("Sample products added.");
  } else {
    console.log("Products already exist, skipping sample data.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed();
