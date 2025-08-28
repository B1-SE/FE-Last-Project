import React, { useState } from 'react';
import { addProduct, updateProduct } from '../firebase/firestore';
import { Product } from '../types/types';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  product?: Product;  // For edit mode
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [category, setCategory] = useState(product?.category || '');
  const [description, setDescription] = useState(product?.description || '');
  const [image, setImage] = useState(product?.image || '');
  const [rating, setRating] = useState(product?.rating || { rate: 0, count: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, price, category, description, image, rating };
    if (product) {
      await updateProduct(product.id, data);
    } else {
      await addProduct(data);
    }
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Price" required />
      <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="Image URL" required />
      <input type="number" value={rating.rate} onChange={e => setRating({ ...rating, rate: parseFloat(e.target.value) })} placeholder="Rating Rate" required />
      <input type="number" value={rating.count} onChange={e => setRating({ ...rating, count: parseInt(e.target.value) })} placeholder="Rating Count" required />
      <button type="submit">{product ? 'Update' : 'Add'} Product</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default ProductForm;