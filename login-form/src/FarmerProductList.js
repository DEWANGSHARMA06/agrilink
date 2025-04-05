// import React from "react";
// import { useLocation } from "react-router-dom";
// import ProductListingForm from './ProductListingForm';
// import './FarmerProductList.css';

// const FarmerProductList = () => {
//   const location = useLocation();
//   const { farmerProfile } = location.state || {};

//   if (!farmerProfile) {
//     return <h2>Farmer Profile Not Found</h2>;
//   }

//   return (
//     <div>
//       <h2>Product Listings for {farmerProfile.farmerName}</h2>
//       <p>Contact: {farmerProfile.contactNumber}</p>
//       <p>Farm Address: {farmerProfile.farmAddress}</p>
//       <ProductListingForm farmerProfile={farmerProfile} />
//     </div>
//   );
// };

// export default FarmerProductList;

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductListingForm from "./ProductListingForm";
import "./FarmerProductList.css";

const FarmerProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { farmerProfile } = location.state || {};

  if (!farmerProfile) {
    return <h2>Farmer Profile Not Found</h2>;
  }

  // Callback function to redirect after adding product
  const handleProductAdded = () => {
    navigate("/dashboard"); // Redirect to Dashboard
  };
  return (
    <div>
      <h2 >Product Listings for {farmerProfile.farmerName}</h2>
      <p>Contact: {farmerProfile.contactNumber}</p>
      <p>Farm Address: {farmerProfile.farmAddress}</p>
      <ProductListingForm farmerProfile={farmerProfile} onProductAdded={handleProductAdded} />
    </div>
  );
};

export default FarmerProductList;
