import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders, getOrderById } from '../firebase/firestore';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';
import styles from './Orders.module.css';
import { Order, CartItem } from '../types/types';

const Orders: React.FC = () => {
  const userId = auth.currentUser?.uid;

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders', userId],
    queryFn: () => getUserOrders(userId || ''),
    enabled: !!userId,
  });

  return (
    <div className={styles.orders}>
      <h2>Order History</h2>
      {orders.map(order => (
        <div key={order.id} className={styles.order}>
          <p>Order ID: {order.id}</p>
          <p>Date: {order.date.toLocaleDateString()}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <Link to={`/order/${order.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default Orders;

// Separate component for order details (can be in a new file, but inline for brevity)
export const OrderDetails: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { data: order } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
  });

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details: {order.id}</h2>
      <p>Date: {order.date.toLocaleDateString()}</p>
      <p>Total: ${order.total.toFixed(2)}</p>
      <ul>
        {order.products.map((item: CartItem) => (
          <li key={item.id}>
            {item.title} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};