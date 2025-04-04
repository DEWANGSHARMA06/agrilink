import './App.css';
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import SellPage from "./SellPage";
import BuyPage from "./BuyPage";
import FarmerProductList from "./FarmerProductList";
import ChatPage from "./ChatPage"; // Import ChatPage
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
        
        {/* Protected Routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} user={user} />} />
            <Route path="/sell" element={<SellPage user={user} />} />
            <Route path="/buy" element={<BuyPage user={user} />} />
            <Route path="/farmer-product-list" element={<FarmerProductList user={user} />} />
            <Route path="/chat" element={<ChatPage user={user} />} />
          </>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
