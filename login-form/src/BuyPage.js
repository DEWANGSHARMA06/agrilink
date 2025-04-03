import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BuyPage.css";

function BuyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item; // Get item details from navigation state

  if (!item) {
    return <p>Item not found.</p>; // Handle case where item data is missing
  }

  return (
    <div className="buy-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <h2>{item.title}</h2>
      <img src={item.image} alt={item.title} className="item-image"/>
      <p>Price: {item.price}</p>
      <p>Category: {item.category}</p>
      <button className="buy-btn">Buy Now</button>
    </div>
  );
}

export default BuyPage;
