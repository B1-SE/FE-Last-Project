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

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: () => (category ? getProductsByCategory(category) : getProducts()),
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) return <div>Loading...</div>;

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