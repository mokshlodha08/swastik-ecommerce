import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="wrap">
        <div className="empty-state">
          Your cart is empty. <Link to="/" style={{ color: "var(--orange)" }}>Browse products →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h2 className="section-title">Your cart</h2>
      <div style={{ maxWidth: 640 }}>
        {items.map((item) => (
          <div className="cart-row" key={item.productId}>
            <span className="name">{item.name}</span>
            <div className="qty-box">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            <span>₹{item.price * item.quantity}</span>
            <button
              className="btn outline"
              style={{ padding: "4px 10px", fontSize: "0.78rem" }}
              onClick={() => removeItem(item.productId)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="row"><span>Items</span><span>{items.length}</span></div>
        <div className="row total"><span>Total</span><span>₹{total}</span></div>
        <button className="btn primary block" style={{ marginTop: 14 }} onClick={() => navigate("/checkout")}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
