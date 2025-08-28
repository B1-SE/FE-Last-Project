import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategory } from '../firebase/firestore';
import ProductItem from './ProductItem';
import styles from './ProductList.module.css';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const queryKey = category ? ['products', category] : ['products'];
  const queryFn = category ? () => getProductsByCategory(category) : getProducts;

  const { data: products = [], isLoading } = useQuery({
    queryKey,
    queryFn,
  });

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className={styles.list}>
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;