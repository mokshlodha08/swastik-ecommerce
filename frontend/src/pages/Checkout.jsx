import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api.js";

const emptyForm = { name: "", phone: "", email: "", address: "", city: "", pincode: "" };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in name, phone, and address.");
      return;
    }
    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Check your connection and try again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Ask the backend to create a Razorpay order (amount is calculated server-side)
      const orderPayload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer: form
      };
      const order = await api.createOrder(orderPayload);

      // 2. Open Razorpay's checkout with that order
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Swastik Distributor & Marketing",
        description: "Order payment",
        order_id: order.razorpayOrderId,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: form.email
        },
        theme: { color: "#e0562b" },
        handler: async (response) => {
          // 3. On success, verify the payment signature server-side
          try {
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            clearCart();
            navigate("/order-success", { state: { orderId: order.orderId } });
          } catch (err) {
            setError("Payment succeeded but verification failed. Contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      });

      rzp.on("payment.failed", (resp) => {
        setError("Payment failed: " + resp.error.description);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Could not start payment.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <div className="wrap"><div className="empty-state">Your cart is empty.</div></div>;
  }

  return (
    <div className="wrap">
      <h2 className="section-title">Checkout</h2>
      <form onSubmit={handlePay} style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
        <div className="form-grid full" style={{ flex: 1, minWidth: 320 }}>
          <div className="form-grid">
            <label className="field">
              Full name
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </label>
            <label className="field">
              Phone
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </label>
          </div>
          <label className="field">
            Email (optional)
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </label>
          <label className="field">
            Delivery address
            <textarea rows={3} value={form.address} onChange={(e) => update("address", e.target.value)} required />
          </label>
          <div className="form-grid">
            <label className="field">
              City
              <input value={form.city} onChange={(e) => update("city", e.target.value)} />
            </label>
            <label className="field">
              Pincode
              <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
            </label>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="cart-summary" style={{ marginLeft: 0, height: "fit-content" }}>
          {items.map((i) => (
            <div className="row" key={i.productId}>
              <span>{i.name} × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <div className="row total"><span>Total</span><span>₹{total}</span></div>
          <button className="btn primary block" style={{ marginTop: 14 }} disabled={loading}>
            {loading ? "Opening payment…" : `Pay ₹${total} with Razorpay`}
          </button>
        </div>
      </form>
    </div>
  );
}
