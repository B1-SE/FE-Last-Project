import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase/firebase";
import "./auth.css";
import { useNavigate } from "react-router-dom";

interface IFirebaseError extends Error {
    code?: string;
}

function isFirebaseError(error: unknown): error is IFirebaseError {
    return error instanceof Error && typeof (error as IFirebaseError).code === 'string';
}

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; displayName?: string; general?: string }>({});
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const newErrors: { email?: string; password?: string; confirmPassword?: string; displayName?: string; general?: string } = {};
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!displayName) {
            newErrors.displayName = "Name is required";
        }
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email,
                displayName,
                createdAt: new Date().toISOString()
            });
            navigate("/profile");
        } catch (error: unknown) {
            if (isFirebaseError(error)) {
                setErrors({ general: error.message });
            } else if (error instanceof Error) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: "An unknown error occurred during registration." });
            }
        }
    };

    return (
        <div className="form">
            <h1>Register</h1>
            {errors.general && <p className="error" role="alert">{errors.general}</p>}
            <form onSubmit={handleSubmit} aria-labelledby="register-form-title">
                <fieldset>
                    <legend id="register-form-title">Register</legend>
                    <div>
                        <label htmlFor="email-input" className="sr-only">Email</label>
                        <input
                            id="email-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && <p id="email-error" className="error" role="alert">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="name-input" className="sr-only">Name</label>
                        <input
                            id="name-input"
                            type="text"
                            placeholder="Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            aria-invalid={!!errors.displayName}
                            aria-describedby={errors.displayName ? "name-error" : undefined}
                        />
                        {errors.displayName && <p id="name-error" className="error" role="alert">{errors.displayName}</p>}
                    </div>
                    <div>
                        <label htmlFor="password-input" className="sr-only">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        {errors.password && <p id="password-error" className="error" role="alert">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirm-password-input" className="sr-only">Confirm Password</label>
                        <input
                            id="confirm-password-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            aria-invalid={!!errors.confirmPassword}
                            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                        />
                        {errors.confirmPassword && <p id="confirm-password-error" className="error" role="alert">{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit">Register</button>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;