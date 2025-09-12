import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../lib/firebase/config';
import styles from './Logout.module.css';

interface LogoutProps {
  className?: string;
}

const Logout: React.FC<LogoutProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('You have been logged out.');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <button onClick={handleLogout} className={`${styles.logoutButton} ${className || ''}`}>
      Logout
    </button>
  );
};

export default Logout;