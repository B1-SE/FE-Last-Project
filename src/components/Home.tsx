// src/components/Home.tsx (modified for category-specific fetch)
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts, fetchCategoriesProducts } from "../api/api";
import { useState, useEffect } from "react";
import type { Product } from "../types/types";
import ProductCard from "./ProductCard";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedCategory("");
    }
  }, [location]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      selectedCategory
        ? fetchCategoriesProducts(selectedCategory)
        : fetchProducts(),
  });

  return (
    <div className="app-container">
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">All Categories</option>
        {categories?.data.map((category: string) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Link to="/cart" className="product-button">
        Cart
      </Link>
      <div className="product-grid">
        {products?.data?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;