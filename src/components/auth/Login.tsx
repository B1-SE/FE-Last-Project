import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import './auth.css';

interface IFirebaseError extends Error {
    code?: string;
}

function isFirebaseError(error: unknown): error is IFirebaseError {
    return error instanceof Error && typeof (error as IFirebaseError).code === 'string';
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");

        let isValid = true;
        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        }
        if (!password) {
            setPasswordError("Password is required");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            isValid = false;
        }

        if (!isValid) return;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error: unknown) {
            if (isFirebaseError(error)) {
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    setEmailError("Invalid email or password");
                } else {
                    setEmailError(error.message);
                }
            } else if (error instanceof Error) {
                setEmailError(error.message);
            } else {
                setEmailError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="form">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                {emailError && <p className="error">{emailError}</p>}
                {passwordError && <p className="error">{passwordError}</p>}
                <fieldset>
                    <legend>Login</legend>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;