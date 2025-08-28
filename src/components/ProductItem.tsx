import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Product } from '../types/types';
import styles from './ProductItem.module.css';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/150';
  };

  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.title} onError={handleImageError} className={styles.image} />
      <h3>{product.title}</h3>
      <p>${product.price.toFixed(2)}</p>
      <p>Category: {product.category}</p>
      <p>{product.description}</p>
      <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductItem;