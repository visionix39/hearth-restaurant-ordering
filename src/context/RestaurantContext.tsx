import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  defaultSettings,
  seedMenu,
  seedOrders,
  seedReviews,
} from '../data/seed'
import type {
  CartItem,
  MenuItem,
  Order,
  OrderStatus,
  OrderType,
  RestaurantSettings,
  Review,
} from '../types'

const STORAGE_KEY = 'hearth-restaurant-v1'

interface PersistedState {
  menu: MenuItem[]
  orders: Order[]
  settings: RestaurantSettings
  reviews: Review[]
}

interface RestaurantContextValue {
  menu: MenuItem[]
  orders: Order[]
  settings: RestaurantSettings
  reviews: Review[]
  cart: CartItem[]
  tableNumber: number | null
  setTableNumber: (n: number | null) => void
  addToCart: (menuItemId: string, quantity?: number) => void
  updateCartQty: (menuItemId: string, quantity: number) => void
  removeFromCart: (menuItemId: string) => void
  clearCart: () => void
  cartCount: number
  cartSubtotal: number
  placeOrder: (input: {
    type: OrderType
    customerName: string
    phone?: string
    tableNumber?: number
  }) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrderByCode: (code: string) => Order | undefined
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  updateSettings: (patch: Partial<RestaurantSettings>) => void
  addReview: (input: {
    authorName: string
    rating: number
    comment: string
  }) => void
  resetDemo: () => void
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null)

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>
      return {
        menu: parsed.menu ?? seedMenu,
        orders: parsed.orders ?? seedOrders,
        settings: parsed.settings ?? defaultSettings,
        reviews: parsed.reviews ?? seedReviews,
      }
    }
  } catch {
    /* ignore */
  }
  return {
    menu: seedMenu,
    orders: seedOrders,
    settings: defaultSettings,
    reviews: seedReviews,
  }
}

function makeCode(orders: Order[]) {
  const n = 1000 + orders.length + Math.floor(Math.random() * 80)
  return `HR-${n}`
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadState(), [])
  const [menu, setMenu] = useState<MenuItem[]>(initial.menu)
  const [orders, setOrders] = useState<Order[]>(initial.orders)
  const [settings, setSettings] = useState<RestaurantSettings>(initial.settings)
  const [reviews, setReviews] = useState<Review[]>(initial.reviews)
  const [cart, setCart] = useState<CartItem[]>([])
  const [tableNumber, setTableNumber] = useState<number | null>(null)

  useEffect(() => {
    const payload: PersistedState = { menu, orders, settings, reviews }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [menu, orders, settings, reviews])

  const addToCart = useCallback((menuItemId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === menuItemId)
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === menuItemId
            ? { ...c, quantity: c.quantity + quantity }
            : c,
        )
      }
      return [...prev, { menuItemId, quantity }]
    })
  }, [])

  const updateCartQty = useCallback((menuItemId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((c) => c.menuItemId !== menuItemId)
        : prev.map((c) =>
            c.menuItemId === menuItemId ? { ...c, quantity } : c,
          ),
    )
  }, [])

  const removeFromCart = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.quantity, 0),
    [cart],
  )

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, c) => {
      const item = menu.find((m) => m.id === c.menuItemId)
      return sum + (item?.price ?? 0) * c.quantity
    }, 0)
  }, [cart, menu])

  const placeOrder = useCallback(
    (input: {
      type: OrderType
      customerName: string
      phone?: string
      tableNumber?: number
    }) => {
      const items = cart
        .map((c) => {
          const item = menu.find((m) => m.id === c.menuItemId)
          if (!item) return null
          return {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: c.quantity,
            notes: c.notes,
          }
        })
        .filter(Boolean) as Order['items']

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
      const tax = Math.round(subtotal * settings.taxRate * 100) / 100
      const total = Math.round((subtotal + tax) * 100) / 100
      const estimatedMinutes = Math.max(
        ...items.map((i) => {
          const m = menu.find((x) => x.id === i.menuItemId)
          return m?.prepMinutes ?? 15
        }),
        12,
      )

      const now = new Date().toISOString()
      const order: Order = {
        id: `o-${crypto.randomUUID().slice(0, 8)}`,
        code: makeCode(orders),
        type: input.type,
        tableNumber: input.tableNumber,
        customerName: input.customerName,
        phone: input.phone,
        items,
        status: 'pending',
        subtotal,
        tax,
        total,
        createdAt: now,
        updatedAt: now,
        estimatedMinutes,
      }

      setOrders((prev) => [order, ...prev])
      setCart([])
      return order
    },
    [cart, menu, orders, settings.taxRate],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status, updatedAt: new Date().toISOString() }
            : o,
        ),
      )
    },
    [],
  )

  const getOrderByCode = useCallback(
    (code: string) =>
      orders.find((o) => o.code.toLowerCase() === code.toLowerCase()),
    [orders],
  )

  const addMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    setMenu((prev) => [
      ...prev,
      { ...item, id: `m-${crypto.randomUUID().slice(0, 8)}` },
    ])
  }, [])

  const updateMenuItem = useCallback(
    (id: string, patch: Partial<MenuItem>) => {
      setMenu((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      )
    },
    [],
  )

  const deleteMenuItem = useCallback((id: string) => {
    setMenu((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const updateSettings = useCallback((patch: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const addReview = useCallback(
    (input: { authorName: string; rating: number; comment: string }) => {
      const review: Review = {
        id: `r-${crypto.randomUUID().slice(0, 8)}`,
        authorName: input.authorName,
        rating: Math.min(5, Math.max(1, Math.round(input.rating))),
        comment: input.comment,
        createdAt: new Date().toISOString(),
      }
      setReviews((prev) => [review, ...prev])
    },
    [],
  )

  const resetDemo = useCallback(() => {
    setMenu(seedMenu)
    setOrders(seedOrders)
    setSettings(defaultSettings)
    setReviews(seedReviews)
    setCart([])
    setTableNumber(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value: RestaurantContextValue = {
    menu,
    orders,
    settings,
    reviews,
    cart,
    tableNumber,
    setTableNumber,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    placeOrder,
    updateOrderStatus,
    getOrderByCode,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateSettings,
    addReview,
    resetDemo,
  }

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext)
  if (!ctx) {
    throw new Error('useRestaurant must be used within RestaurantProvider')
  }
  return ctx
}
