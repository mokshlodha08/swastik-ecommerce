import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="wrap"><p>Loading…</p></div>;

  return (
    <div className="wrap" style={{ padding: "40px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div className="card-media" style={{ borderRadius: 3, minHeight: 320 }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <span>{product.name}</span>
          )}
        </div>
        <div>
          <span className="card-tag">{product.category}</span>
          <h1 style={{ margin: "8px 0" }}>{product.name}</h1>
          <p style={{ color: "var(--ink-soft)" }}>{product.description}</p>
          <div className="card-price-row" style={{ margin: "16px 0" }}>
            <span className="card-price" style={{ fontSize: "1.6rem" }}>₹{product.price}</span>
            {product.mrp > product.price && <span className="card-mrp">₹{product.mrp}</span>}
          </div>
          <div className="qty-box" style={{ width: "fit-content", marginBottom: 20 }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn primary"
              disabled={product.stock <= 0}
              onClick={() => addItem(product, qty)}
            >
              Add to cart
            </button>
            <button
              className="btn outline"
              disabled={product.stock <= 0}
              onClick={() => {
                addItem(product, qty);
                navigate("/cart");
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
