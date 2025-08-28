import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct, fetchProducts } from "../api/api";
import type { Product } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

const ProductManagement = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        price: 0,
        description: "",
        category: "",
        image: ""
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setFormData({ title: "", price: 0, description: "", category: "", image: "" });
        },
        onError: (error) => {
            alert("Failed to create product: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) => updateProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setEditingProduct(null);
            setFormData({ title: "", price: 0, description: "", category: "", image: "" });
        },
        onError: (error) => {
            alert("Failed to update product: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            alert("Failed to delete product: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, product: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    if (!user || !user.email?.includes('admin')) {
        return <div className="app-container">Access denied. Admin only.</div>;
    }

    if (isLoading) {
        return <div className="app-container">Loading...</div>;
    }

    if (error) {
        return <div className="app-container">Error: {(error as Error).message}</div>;
    }

    return (
        <div className="app-container">
            <h1>Product Management</h1>
            <form onSubmit={handleSubmit} aria-labelledby="product-form-title">
                <fieldset>
                    <legend id="product-form-title">{editingProduct ? "Edit Product" : "Add Product"}</legend>
                    <div>
                        <label htmlFor="title-input" className="sr-only">Title</label>
                        <input
                            id="title-input"
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="price-input" className="sr-only">Price</label>
                        <input
                            id="price-input"
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="description-input" className="sr-only">Description</label>
                        <input
                            id="description-input"
                            type="text"
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="category-input" className="sr-only">Category</label>
                        <input
                            id="category-input"
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="image-input" className="sr-only">Image URL</label>
                        <input
                            id="image-input"
                            type="text"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">{editingProduct ? "Update" : "Add"} Product</button>
                        {editingProduct && (
                            <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                        )}
                    </div>
                </fieldset>
            </form>
            <h2>Products</h2>
            <div className="product-grid">
                {products?.data.map((product: Product) => (
                    <div key={product.id} className="product-card">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="product-image"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/200";
                            }}
                        />
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <p>Price: ${product.price.toFixed(2)}</p>
                            <p>Category: {product.category}</p>
                            <div className="modal-buttons">
                                <button
                                    className="product-button"
                                    onClick={() => {
                                        setEditingProduct(product);
                                        setFormData({
                                            title: product.title,
                                            price: product.price,
                                            description: product.description,
                                            category: product.category,
                                            image: product.image
                                        });
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="product-button"
                                    onClick={() => deleteMutation.mutate(product.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;