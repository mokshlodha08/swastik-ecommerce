import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="card">
      <Link to={`/product/${product._id}`} className="card-media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <span>{product.name}</span>
        )}
      </Link>
      <div className="card-body">
        <span className="card-tag">{product.category}</span>
        <Link to={`/product/${product._id}`} className="card-name">
          {product.name}
        </Link>
        <div className="card-price-row">
          <span className="card-price">₹{product.price}</span>
          {product.mrp > product.price && <span className="card-mrp">₹{product.mrp}</span>}
        </div>
        <span className="card-stock">
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
        <button
          className="btn primary block"
          disabled={outOfStock}
          onClick={() => addItem(product, 1)}
        >
          {outOfStock ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
