import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../types/types';
import styles from '../styles/ProductManagement.module.css';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../lib/firebase/firestore';
import ImageWithFallback from '../components/ImageWithFallback';

const emptyProduct: Omit<Product, 'id'> = {
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
  rating: { rate: 0, count: 0 },
};

export const ProductManagement: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProduct);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        price: editingProduct.price,
        description: editingProduct.description,
        category: editingProduct.category,
        image: editingProduct.image,
        rating: editingProduct.rating,
      });
    } else {
      setFormData(emptyProduct);
    }
  }, [editingProduct]);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      setFormData(emptyProduct);
    },
  };

  const createMutation = useMutation({ mutationFn: createProduct, ...mutationOptions });
  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; product: Partial<Product> }) => updateProduct(vars.id, vars.product),
    ...mutationOptions,
  });
  const deleteMutation = useMutation({ mutationFn: deleteProduct, ...mutationOptions });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'rate' || name === 'count') {
      setFormData(prev => ({ ...prev, rating: { ...prev.rating, [name]: parseFloat(value) } }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, product: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (isLoading) return <p>Loading products...</p>;

  return (
    <div className={styles.productManagementContainer}>
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className={styles.productForm}>
        <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
        <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Price" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
        <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" required />
        <input name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" required />
        <input name="rate" type="number" value={formData.rating.rate} onChange={handleInputChange} placeholder="Rating (Rate)" step="0.1" required />
        <input name="count" type="number" value={formData.rating.count} onChange={handleInputChange} placeholder="Rating (Count)" required />
        <button type="submit" disabled={isMutating}>
          {isMutating ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && <button type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <h2>Existing Products</h2>
      <div className={styles.productsList}>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    width="50"
                    fallbackSrc="https://via.placeholder.com/200"
                  />
                </td>
                <td>{product.title}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => handleEdit(product)} disabled={isMutating}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} disabled={isMutating}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};