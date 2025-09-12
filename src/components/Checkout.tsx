import React, { useCallback, useMemo } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
  import { useNavigate } from 'react-router-dom';
  import { createOrder } from '../lib/firebase/firestore';
  import { auth } from '../lib/firebase/config';
  import type { CartItem } from '../types/types';
  import type { RootState, AppDispatch } from '../redux/store';
  import styles from '../styles/Checkout.module.css';

  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });


const Checkout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart?.items ?? []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleQuantityChange = useCallback((id: string, nextQty: number) => {
    if (Number.isNaN(nextQty)) return;
    if (nextQty < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: nextQty }));
    }
  }, [dispatch]);

  const handleRemove = useCallback((id: string) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleCheckout = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in to place your order.');
      navigate('/login');
      return;
    }
    try {
      await createOrder(user.uid, items as CartItem[]);
      dispatch(clearCart());
      alert('Order placed successfully. Your cart has been cleared.');
      navigate('/');
    } catch (e) {
      alert('Failed to place order. Please try again.');
    }
  }, [dispatch, items, navigate]);

  if (!items.length) {
    return (
      <div className={styles.checkoutContainer}>
        <h1 className={styles.checkoutTitle}>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.checkoutTitle}>Checkout</h1>
      <section className={styles.itemsList}>
        {items.map((item) => (
          <article key={item.id} className={styles.itemArticle}>
            <img
              src={item.image}
              alt={item.title}
              width={70}
              height={70}
              className={styles.itemImage}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/70';
              }}
            />
            <div className={styles.itemDetails}>
              <strong>{item.title}</strong>
              <span className={styles.itemPriceEach}>{currency.format(item.price)} each</span>
              <div className={styles.itemControls}>
                <label htmlFor={`qty-${item.id}`}>Qty:</label>
                <input
                  id={`qty-${item.id}`}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    handleQuantityChange(item.id, Number.isNaN(next) ? item.quantity : next);
                  }}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className={styles.itemLineTotal}>{currency.format(item.price * item.quantity)}</div>
          </article>
        ))}
      </section>
      <section className={styles.summarySection}>
        <div className={styles.summaryRow}>
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>{currency.format(subtotal)}</span>
        </div>
      </section>
      <div className={styles.actionButtons}>
        <button onClick={handleClear} type="button">Clear Cart</button>
        <button onClick={handleCheckout}>Place Order</button>
      </div>
    </div>
  );
};

  export default Checkout;