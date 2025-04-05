// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "./firebase"; 
// import { collection, addDoc } from "firebase/firestore"; 

// export default function SellPage() {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("Grains & Pulses");

//   const handlePostAd = async () => {
//     if (!title || !price) {
//       alert("Please fill all fields!");
//       return;
//     }

//     try {
//       // Add ad to Firestore collection "ads"
//       await addDoc(collection(db, "ads"), {
//         title,
//         price,
//         category,
//         createdAt: new Date(),
//       });

//       alert("Ad Posted Successfully!");
//       navigate("/dashboard");  // Redirect to Dashboard
//     } catch (error) {
//       console.error("Error posting ad:", error);
//       alert("Failed to post ad!");
//     }
//   };

//   return (
//     <div className="sell-container">
//       <h2>अपना विज्ञापन डालें (Post Your Ad)</h2>
//       <input type="text" placeholder="उत्पाद का नाम (Item Title)" value={title} onChange={(e) => setTitle(e.target.value)} />
//       <input type="text" placeholder="मूल्य (Price ₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
//       <select value={category} onChange={(e) => setCategory(e.target.value)}>
//         <option value="Grains & Pulses">Grains & Pulses</option>
//         <option value="Fertilizers">Fertilizers</option>
//         <option value="Seeds">Seeds</option>
//         <option value="Farming Medicines">Farming Medicines</option>
//       </select>
//       <button onClick={handlePostAd}>विज्ञापन डालें (Post Ad)</button>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import FarmerProfileForm from "./FarmerProfileForm";
import './SellPage.css';

export default function SellPage() {
  const navigate = useNavigate();
  const [, setFarmerProfile] = useState(null);

  // Handle Farmer Profile Submission
  const handleProfileSubmit = async (profileData) => {
    setFarmerProfile(profileData);
    
    try {
      await addDoc(collection(db, "farmers"), profileData);
      alert("Farmer Profile Saved!");

      // Redirect to FarmerProductList with profile data
      navigate("/farmer-product-list", { state: { farmerProfile: profileData } });
      
    } catch (error) {
      console.error("Error saving farmer profile:", error);
      alert("Failed to save farmer profile!");
    }
  };

  return (
    <div className="sell-page">
      <div className="sell-container">
        <h2 className="sell-title">अपना विज्ञापन डालें (Post Your Ad)</h2>
        
        {/* Farmer Profile Form */}
        <FarmerProfileForm onProfileSubmit={handleProfileSubmit} />
      </div>
    </div>
  );
}
