-- Create restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  delivery_time TEXT NOT NULL,
  delivery_fee DECIMAL(5,2) NOT NULL,
  categories TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  restaurant_id UUID REFERENCES restaurants(id),
  restaurant_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'on-the-way', 'delivered')),
  total DECIMAL(8,2) NOT NULL,
  delivery_fee DECIMAL(5,2) NOT NULL,
  estimated_delivery_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL,
  menu_item_name TEXT NOT NULL,
  menu_item_price DECIMAL(6,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO categories (name, image) VALUES
('Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop'),
('Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop'),
('Sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=300&auto=format&fit=crop'),
('Pasta', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=300&auto=format&fit=crop'),
('Desserts', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=300&auto=format&fit=crop'),
('Healthy', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop');

-- Insert sample restaurants
INSERT INTO restaurants (id, name, image, rating, delivery_time, delivery_fee, categories) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Pizza Paradise', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop', 4.7, '25-35 min', 2.99, ARRAY['Pizza', 'Italian']),
('550e8400-e29b-41d4-a716-446655440002', 'Burger King', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=600&auto=format&fit=crop', 4.5, '15-25 min', 1.99, ARRAY['Burgers', 'Fast Food']),
('550e8400-e29b-41d4-a716-446655440003', 'Sushi Master', 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop', 4.8, '30-40 min', 3.99, ARRAY['Sushi', 'Japanese']),
('550e8400-e29b-41d4-a716-446655440004', 'Taco Fiesta', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=600&auto=format&fit=crop', 4.6, '20-30 min', 2.49, ARRAY['Mexican', 'Tacos']);

-- Insert sample menu items for Pizza Paradise
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 12.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', 'Pizza'),
('550e8400-e29b-41d4-a716-446655440001', 'Pepperoni Pizza', 'Pizza topped with pepperoni slices and cheese', 14.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=300&auto=format&fit=crop', 'Pizza'),
('550e8400-e29b-41d4-a716-446655440001', 'Garlic Bread', 'Freshly baked bread with garlic butter', 5.99, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=300&auto=format&fit=crop', 'Sides'),
('550e8400-e29b-41d4-a716-446655440001', 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 8.99, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=300&auto=format&fit=crop', 'Salads');

-- Insert sample menu items for Burger King
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Classic Cheeseburger', 'Beef patty with cheese, lettuce, tomato, and special sauce', 9.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop', 'Burgers'),
('550e8400-e29b-41d4-a716-446655440002', 'Bacon Burger', 'Beef patty with bacon, cheese, and BBQ sauce', 12.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=300&auto=format&fit=crop', 'Burgers'),
('550e8400-e29b-41d4-a716-446655440002', 'French Fries', 'Crispy golden fries with sea salt', 4.99, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=300&auto=format&fit=crop', 'Sides'),
('550e8400-e29b-41d4-a716-446655440002', 'Chocolate Milkshake', 'Creamy chocolate milkshake topped with whipped cream', 5.99, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=300&auto=format&fit=crop', 'Drinks');

-- Insert sample menu items for Sushi Master
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'California Roll', 'Crab, avocado, and cucumber roll', 10.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=300&auto=format&fit=crop', 'Sushi'),
('550e8400-e29b-41d4-a716-446655440003', 'Salmon Nigiri', 'Fresh salmon over pressed vinegared rice', 12.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=300&auto=format&fit=crop', 'Sushi'),
('550e8400-e29b-41d4-a716-446655440003', 'Miso Soup', 'Traditional Japanese soup with tofu and seaweed', 4.99, 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?q=80&w=300&auto=format&fit=crop', 'Soups'),
('550e8400-e29b-41d4-a716-446655440003', 'Edamame', 'Steamed soybean pods with sea salt', 5.99, 'https://images.unsplash.com/photo-1561626423-a51b45aef0a1?q=80&w=300&auto=format&fit=crop', 'Sides');

-- Insert sample menu items for Taco Fiesta
INSERT INTO menu_items (restaurant_id, name, description, price, image, category) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'Beef Tacos', 'Three soft corn tortillas with seasoned beef, lettuce, and cheese', 11.99, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=300&auto=format&fit=crop', 'Tacos'),
('550e8400-e29b-41d4-a716-446655440004', 'Chicken Quesadilla', 'Grilled flour tortilla filled with chicken and cheese', 10.99, 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=300&auto=format&fit=crop', 'Quesadillas'),
('550e8400-e29b-41d4-a716-446655440004', 'Guacamole & Chips', 'Fresh guacamole with crispy tortilla chips', 6.99, 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=300&auto=format&fit=crop', 'Sides'),
('550e8400-e29b-41d4-a716-446655440004', 'Churros', 'Fried dough pastry with cinnamon sugar and chocolate dipping sauce', 5.99, 'https://images.unsplash.com/photo-1624371414361-e670edf4898d?q=80&w=300&auto=format&fit=crop', 'Desserts');

-- Create an admin user (you'll need to replace this with your actual user ID after signing up)
-- INSERT INTO users (id, email, name, role) VALUES 
-- ('your-user-id-here', 'admin@example.com', 'Admin User', 'admin');

-- Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read access on menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);

-- Create policies for users table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own record" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Users can insert their own order items" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own cart items" ON cart_items FOR SELECT USING (true);
CREATE POLICY "Users can insert their own cart items" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own cart items" ON cart_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own cart items" ON cart_items FOR DELETE USING (true);

-- Admin policies for restaurants
CREATE POLICY "Admins can manage restaurants" ON restaurants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

-- Admin policies for menu items
CREATE POLICY "Admins can manage menu items" ON menu_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

-- Admin policies for categories
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

-- Admin policies for orders (admins can view and update all orders)
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

-- Admin policies for users (admins can view and update all users)
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid()::text 
    AND users.role = 'admin'
  )
);

-- Function to automatically create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user record on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();