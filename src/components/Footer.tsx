import React from 'react';
import '../styles/Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} World Class E-Commerce. All rights reserved.</p>
    </footer>
  );
};