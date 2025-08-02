
export type ProductCategory = 'burger' | 'pizza' | 'churrasco' | 'steak' | 'drink' | 'dessert' | 'snack' | 'combo';

export interface Ingredient {
  id: string;
  productId: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  available: boolean;
  ingredients?: Ingredient[];
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  removedIngredients?: string[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}
