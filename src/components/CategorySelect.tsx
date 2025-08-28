import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../firebase/firestore';
import styles from './CategorySelect.module.css';

interface CategorySelectProps {
  onCategoryChange: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category === 'all' ? '' : category);
  };

  return (
    <select className={styles.select} value={selectedCategory} onChange={handleChange}>
      <option value="all">All Categories</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
};

export default CategorySelect;