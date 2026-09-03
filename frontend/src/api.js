const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  getProducts: (params = "") => request(`/products${params}`),
  getProduct: (id) => request(`/products/${id}`),
  createOrder: (payload) =>
    request("/orders/create", { method: "POST", body: JSON.stringify(payload) }),
  verifyPayment: (payload) =>
    request("/orders/verify", { method: "POST", body: JSON.stringify(payload) }),
  adminLogin: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  adminGetProducts: (token) =>
    request("/products/admin/all", { headers: { Authorization: `Bearer ${token}` } }),
  adminCreateProduct: (token, product) =>
    request("/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(product)
    }),
  adminUpdateProduct: (token, id, product) =>
    request(`/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(product)
    }),
  adminDeleteProduct: (token, id) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }),
  adminGetOrders: (token) =>
    request("/orders/admin", { headers: { Authorization: `Bearer ${token}` } })
};
