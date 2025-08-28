import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  clearCart,
  removeFromCart,
  removeQuantityFromCart,
  type CartItem,
} from "../redux/cartSlice";
import { setNotification } from "../redux/NotificationSlice";
import { createOrder } from "../api/api";
import "../App.css";
import { useAuth } from "../hooks/useAuth";

const ShoppingCart = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const cartItems = useAppSelector((state) => state.cart.items);

  const { totalItems, totalPrice } = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 },
    );
  }, [cartItems]);

  const handleCheckout = async () => {
    if (!user) {
      dispatch(
        setNotification({ message: "Please log in to checkout.", type: "error" }),
      );
      return;
    }
    try {
      await createOrder({ userId: user.uid, items: cartItems, totalPrice });
      dispatch(clearCart());
      dispatch(
        setNotification({
          message: "Checkout successful! Order placed.",
          type: "success",
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      dispatch(
        setNotification({
          message: `Failed to place order: ${errorMessage}`,
          type: "error",
        }),
      );
    }
  };

  return (
    <div className="app-container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="product-grid">
            {cartItems.map((item: CartItem) => (
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
                  <p className="product-price">${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <div className="modal-buttons">
                    <button
                      className="product-button"
                      onClick={() =>
                        dispatch(
                          removeQuantityFromCart({ id: item.id, quantity: 1 }),
                        )
                      }
                    >
                      -1
                    </button>
                    <button
                      className="product-button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove All
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-buttons">
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button className="product-button" onClick={handleCheckout}>
              Checkout
            </button>
            <button
              className="product-button"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;