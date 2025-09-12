import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../auth/AuthContext';
import Logout from './Logout';
import { RootState } from '../redux/store';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={closeMenu} end>
        Home
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={closeMenu}>
        <div className={styles.cartLink}>
          Cart
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </div>
      </NavLink>
      {currentUser ? (
        <>
          <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={closeMenu}>
            Profile
          </NavLink>
          <Logout className={styles.navLink} />
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={closeMenu}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink} onClick={closeMenu}>
            Register
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        eCommerce
      </Link>
      <nav className={styles.desktopNavLinks}>
        {navLinks}
      </nav>
      <button className={styles.menuIcon} onClick={toggleMenu} aria-label="Toggle menu">
        <div />
        <div />
        <div />
      </button>
      {isMenuOpen && (
        <nav className={styles.mobileNavLinks}>
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Navbar;