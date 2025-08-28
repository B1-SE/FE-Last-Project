import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import type { Product, Order } from "../types/types";

export const fetchProducts = async () => {
    try {
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return { data: products };
    } catch (error) {
        throw new Error("Failed to fetch products: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const fetchCategories = async () => {
    try {
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);
        const categories = [...new Set(snapshot.docs.map(doc => doc.data().category))];
        return { data: categories };
    } catch (error) {
        throw new Error("Failed to fetch categories: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const fetchCategoriesProducts = async (category: string) => {
    try {
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, where("category", "==", category));
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return { data: products };
    } catch (error) {
        throw new Error("Failed to fetch category products: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const createProduct = async (product: Omit<Product, "id" | "rating">) => {
    try {
        const productsCollection = collection(db, "products");
        const docRef = await addDoc(productsCollection, {
            ...product,
            rating: { rate: 0, count: 0 }
        });
        return { id: docRef.id, ...product, rating: { rate: 0, count: 0 } };
    } catch (error) {
        throw new Error("Failed to create product: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
        const productDoc = doc(db, "products", id);
        await updateDoc(productDoc, product);
        return { id, ...product };
    } catch (error) {
        throw new Error("Failed to update product: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        return { id };
    } catch (error) {
        throw new Error("Failed to delete product: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const createOrder = async (order: Omit<Order, "id" | "createdAt">) => {
    try {
        const ordersCollection = collection(db, "orders");
        const docRef = await addDoc(ordersCollection, {
            ...order,
            createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...order, createdAt: new Date().toISOString() };
    } catch (error) {
        throw new Error("Failed to create order: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};

export const fetchUserOrders = async (userId: string) => {
    try {
        const ordersCollection = collection(db, "orders");
        const q = query(ordersCollection, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        return { data: orders };
    } catch (error) {
        throw new Error("Failed to fetch user orders: " + (error instanceof Error ? error.message : "Unknown error"));
    }
};