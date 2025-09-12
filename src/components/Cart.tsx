
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { CartItem } from '../types/types';

import styles from '../styles/Cart.module.css';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <div className={`${styles.cart} ${styles['cart-centered']}`}> 
      <h2 className={styles['cart-title']}>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className={styles['cart-empty']}>Your cart is empty.</p>
      ) : (
        <ul className={styles.cartItems}>
          {cartItems.map(item => (
            <li key={item.id} className={styles.cartItem}>
              <img className={styles.cartItemImage} src={item.image} alt={item.title} width={70} height={70} />
              <span className={styles.cartItemTitle}>{item.title}</span>
              <span className={styles.cartItemPrice}>${item.price.toFixed(2)}</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                className={styles.cartItemInput}
              />
              <button className={styles.cartRemoveButton} onClick={() => handleRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.cartSummary}>
        <div>Total Items: <span>{totalItems}</span></div>
        <div>Total Price: <span>${totalPrice.toFixed(2)}</span></div>
      </div>
      {cartItems.length > 0 && (
        <>
          <button
            className={styles.cartCheckoutButton}
            onClick={() => {
              if (!user) {
                setShowSignInPrompt(true);
              } else {
                // navigate to checkout or continue as normal
                window.location.href = '/checkout';
              }
            }}
          >
            Proceed to Checkout
          </button>
          {showSignInPrompt && (
            <div style={{ color: '#ef4444', marginTop: '1rem', fontWeight: 500, fontSize: '1.1rem', background: '#fff3f3', padding: '1rem', borderRadius: 8, border: '1px solid #ef4444' }}>
              Please sign in before you can check out.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
