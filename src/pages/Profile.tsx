import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../lib/firebase/config';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from '../styles/Profile.module.css';

interface UserProfile {
  name: string;
  address: string;
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({ name: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, profile, { merge: true });
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error('Failed to update profile.');
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (user && window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const password = prompt('Please enter your password to confirm.');
      if (password) {
        try {
          const credential = EmailAuthProvider.credential(user.email!, password);
          await reauthenticateWithCredential(user, credential);
          
          // Delete user document from Firestore
          await deleteDoc(doc(db, 'users', user.uid));
          
          // Delete user from Firebase Auth
          await deleteUser(user);
          
          toast.success('Account deleted successfully.');
          navigate('/');
        } catch (error) {
          toast.error('Failed to delete account. You may need to re-authenticate.');
          console.error('Error deleting account:', error);
        }
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className={styles.profileContainer}>
      <h2>User Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <form onSubmit={handleUpdate} className={styles.profileForm}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={profile.address}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <hr />
      <div>
        <h3>Delete Account</h3>
        <p>This will permanently delete your account and all associated data.</p>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete My Account
        </button>
      </div>
    </div>
  );
};