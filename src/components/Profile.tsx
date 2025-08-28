import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { getUserProfile, updateUserProfile, deleteUserAccount, logoutUser } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      getUserProfile(auth.currentUser.uid).then(user => {
        if (user) {
          setName(user.name || '');
          setAddress(user.address || '');
        }
      });
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      await updateUserProfile(auth.currentUser.uid, { name, address });
      alert('Profile updated');
    }
  };

  const handleDelete = async () => {
    if (auth.currentUser && confirm('Delete account?')) {
      await deleteUserAccount(auth.currentUser.uid);
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className={styles.profile}>
      <form onSubmit={handleUpdate}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Profile;