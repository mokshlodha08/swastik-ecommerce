import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand-block">
          <span className="brand">
            Swastik<span>.</span>
          </span>
          <span className="brand-sub">Distributor &amp; Marketing</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Shop</Link>
          <Link to="/cart" className="cart-pill">Cart · {count}</Link>
        </div>
      </div>
    </div>
  );
}
