export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  address?: string;
}

export interface Order {
  id?: string;
  userId: string;
  createdAt: any; // Firestore Timestamp
  items: CartItem[];
  totalPrice: number;
}
