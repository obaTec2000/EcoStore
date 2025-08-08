

export interface Category {
  url: string;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  description: string;
  category: Category;
  images: string[];
  rating: {
    rate: number;
    count: number;
  };
  quantity?: number; // Optional for cart management
    timestamp?: number; // Optional for tracking when the product was added to the cart
}