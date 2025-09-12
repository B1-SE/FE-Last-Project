//src/firebase/firestore.ts//
import { collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, QuerySnapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Order, CartItem, Product } from '../../types/types';

export const createProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), product);
    return { id: docRef.id, ...product };
  } catch (error: any) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    await setDoc(doc(db, 'products', id), product, { merge: true });
  } catch (error: any) {
    console.error(`Error in updateProduct for id "${id}":`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error: any) {
    console.error(`Error in deleteProduct for id "${id}":`, error);
    throw error;
  }
};

export const createOrder = async (userId: string, items: CartItem[]): Promise<Order> => {
  try {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderRef = await addDoc(collection(db, 'orders'), {
      userId,
      items, // Use 'items' to match Order type
      totalPrice, // Use 'totalPrice' to match Order type
      createdAt: serverTimestamp(), // Use 'createdAt' and serverTimestamp for consistency
    });
    return { id: orderRef.id, userId, items, totalPrice, createdAt: new Date() };
  } catch (error: any) {
    console.error(`Error in createOrder for userId "${userId}":`, error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
      // No need to manually convert date if using serverTimestamp correctly
    } as Order));
  } catch (error: any) {
    console.error(`Error fetching orders for userId "${userId}":`, error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap: DocumentSnapshot = await getDoc(orderRef);
    if (!orderSnap.exists()) return null;
    return {
      id: orderSnap.id,
      ...orderSnap.data(),
      // No need to manually convert date if using serverTimestamp correctly
    } as Order;
  } catch (error: any) {
    console.error(`Error fetching order by id "${orderId}":`, error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: DocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    } as Product));
  } catch (error: any) {
    console.error(`Error fetching products for category "${category}":`, error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, 'products'));
    const categories = new Set<string>();
    querySnapshot.forEach((doc: DocumentSnapshot) => categories.add(doc.data()?.category));
    return Array.from(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};