import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '../lib/firebase/firestore';
import { auth } from '../lib/firebase/config';
import { Link } from 'react-router-dom';
import { Order } from '../types/types';

const OrderHistory: React.FC = () => {
  const userId = auth.currentUser?.uid;

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', userId],
    queryFn: () => getUserOrders(userId || ''),
    enabled: !!userId,
  });

  if (!userId) return <div className="orders orders--status">Please sign in to view your order history</div>;
  if (isLoading) return <div className="orders orders--status">Loading...</div>;
  if (error) return <div className="orders orders--status">Error: {(error as Error).message}</div>;

  return (
    <div className="orders">
      <h2 className="orders__title">Order History</h2>
      {orders.length === 0 ? (
        <p className="orders__empty">No orders found</p>
      ) : (
        <div className="orders__grid">
          {orders.map((order) => (
            <div key={order.id} className="order">
              <div className="order__meta">
                <p className="order__id"><span>Order ID:</span> {order.id}</p>
                <p className="order__date">
                  <span>Date:</span>{' '}
                  {/* Correctly access 'createdAt' and use .toDate() for Firestore Timestamps */}
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleDateString()
                    : 'N/A'}
                </p>
                {/* Use 'totalPrice' as defined in the Order type */}
                <p className="order__total"><span>Total:</span> ${order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="order__actions">
                {/* Ensure the link matches the route defined in App.tsx */}
                <Link className="order__link" to={`/orders/${order.id}`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;