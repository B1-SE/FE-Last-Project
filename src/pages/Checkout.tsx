import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from '../auth/AuthContext';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import { CartItem } from '../types/types';
import '../styles/Checkout.css';

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    setIsProcessing(true);
    setCheckoutMessage('');

    const order = {
      userId: user.uid,
      createdAt: serverTimestamp(),
      items: cartItems,
      totalPrice: totalPrice,
    };

    try {
      await addDoc(collection(db, 'orders'), order);

      // Clear cart
      dispatch(clearCart());
      sessionStorage.removeItem('cart');

      setCheckoutMessage('Thank you for your order! Your purchase is complete.');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      setCheckoutMessage('There was an error placing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout Summary</h2>
      {cartItems.length === 0 && !checkoutMessage ? (
        <p>Your cart is empty. Nothing to check out.</p>
      ) : (
        <>
          <div className="order-summary">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="summary-item">
                <span>{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total:</strong>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={isProcessing || cartItems.length === 0}>
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </button>
          {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}
        </>
      )}
    </div>
  );
};