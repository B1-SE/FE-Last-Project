import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '../lib/firebase/firestore';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { Order } from '../types/types';
import styles from '../styles/Orders.module.css';

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

export const Orders: React.FC = () => {
  const { user } = useAuth();

  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', user?.uid],
    queryFn: () => getUserOrders(user!.uid),
    enabled: !!user,
  });

  if (!user) return <p>Please log in to see your order history.</p>;
  if (isLoading) return <p>Loading your orders...</p>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Order History</h1>
      {orders && orders.length > 0 ? (
        <div className={styles.ordersGrid}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderCardMeta}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                <p><strong>Total:</strong> {currency.format(order.totalPrice)}</p>
              </div>
              <div className={styles.orderCardActions}>
                <Link to={`/order/${order.id}`} className={styles.viewDetailsLink}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not placed any orders yet.</p>
      )}
    </div>
  );
};