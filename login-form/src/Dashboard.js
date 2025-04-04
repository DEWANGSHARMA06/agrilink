import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user || !user.email) {
      console.warn("User not logged in or missing email.");
      return;
    }

    const adsCollection = collection(db, "ads");
    const q = query(adsCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(adsList);
    });

    return () => unsubscribe();
  }, [user]);

  // 🛑 Filter by category & search
  const filteredItems = items
    .filter((item) => category === "All" || item.category === category)
    .filter((item) =>
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome </h2>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="categories">
        {["All", "Grains " ,"Pulses", "Fertilizers", "Seeds", "Farming Medicines", "Fruits"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => navigate("/buy", { state: { item } })}
            >
              <h3>{item.productName || "Unnamed Product"}</h3>
              <p>₹{item.price || "N/A"} per Kg</p>
              <p>{item.category || "No Category"}</p>
            </div>
          ))
        ) : (
          <p>No items available.</p>
        )}
      </div>

      <button className="sell-btn" onClick={() => navigate("/sell")}>
        + बेचें (Sell)
      </button>
    </div>
  );
}

export default Dashboard;
