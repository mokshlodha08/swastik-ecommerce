import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const emptyProduct = {
  name: "", description: "", category: "", price: "", mrp: "", stock: "", unit: "pc", imageUrl: ""
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("swastik_admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadProducts();
    loadOrders();
  }, []);

  function loadProducts() {
    api.adminGetProducts(token).then(setProducts).catch(() => {});
  }
  function loadOrders() {
    api.adminGetOrders(token).then(setOrders).catch(() => {});
  }

  function logout() {
    localStorage.removeItem("swastik_admin_token");
    navigate("/admin/login");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : undefined,
      stock: Number(form.stock)
    };
    if (editingId) {
      await api.adminUpdateProduct(token, editingId, payload);
    } else {
      await api.adminCreateProduct(token, payload);
    }
    setForm(emptyProduct);
    setEditingId(null);
    loadProducts();
  }

  function startEdit(p) {
    setForm({
      name: p.name, description: p.description, category: p.category,
      price: p.price, mrp: p.mrp || "", stock: p.stock, unit: p.unit, imageUrl: p.imageUrl || ""
    });
    setEditingId(p._id);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await api.adminDeleteProduct(token, id);
    loadProducts();
  }

  return (
    <div>
      <div className="admin-shell">
        <div className="admin-side">
          <a className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</a>
          <a className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</a>
          <a onClick={logout}>Log out</a>
        </div>

        <div className="admin-main">
          {tab === "products" && (
            <>
              <h2>{editingId ? "Edit product" : "Add product"}</h2>
              <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: 16, marginBottom: 30 }}>
                <label className="field">Name
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </label>
                <label className="field">Category
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </label>
                <label className="field">Price (₹)
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </label>
                <label className="field">MRP (₹, optional)
                  <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
                </label>
                <label className="field">Stock
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </label>
                <label className="field">Unit
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>Image URL (optional)
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>Description
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </label>
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
                  <button className="btn primary">{editingId ? "Save changes" : "Add product"}</button>
                  {editingId && (
                    <button type="button" className="btn outline" onClick={() => { setForm(emptyProduct); setEditingId(null); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td style={{ display: "flex", gap: 8 }}>
                        <button className="btn outline" style={{ padding: "4px 10px", fontSize: "0.78rem" }} onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn outline" style={{ padding: "4px 10px", fontSize: "0.78rem" }} onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === "orders" && (
            <>
              <h2>Orders</h2>
              <table className="table">
                <thead>
                  <tr><th>Customer</th><th>Phone</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.customer?.name}</td>
                      <td>{o.customer?.phone}</td>
                      <td>₹{o.amount}</td>
                      <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
