import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategory, getCategories } from '../lib/firebase/firestore';
import ProductItem from '../components/ProductItem';
import styles from '../styles/Home.module.css';
import { Product } from '../types/types';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories, isLoading: isLoadingCategories } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => (selectedCategory === 'all' ? getProducts() : getProductsByCategory(selectedCategory)),
    enabled: !!categories, // Only fetch products after categories are loaded
  });

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Products</h1>

      <div className={styles.filters}>
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={isLoadingCategories}
        >
          <option value="all">All Categories</option>
          {categories?.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <div className={styles.productGrid}>
          {products?.map(product => (
            <div key={product.id} className={styles.productCard}>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};