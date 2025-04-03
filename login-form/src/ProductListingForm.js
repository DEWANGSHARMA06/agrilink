import React, { useState } from 'react';
import './ProductListingForm.css';

const ProductListingForm = ({ farmerProfile }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, formData]);
    setFormData({
      productName: '',
      category: '',
      quantity: '',
      price: '',
      description: '',
    });
  };

  const handleSubmitAll = () => {
    console.log('Farmer:', farmerProfile);
    console.log('Products:', products);
    // Store products in local storage or a global state management solution
    localStorage.setItem('products', JSON.stringify(products));
    alert('Products submitted successfully! Products are now visible on the dashboard.');
  };

  return (
    <div className="product-form-container">
      <h2>Product Listing for {farmerProfile.farmerName}</h2>
      <form onSubmit={handleAddProduct} className="product-form">
        <label>
          Product Name:
          <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
        </label>

        <label>
          Category:
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Pulses">Pulses</option>
          </select>
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
          <button onClick={handleSubmitAll}>Submit All Products</button>
        </div>
      )}
    </div>
  );
};

export default ProductListingForm;
