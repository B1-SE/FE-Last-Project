import { useState } from 'react';
import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import styles from './ProductForm.module.css';
import { Product } from '../types/types';

const ProductForm = () => {
  const [product, setProduct] = useState<Omit<Product, 'id' | 'rating'>>({
    title: '',
    price: 0,
    category: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        rating: { rate: 0, count: 0 },
      });
      setProduct({ title: '', price: 0, category: '', description: '', image: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
    }
  };

  return (
    <form className={styles.productForm} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        placeholder="Title"
      />
      <input
        className={styles.input}
        type="number"
        value={product.price}
        onChange={(e) =>
          setProduct({
            ...product,
            price: e.target.value === '' ? 0 : parseFloat(e.target.value),
          })
        }
        placeholder="Price"
      />
      <input
        className={styles.input}
        type="text"
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        placeholder="Category"
      />
      <input
        className={styles.input}
        type="text"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Description"
      />
      <input
        className={styles.input}
        type="text"
        value={product.image}
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
        placeholder="Image URL"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className={styles.button} type="submit">
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;