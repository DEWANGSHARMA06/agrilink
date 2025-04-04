import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./FarmerProfileForm.css";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FarmerProfileForm = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    farmAddress: "",
    liveLocation: "",
    mapLocation: { lat: 20.5937, lng: 78.9629 }, // Default: India center
    logisticsAvailable: "",
    transportationModes: "",
    certifications: "",
    paymentOptions: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfileData(prev => ({
          ...prev,
          email: user.email
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const locationString = `${latitude}, ${longitude}`;

          setProfileData((prevData) => ({
            ...prevData,
            liveLocation: locationString,
            mapLocation: { lat: latitude, lng: longitude },
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location.");
        }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  // Custom marker handling on map click
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setProfileData((prevData) => ({
          ...prevData,
          mapLocation: { lat, lng },
          liveLocation: `${lat}, ${lng}`,
        }));
      },
    });

    return <Marker position={[profileData.mapLocation.lat, profileData.mapLocation.lng]} />;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validatePhoneNumber = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate contact number
    if (!validatePhoneNumber(profileData.contactNumber)) {
      setSubmitError("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare complete profile data with all required fields
      const completeProfile = {
        ...profileData,
        farmerName: profileData.name || "Farmer",
        createdAt: new Date(),
        isComplete: true
      };

      await addDoc(collection(db, "farmers"), completeProfile);
      console.log("Farmer Profile Data:", completeProfile);

      // Redirect with complete profile data
      navigate("/farmer-product-list", {
        state: {
          farmerProfile: completeProfile,
          successMessage: "Profile saved successfully!"
        }
      });

    } catch (error) {
      console.error("Error saving farmer profile:", error);
      setSubmitError(
        error.code === 'permission-denied' 
          ? "You don't have permission to save profiles"
          : "Failed to save profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-form-container">
      <h2>Farmer Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">


        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </label>

        <label>
          Contact Number:
          <input type="tel" name="contactNumber" value={profileData.contactNumber} onChange={handleChange} required />
        </label>

        <label>
          Farm Address:
          <input type="text" name="farmAddress" value={profileData.farmAddress} onChange={handleChange} required />
        </label>

        <label>
          Live GPS Location:
          <div className="location-input">
            <input
              type="text"
              name="liveLocation"
              value={profileData.liveLocation}
              onChange={handleChange}
              placeholder="Latitude, Longitude"
              required
            />
            <button type="button" onClick={handleGetLocation}>Auto Fetch</button>
          </div>
        </label>

        <div className="map-container">
          <h4>Click on Map to Pin Location</h4>
          <MapContainer center={[profileData.mapLocation.lat, profileData.mapLocation.lng]} zoom={5} style={{ height: "300px" }}>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <label>
          Logistics Available?
          <select name="logisticsAvailable" value={profileData.logisticsAvailable} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        {profileData.logisticsAvailable === "Yes" && (
          <label>
            Transportation Modes:
            <input type="text" name="transportationModes" value={profileData.transportationModes} onChange={handleChange} placeholder="E.g. Truck, Van, Rickshaw" />
          </label>
        )}

        <label>
          Certifications:
          <input type="text" name="certifications" value={profileData.certifications} onChange={handleChange} placeholder="E.g. Organic, FSSAI" />
        </label>

        <label>
          Payment Options:
          <select name="paymentOptions" value={profileData.paymentOptions} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
            <option value="Both">Both</option>
          </select>
        </label>

        {submitError && <div className="error-message">{submitError}</div>}
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Farmer Profile"}
        </button>
      </form>
    </div>
  );
};

export default FarmerProfileForm;