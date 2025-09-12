import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './src/components/Navbar';
import { Home } from './src/pages/Home';
import Cart from './src/components/Cart';
import Login from './src/pages/Login';
import { Register } from './src/pages/Register';
import { Profile } from './src/pages/Profile';
import { Orders } from './src/pages/Orders';
import { OrderDetail } from './src/pages/OrderDetail';
import Checkout from './src/components/Checkout';
import { ProductManagement } from './src/pages/ProductManagement';
import { Footer } from './src/components/Footer';
import { AuthProvider } from './src/auth/AuthContext';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { setCartFromStorage } from './src/redux/cartSlice';
import { CartItem } from './src/types/types';
import './src/styles/App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      const { items } = JSON.parse(savedCart) as { items: CartItem[] };
      dispatch(setCartFromStorage(items));
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <ToastContainer />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute><Orders /></ProtectedRoute>}
            />
            <Route
              path="/orders/:orderId"
              element={<ProtectedRoute><OrderDetail /></ProtectedRoute>}
            />
            <Route
              path="/checkout"
              element={<ProtectedRoute><Checkout /></ProtectedRoute>}
            />
            <Route path="/manage-products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;