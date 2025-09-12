import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductsByCategory, getCategories } from '../lib/firebase/firestore';
import CategorySelect from './CategorySelect';
import ProductItem from './ProductItem';
import { Product } from '../types/types';
import styles from './ProductList.module.css';
import homeStyles from '../pages/Home.module.css';

const ProductList: React.FC = () => {
  const [category, setCategory] = useState<string>('');

  const { data: products = [], isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: () => (category ? getProductsByCategory(category) : getProducts()),
  });

  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading || isCategoriesLoading) return <div>Loading products...</div>;
  if (isError) return <div style={{color: 'red'}}>Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  if (isCategoriesError) return <div style={{color: 'red'}}>Error loading categories: {categoriesError instanceof Error ? categoriesError.message : 'Unknown error'}</div>;

  return (
    <div className={styles.productList}>
      <CategorySelect onChange={setCategory} categories={categories} />
      <div className={homeStyles.productGrid}>
        {products.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;