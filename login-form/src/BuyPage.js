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
      
      <h2>{item.productName}</h2>
      {item.image && <img src={item.image} alt={item.productName} className="item-image" />}

      <p><strong>Price:</strong> ₹{item.price} per Kg</p>
      <p><strong>Quantity:</strong> {item.quantity} Kg</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Description:</strong> {item.description || "No description provided."}</p>
      
      <h3>Farmer Details</h3>
      <p><strong>Name:</strong> {item.farmerName || "Unknown"}</p>
      <p><strong>Contact:</strong> {item.contactNumber || "Not provided"}</p>

      {/* <button className="buy-btn">Buy Now</button> */}
      <button className="chat-btn" onClick={() => navigate("/chat", { state: { farmerId: item.farmerId } })}>
        Chat with Farmer
      </button>
    </div>
  );
}

export default BuyPage;
