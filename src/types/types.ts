export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  products: CartItem[];
  total: number;
  date: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
}