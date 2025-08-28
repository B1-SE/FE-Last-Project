import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { Product, Order, CartItem } from '../types/types';

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const getCategories = async (): Promise<string[]> => {
  const products = await getProducts();
  const categories = [...new Set(products.map(p => p.category))];
  return categories;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(collection(db, 'products'), where('category', '==', category));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return { id: docRef.id, ...product };
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  await updateDoc(doc(db, 'products', id), data);
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

export const createOrder = async (userId: string, cartItems: CartItem[]): Promise<Order> => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    userId,
    products: cartItems,
    total,
    date: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, 'orders'), order);
  return { id: docRef.id, ...order, date: order.date.toDate() };
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => {
    const data = d.data();
    return { id: d.id, ...data, date: data.date.toDate() } as Order;
  });
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const orderDoc = await getDoc(doc(db, 'orders', orderId));
  if (!orderDoc.exists()) return null;
  const data = orderDoc.data();
  return { id: orderDoc.id, ...data, date: data.date.toDate() } as Order;
};