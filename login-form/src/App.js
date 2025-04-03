import './App.css';
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import SellPage from "./SellPage"; // Import Sell Page
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to Dashboard if logged in, else show Login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
        
        {/* Dashboard Route (Only accessible when logged in) */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />} 
        />
        
        {/* Sell Page Route (Only accessible when logged in) */}
        <Route 
          path="/sell" 
          element={user ? <SellPage /> : <Navigate to="/" />} 
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
