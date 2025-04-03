import React, { useState } from "react";
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase";
import { signOut } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isStrongPassword = (password) => password.length >= 6;

    const resetFields = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setLoading(false);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);
    
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }
    
        if (!isStrongPassword(password)) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }
    
        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }
    
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                setSuccessMessage("Login successful!");
            } else {
                // 🔥 Create new user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 🔥 Save user data in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date(),
                });

                setSuccessMessage("Signup successful! Please log in with your credentials.");

                // ✅ Immediately log out after signup
                await signOut(auth);

                // ✅ Ensure Firebase updates state before redirecting
                setTimeout(() => {
                    resetFields();
                    setIsLogin(true); // Switch to login
                }, 1000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
                        Login
                    </button>
                    <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
                        Signup
                    </button>
                </div>

                {successMessage && <p className="success">{successMessage}</p>}
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleAuth}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    {!isLogin && (
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            required 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
}
