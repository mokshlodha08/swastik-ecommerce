import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <div className="footer">
        <div className="wrap footer-grid">
          <div>
            <div className="brand" style={{ fontSize: "1.1rem" }}>Swastik<span>.</span></div>
            <p style={{ margin: "6px 0 0", maxWidth: 280 }}>
              Dealer in plastic household items &amp; gift items.
            </p>
          </div>
          <div>
            <div className="footer-label">Address</div>
            <p style={{ margin: "4px 0 0" }}>23 Thirupalli Street, Sowcarpet,<br />Chennai, Tamil Nadu</p>
          </div>
          <div>
            <div className="footer-label">Customer care</div>
            <p style={{ margin: "4px 0 0" }}>
              <a href="tel:+918778165689" style={{ color: "var(--ink)", fontWeight: 600 }}>
                +91 87781 65689
              </a>
            </p>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 20, fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Swastik Distributor &amp; Marketing. All rights reserved.
        </div>
      </div>
    </>
  );
}
