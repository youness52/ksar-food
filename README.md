# Food Delivery App with Supabase Authentication

A React Native food delivery app built with Expo and Supabase for backend services and user authentication.

## Features

- **User Authentication**: Sign up, sign in, and sign out with Supabase Auth
- **Browse Restaurants**: View restaurants and categories with real-time data
- **Restaurant Menus**: View detailed menus with filtering by category
- **Shopping Cart**: Add items to cart with real-time sync across devices
- **Order Management**: Place orders and track delivery status
- **Search Functionality**: Search across restaurants, cuisines, and menu items
- **User Profile**: View order history and manage account settings
- **Persistent State**: Cart and user data persist across app sessions

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **State Management**: React Query + Context API (@nkzw/create-context-hook)
- **Navigation**: Expo Router with authentication guards
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `lib/supabase-setup.sql` to create tables and insert sample data
4. Enable email authentication in Authentication > Settings
5. Get your project URL and anon key from Settings > API

### 2. Configure Supabase

Update `lib/supabase.ts` with your Supabase credentials:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
npm start
```

## Authentication Flow

The app implements a complete authentication flow:

1. **Unauthenticated users** are redirected to the login screen
2. **New users** can create accounts via the signup screen
3. **Authenticated users** can access all app features
4. **User sessions** persist across app restarts
5. **Sign out** clears all user data and redirects to login

## Database Schema

The app uses the following main tables:

- **restaurants**: Store restaurant information
- **menu_items**: Store menu items for each restaurant
- **categories**: Store food categories
- **orders**: Store user orders (linked to authenticated users)
- **order_items**: Store items within each order
- **cart_items**: Store user's cart items (linked to authenticated users)

## Key Features

### Authentication Guards
All main screens are protected with `AuthGuard` component that automatically redirects unauthenticated users to login.

### Real-time Cart Sync
Cart items are automatically synced with Supabase and linked to the authenticated user, allowing cart persistence across devices.

### Order Tracking
Orders are stored in the database with status tracking and linked to the authenticated user for order history.

### User Profile Management
Users can view their order history, manage account settings, and sign out securely.

### Search Functionality
Search across restaurants, categories, and menu items with real-time filtering.

### Responsive Design
Optimized for both mobile and web platforms using React Native Web.

## Authentication Security

- Uses Supabase Auth for secure user management
- Row Level Security (RLS) enabled for data protection
- User-specific data isolation (cart, orders)
- Secure session management with automatic token refresh
- Password validation and email verification support

## Development Notes

- Authentication state is managed globally using `@nkzw/create-context-hook`
- All database operations are user-scoped and use React Query for caching
- Auth guards prevent unauthorized access to protected routes
- User data is automatically cleared on sign out
- Supports both email/password authentication (can be extended for OAuth)