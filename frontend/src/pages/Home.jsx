import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const visible =
    category === "All" ? products : products.filter((p) => p.category === category);

  return (
    <div className="wrap">
      <div className="hero">
        <h1>Everyday plastic household goods, sold straight and simple.</h1>
        <p>
          Dealers in plastic household items and gift items — buckets, storage, and
          daily-use plastic ware for homes and shops, stocked in quantity, priced fair.
        </p>
        <div className="hero-strip">
          <div className="hero-stat"><b>{products.length}+</b>Products in stock</div>
          <div className="hero-stat"><b>Pan-India</b>Delivery</div>
          <div className="hero-stat"><b>Secure</b>Razorpay checkout</div>
          <div className="hero-stat"><b>87781 65689</b>Customer care</div>
        </div>
      </div>

      <div className="filters">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${c === category ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading products…</p>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          No products yet. Add some from the admin dashboard.
        </div>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
