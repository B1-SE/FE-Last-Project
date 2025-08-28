import Home from './components/Home';
import Profile from './components/auth/Profile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import Navbar from './components/Navbar';
import ShoppingCart from "./components/ShoppingCart";
import OrderHistory from "./components/OrderHistory";
import ProductManagement from "./components/ProductManagement";
import Notification from "./components/Notification";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Navbar />
        <Notification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/admin/products" element={<ProductManagement />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;