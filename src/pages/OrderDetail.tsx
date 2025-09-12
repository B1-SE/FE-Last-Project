import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../lib/firebase/firestore';
import { Order } from '../types/types';
import styles from '../styles/OrderDetail.module.css';

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, error } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) return <p>Loading order details...</p>;
  if (error) return <p>Error loading order: {error.message}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className={styles.orderDetailContainer}>
      <h1>Order Details</h1>
      <div className={styles.orderMeta}>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
        <p><strong>Total:</strong> {currency.format(order.totalPrice)}</p>
      </div>

      <h2>Items in this Order</h2>
      <div className={styles.itemsGrid}>
        {order.items.map(item => (
          <div key={item.id} className={styles.itemCard}>
            <img 
              src={item.image} 
              alt={item.title} 
              className={styles.itemImage}
              onError={(e) => { e.currentTarget.src = 'https://placeholder.com/100'; }}
            />
            <div className={styles.itemInfo}>
              <h3>{item.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price per item: {currency.format(item.price)}</p>
              <p><strong>Subtotal: {currency.format(item.price * item.quantity)}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};