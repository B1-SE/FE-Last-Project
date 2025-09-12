import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../lib/firebase/firestore';
import { Order, CartItem } from '../types/types';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading, error } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId || ''),
    enabled: !!orderId, // Only run the query if orderId exists
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h2>Order Details: {order.id}</h2>
      <p>
        Date:{' '}
        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Date not available'}
      </p>
      <p>Total: ${order.totalPrice.toFixed(2)}</p>
      <ul>
        {order.items.map((item: CartItem) => (
          <li key={item.id}>
            {item.title} - Quantity: {item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;