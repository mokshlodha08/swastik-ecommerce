import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  return (
    <div className="wrap" style={{ padding: "80px 24px", textAlign: "center" }}>
      <h1>Payment successful 🎉</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 10 }}>
        {state?.orderId ? `Order reference: ${state.orderId}` : "Your order has been placed."}
      </p>
      <Link to="/" className="btn primary" style={{ marginTop: 24, display: "inline-block" }}>
        Continue shopping
      </Link>
    </div>
  );
}
