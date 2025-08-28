export interface Product {
    id: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export interface Order {
    id: string;
    userId: string;
    items: Array<Product & { quantity: number }>;
    totalPrice: number;
    createdAt: string;
}

export type Category = string;