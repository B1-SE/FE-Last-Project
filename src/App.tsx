import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import ProductList from './components/ProductList';
import CategorySelect from './components/CategorySelect';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProductForm from './components/Productform';
import Orders, { OrderDetails } from './components/Orders';
import { deleteProduct } from './firebase/firestore';
import { getProducts } from './firebase/firestore';  // For product management
import { useQuery } from '@tanstack/react-query';
import styles from './App.module.css';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [category, setCategory] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const handleCategoryChange = (cat: string) => setCategory(cat);

  const handleAddProduct = () => {
    setEditProduct(undefined);
    setShowProductForm(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditProduct(prod);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete product?')) {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <nav className={styles.nav}>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            {user ? (
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            {user && <button onClick={handleAddProduct}>Add Product</button>}
          </nav>
          <Routes>
            <Route path="/" element={
              <>
                <CategorySelect onCategoryChange={handleCategoryChange} />
                <ProductList category={category} />
                {user && (
                  <div className={styles.admin}>
                    <h3>Manage Products</h3>
                    {products.map(prod => (
                      <div key={prod.id}>
                        {prod.title}
                        <button onClick={() => handleEditProduct(prod)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:orderId" element={<OrderDetails orderId={useParams().orderId || ''} />} /> {/* Note: useParams from react-router-dom */}
          </Routes>
          {showProductForm && (
            <div className={styles.modal}>
              <ProductForm product={editProduct} onClose={() => setShowProductForm(false)} />
            </div>
          )}
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;