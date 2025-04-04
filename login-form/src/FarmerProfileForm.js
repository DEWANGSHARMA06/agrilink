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
    email: "",
    contactNumber: "",
    farmAddress: {
      streetName: "",
      landmark: "",
      pincode: "",
      city: "",
      state: ""
    },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "farmers"), profileData);
      console.log("Farmer Profile Data:", profileData);
      alert("Farmer Profile Saved!");

      // Redirect to FarmerProductList with profile data
      navigate("/farmer-product-list", { state: { farmerProfile: profileData } });

    } catch (error) {
      console.error("Error saving farmer profile:", error);
      console.error("Error saving farmer profile:", error);
      alert("Failed to save farmer profile! Check console for details.");
    }
  };

  return (
    <div className="profile-form-container">
      <h2>Farmer Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="email-field">
          <label>Email:</label>
          <div className="email-value">
            {profileData.email || "Loading email..."}
          </div>
        </div>


        <label>
          Contact Number:
          <input type="tel" name="contactNumber" value={profileData.contactNumber} onChange={handleChange} required />
        </label>

        <div className="address-section">
          <h4>Farm Address</h4>
          <label>
            Street Name:
            <input
              type="text"
              name="streetName"
              value={profileData.farmAddress.streetName}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                farmAddress: {
                  ...prev.farmAddress,
                  streetName: e.target.value
                }
              }))}
              required
            />
          </label>
          <label>
            Landmark:
            <input
              type="text"
              name="landmark"
              value={profileData.farmAddress.landmark}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                farmAddress: {
                  ...prev.farmAddress,
                  landmark: e.target.value
                }
              }))}
            />
          </label>
          <label>
            Pincode:
            <input
              type="text"
              name="pincode"
              value={profileData.farmAddress.pincode}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                farmAddress: {
                  ...prev.farmAddress,
                  pincode: e.target.value
                }
              }))}
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={profileData.farmAddress.city}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                farmAddress: {
                  ...prev.farmAddress,
                  city: e.target.value
                }
              }))}
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={profileData.farmAddress.state}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                farmAddress: {
                  ...prev.farmAddress,
                  state: e.target.value
                }
              }))}
              required
            />
          </label>
        </div>

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

        <button type="submit">Save Farmer Profile</button>
      </form>
    </div>
  );
};

export default FarmerProfileForm;
