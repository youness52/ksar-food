export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  categories: string[];
  menu: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
  total: number;
  date: Date;
  estimatedDeliveryTime: string;
}