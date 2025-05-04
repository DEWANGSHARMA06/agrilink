import React, { useState } from "react";
import "./ProductListingForm.css";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Header from "./Header";

const categoryOptions = {
  "Grains": ["Rice", "Wheat", "Barley", "Maize", "Oats"],
  "Pulses": ["Lentils", "Chickpeas", "Green Gram", "Black Gram", "Peas"],
  "Fertilizers": ["Urea", "DAP", "MOP", "Compost", "Organic Fertilizer"],
  "Seeds": ["Wheat Seeds", "Rice Seeds", "Vegetable Seeds", "Flower Seeds"],
  "Farming Medicines": ["Pesticides", "Herbicides", "Fungicides"],
  "Fruits": ["Mango", "Apple", "Banana", "Grapes", "Guava"],
  "Other": [],
};

const ProductListingForm = ({ farmerProfile, onProductAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    quantity: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProductOptions(categoryOptions[value] || []);
      setFormData((prevData) => ({
        ...prevData,
        category: value,
        productName: "", // Reset product name on category change
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.productName || !formData.quantity || !formData.price) {
      setSubmitError("All fields are required.");
      return;
    }

    setProducts([...products, formData]);

    setFormData({
      category: "",
      productName: "",
      quantity: "",
      price: "",
      description: "",
    });

    setSubmitError(null);
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!farmerProfile || !farmerProfile.farmerName) {
      setSubmitError("Error: Farmer profile is missing essential details.");
      setIsSubmitting(false);
      return;
    }

    try {
      const adsCollection = collection(db, "ads");

      for (const product of products) {
        const productData = {
          ...product,
          farmerName: farmerProfile.farmerName,
          contactNumber: farmerProfile.contactNumber || "N/A",
          createdAt: serverTimestamp(),
        };

        await addDoc(adsCollection, productData);
      }

      alert("Products submitted successfully! Your ads are now live.");
      setProducts([]); // Clear the product list
      onProductAdded?.(); // Redirect to Dashboard
    } catch (error) {
      setSubmitError(`Failed to submit products: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <Header title={`Product Listing for ${farmerProfile?.farmerName || "Unknown Farmer"}`} />

      <form onSubmit={handleAddProduct} className="product-form">
        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {Object.keys(categoryOptions).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product Name:
          {formData.category && productOptions.length > 0 ? (
            <select name="productName" value={formData.productName} onChange={handleChange} required>
              <option value="">Select Product</option>
              {productOptions.map((product, index) => (
                <option key={index} value={product}>
                  {product}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          )}
        </label>

        <label>
          Quantity (Kg):
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </label>

        <label>
          Price (₹ per Kg):
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </label>

        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </label>

        <button type="submit">Add Product</button>
      </form>

      {products.length > 0 && (
        <div className="product-list">
          <h3>Products Listed:</h3>
          <ul>
            {products.map((prod, index) => (
              <li key={index}>
                <strong>{prod.productName}</strong> - {prod.category} - {prod.quantity}Kg - ₹{prod.price}/Kg
              </li>
            ))}
          </ul>
          <button onClick={handleSubmitAll} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit All Products"}
          </button>
          {submitError && <p className="error-message">{submitError}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductListingForm;
