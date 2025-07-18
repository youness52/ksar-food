export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          image: string;
          rating: number;
          delivery_time: string;
          delivery_fee: number;
          categories: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image: string;
          rating: number;
          delivery_time: string;
          delivery_fee: number;
          categories: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image?: string;
          rating?: number;
          delivery_time?: string;
          delivery_fee?: number;
          categories?: string[];
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          restaurant_name: string;
          status: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
          total: number;
          delivery_fee: number;
          estimated_delivery_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          restaurant_id: string;
          restaurant_name: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
          total: number;
          delivery_fee: number;
          estimated_delivery_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          restaurant_id?: string;
          restaurant_name?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'on-the-way' | 'delivered';
          total?: number;
          delivery_fee?: number;
          estimated_delivery_time?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          menu_item_name: string;
          menu_item_price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          menu_item_name: string;
          menu_item_price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          menu_item_name?: string;
          menu_item_price?: number;
          quantity?: number;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          menu_item_id: string;
          restaurant_id: string;
          restaurant_name: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          menu_item_id: string;
          restaurant_id: string;
          restaurant_name: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          menu_item_id?: string;
          restaurant_id?: string;
          restaurant_name?: string;
          quantity?: number;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar?: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string;
          role?: 'user' | 'admin';
          updated_at?: string;
        };
      };
    };
  };
}