export type Category =
  | 'starters'
  | 'mains'
  | 'sides'
  | 'desserts'
  | 'drinks'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type OrderType = 'dine-in' | 'takeaway' | 'delivery'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image: string
  available: boolean
  popular?: boolean
  prepMinutes: number
}

export interface CartItem {
  menuItemId: string
  quantity: number
  notes?: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  code: string
  type: OrderType
  tableNumber?: number
  customerName: string
  phone?: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
  estimatedMinutes: number
}

export interface RestaurantSettings {
  name: string
  tagline: string
  address: string
  phone: string
  taxRate: number
  tables: number
  openHours: string
}

export interface AnalyticsDay {
  date: string
  orders: number
  revenue: number
}

export type UserRole = 'guest' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface Review {
  id: string
  authorName: string
  rating: number
  comment: string
  createdAt: string
}
