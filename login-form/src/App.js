// import './App.css';
// import { useState, useEffect } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "./firebase";
// import AuthForm from "./AuthForm";
// import Dashboard from "./Dashboard";
// import SellPage from "./SellPage";
// import BuyPage from "./BuyPage"; // Import BuyPage
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
//         <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />} />
//         <Route path="/sell" element={user ? <SellPage /> : <Navigate to="/" />} />
//         <Route path="/buy" element={user ? <BuyPage /> : <Navigate to="/" />} /> {/* Buy Page Route */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import './App.css';
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import SellPage from "./SellPage";
import BuyPage from "./BuyPage";
import FarmerProductList from "./FarmerProductList"; // Import FarmerProductList
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
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
        <Route path="/dashboard" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/" />} />
        <Route path="/sell" element={user ? <SellPage /> : <Navigate to="/" />} />
        <Route path="/buy" element={user ? <BuyPage /> : <Navigate to="/" />} />
        <Route path="/farmer-product-list" element={user ? <FarmerProductList /> : <Navigate to="/" />} /> {/* Added FarmerProductList Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

