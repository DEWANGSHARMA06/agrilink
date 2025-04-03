import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = await getDocs(collection(db, "ads"));
        const adsList = adsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(adsList);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  const filteredItems = category === "All" ? items : items.filter((item) => item.category === category);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {user.email}!</h2>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="categories">
        {["All", "Grains & Pulses", "Fertilizers", "Seeds", "Farming Medicines"].map((cat) => (
          <button key={cat} className={category === cat ? "active" : ""} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.price}</p>
            </div>
          ))
        ) : (
          <p>No items available.</p>
        )}
      </div>

      <button className="sell-btn" onClick={() => navigate("/sell")}>+ बेचें (Sell)</button>
    </div>
  );
}

export default Dashboard;
