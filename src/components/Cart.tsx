import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { createOrder } from '../firebase/firestore';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = async () => {
    if (auth.currentUser) {
      await createOrder(auth.currentUser.uid, items);
      dispatch(clearCart());
      alert('Checkout successful! Your order has been placed.');
      navigate('/orders');
    } else {
      alert('Please login to checkout.');
    }
  };

  return (
    <div className={styles.cart}>
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div key={item.id} className={styles.item}>
          <img src={item.image} alt={item.title} className={styles.image} />
          <h3>{item.title}</h3>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Quantity: <input type="number" value={item.quantity} onChange={e => handleUpdateQuantity(item.id, parseInt(e.target.value))} /></p>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Cart;