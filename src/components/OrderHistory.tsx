import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { fetchUserOrders } from "../api/api";
import type { Order } from "../types/types";
import "../App.css";

const OrderHistory = () => {
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['userOrders', user?.uid],
        queryFn: () => fetchUserOrders(user!.uid),
        enabled: !!user
    });

    if (!user) {
        return <div className="app-container">Please log in to view order history.</div>;
    }

    if (isLoading) {
        return <div className="app-container">Loading...</div>;
    }

    if (error) {
        return <div className="app-container">Error loading orders: {(error as Error).message}</div>;
    }

    return (
        <div className="app-container">
            <h1>Order History</h1>
            {orders?.data.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div>
                    <ul>
                        {orders?.data.map((order: Order) => (
                            <li key={order.id}>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="product-button"
                                >
                                    Order {order.id} - {new Date(order.createdAt).toLocaleDateString()} - ${order.totalPrice.toFixed(2)}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {selectedOrder && (
                        <div className="modal">
                            <h2>Order Details: {selectedOrder.id}</h2>
                            <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            <p>Total Price: ${selectedOrder.totalPrice.toFixed(2)}</p>
                            <h3>Items:</h3>
                            <div className="product-grid">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="product-card">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="product-image"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/200";
                                            }}
                                        />
                                        <div className="product-info">
                                            <h3 className="product-title">{item.title}</h3>
                                            <p>Price: ${item.price.toFixed(2)}</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="product-button"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;