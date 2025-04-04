// import React, { useState } from 'react';
// import './ProductListingForm.css';
// import { db } from './firebase';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// const ProductListingForm = ({ farmerProfile }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     productName: '',
//     category: '',
//     quantity: '',
//     price: '',
//     description: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();
//     setProducts([...products, formData]);
//     setFormData({
//       productName: '',
//       category: '',
//       quantity: '',
//       price: '',
//       description: '',
//     });
//   };

//   const handleSubmitAll = async () => {
//     setIsSubmitting(true);
//     setSubmitError(null);

//     console.log('Farmer Profile:', farmerProfile); // Debugging log

//     // Validate farmerProfile
//     if (!farmerProfile || !farmerProfile.farmerName) {
//       setSubmitError('Error: Farmer profile is missing essential details.');
//       console.error('Farmer profile is undefined or incomplete:', farmerProfile);
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const adsCollection = collection(db, 'ads');

//       // Submitting each product in the list
//       for (const product of products) {
//         const productData = {
//           ...product,
//           farmerName: farmerProfile.farmerName,
//           contactNumber: farmerProfile.contactNumber || 'N/A',
//           createdAt: serverTimestamp(),
//         };

//         await addDoc(adsCollection, productData);
//       }

//       alert('Products submitted successfully! Your ads are now live.');
//       setProducts([]); // Clear the product list after successful submission
//     } catch (error) {
//       console.error('Firestore submission error:', error);
//       setSubmitError(`Failed to submit products: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="product-form-container">
//       <h2>Product Listing for {farmerProfile?.farmerName || 'Unknown Farmer'}</h2>
//       <form onSubmit={handleAddProduct} className="product-form">
//         <label>
//           Product Name:
//           <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
//         </label>

//         <label>
//           Category:
//           <select name="category" value={formData.category} onChange={handleChange} required>
//             <option value="">Select Category</option>
//             <option value="Fruits">Fruits</option>
//             <option value="Grains">Grains</option>
//             <option value="Pulses">Pulses</option>
//           </select>
//         </label>
          
//         <label>
//           Quantity (Kg):
//           <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
//         </label>

//         <label>
//           Price (₹ per Kg):
//           <input type="number" name="price" value={formData.price} onChange={handleChange} required />
//         </label>

//         <label>
//           Description:
//           <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
//         </label>

//         <button type="submit">Add Product</button>
//       </form>

//       {products.length > 0 && (
//         <div className="product-list">
//           <h3>Products Listed:</h3>
//           <ul>
//             {products.map((prod, index) => (
//               <li key={index}>
//                 <strong>{prod.productName}</strong> - {prod.category} - {prod.quantity}Kg - ₹{prod.price}/Kg
//               </li>
//             ))}
//           </ul>
//           <button onClick={handleSubmitAll} disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : 'Submit All Products'}
//           </button>
//           {submitError && <p className="error-message">{submitError}</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductListingForm;

import React, { useState } from 'react';
import './ProductListingForm.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ProductListingForm = ({ farmerProfile, onProductAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
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

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!farmerProfile || !farmerProfile.farmerName) {
      setSubmitError('Error: Farmer profile is missing essential details.');
      setIsSubmitting(false);
      return;
    }

    try {
      const adsCollection = collection(db, 'ads');

      for (const product of products) {
        const productData = {
          ...product,
          farmerName: farmerProfile.farmerName,
          contactNumber: farmerProfile.contactNumber || 'N/A',
          createdAt: serverTimestamp(),
        };

        await addDoc(adsCollection, productData);
      }

      alert('Products submitted successfully! Your ads are now live.');
      setProducts([]); // Clear the product list

      if (onProductAdded) {
        onProductAdded(); // 🚀 Redirect to Dashboard
      }
    } catch (error) {
      setSubmitError(`Failed to submit products: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Product Listing for {farmerProfile?.farmerName || 'Unknown Farmer'}</h2>
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
          <button onClick={handleSubmitAll} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit All Products'}
          </button>
          {submitError && <p className="error-message">{submitError}</p>}
        </div>
      )}
    </div>
  );
};

export default ProductListingForm;
