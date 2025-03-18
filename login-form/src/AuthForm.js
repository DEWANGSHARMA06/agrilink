import React, { useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isStrongPassword = (password) => password.length >= 6;

    const resetFields = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSuccessMessage("");
        setError("");
        setLoading(false);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
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
                console.log("Login successful!"); // Debugging log
                setSuccessMessage("Login successful!");
                resetFields();
                setLoading(false); // Ensure loading stops after successful login


            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date()
                });
    
                console.log("Account created successfully! Please log in."); // Debugging log
                setSuccessMessage("Account created successfully! Please log in.");
                setIsLogin(true); // Switch to login after signup
                setLoading(false); // Ensure loading stops after successful signup


            }
    
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    
    return (
        <div className="auth-container">
            <div className="form-container">
                <div className="form-toggle">
                    <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
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