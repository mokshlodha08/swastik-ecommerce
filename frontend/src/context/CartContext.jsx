import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = sessionStorage.getItem("swastik_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("swastik_cart", JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        { productId: product._id, name: product.name, price: product.price, quantity }
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
