import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name || '', // Ensure name is not undefined, just in case.
        address: '',
        createdAt: serverTimestamp(),
      });

      toast.success('Registration successful! Welcome!');
      navigate('/profile');
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email address is already in use.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. It must be at least 6 characters long.');
            break;
          default:
            setError('Failed to register. Please try again.');
            console.error('Registration error:', err);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected registration error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
        {error && <p className="auth-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};