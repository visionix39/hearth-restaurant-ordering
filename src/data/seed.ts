import type { MenuItem, Order, RestaurantSettings, Review, User } from '../types'

export const CATEGORY_LABELS: Record<MenuItem['category'], string> = {
  starters: 'Starters',
  mains: 'Mains',
  sides: 'Sides',
  desserts: 'Desserts',
  drinks: 'Drinks',
}

export const defaultSettings: RestaurantSettings = {
  name: 'Hearth',
  tagline: 'Wood-fired plates for unhurried evenings',
  address: '214 Cedar Lane, Portland',
  phone: '(503) 555-0142',
  taxRate: 0.08,
  tables: 24,
  openHours: 'Tue–Sun · 11:30am – 10:00pm',
}

export const seedMenu: MenuItem[] = [
  {
    id: 'm1',
    name: 'Charred Corn Soup',
    description: 'Sweet corn, smoked paprika oil, crispy shallots',
    price: 12,
    category: 'starters',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    available: true,
    popular: true,
    prepMinutes: 12,
  },
  {
    id: 'm2',
    name: 'House Burrata',
    description: 'Heirloom tomatoes, basil oil, grilled sourdough',
    price: 16,
    category: 'starters',
    image:
      'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    available: true,
    prepMinutes: 8,
  },
  {
    id: 'm3',
    name: 'Citrus Cured Salmon',
    description: 'Fennel, dill crème, toasted rye crumbs',
    price: 18,
    category: 'starters',
    image:
      'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&q=80',
    available: true,
    prepMinutes: 10,
  },
  {
    id: 'm4',
    name: 'Wood-Fired Roast Chicken',
    description: 'Herb butter, roasted garlic, pan jus',
    price: 28,
    category: 'mains',
    image:
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
    available: true,
    popular: true,
    prepMinutes: 22,
  },
  {
    id: 'm5',
    name: 'Cedar Plank Salmon',
    description: 'Maple glaze, charred lemon, seasonal greens',
    price: 32,
    category: 'mains',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    available: true,
    popular: true,
    prepMinutes: 20,
  },
  {
    id: 'm6',
    name: 'Mushroom Risotto',
    description: 'Forest mushrooms, aged parmesan, truffle oil',
    price: 24,
    category: 'mains',
    image:
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
    available: true,
    prepMinutes: 25,
  },
  {
    id: 'm7',
    name: 'Braised Short Rib',
    description: 'Red wine reduction, soft polenta, gremolata',
    price: 36,
    category: 'mains',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    available: true,
    prepMinutes: 18,
  },
  {
    id: 'm8',
    name: 'Crispy Potatoes',
    description: 'Rosemary salt, garlic aioli',
    price: 9,
    category: 'sides',
    image:
      'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&q=80',
    available: true,
    prepMinutes: 12,
  },
  {
    id: 'm9',
    name: 'Seasonal Greens',
    description: 'Lemon vinaigrette, toasted seeds',
    price: 8,
    category: 'sides',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    available: true,
    prepMinutes: 6,
  },
  {
    id: 'm10',
    name: 'Olive Oil Cake',
    description: 'Citrus zest, whipped mascarpone, honey',
    price: 11,
    category: 'desserts',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    available: true,
    popular: true,
    prepMinutes: 5,
  },
  {
    id: 'm11',
    name: 'Dark Chocolate Pot',
    description: 'Sea salt, toasted hazelnut',
    price: 12,
    category: 'desserts',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    available: true,
    prepMinutes: 4,
  },
  {
    id: 'm12',
    name: 'Sparkling Yuzu',
    description: 'House soda, mint, crushed ice',
    price: 7,
    category: 'drinks',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    available: true,
    prepMinutes: 3,
  },
  {
    id: 'm13',
    name: 'Cedar Old Fashioned',
    description: 'Bourbon, smoked maple, orange bitters',
    price: 14,
    category: 'drinks',
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    available: true,
    popular: true,
    prepMinutes: 5,
  },
  {
    id: 'm14',
    name: 'Pour-Over Coffee',
    description: 'Single-origin, rotating roast',
    price: 5,
    category: 'drinks',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    available: true,
    prepMinutes: 6,
  },
]

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

function minsAgo(m: number) {
  return new Date(Date.now() - m * 60 * 1000).toISOString()
}

function daysAgo(d: number) {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

/** Demo accounts — no backend; passwords are plain sample data. */
export const seedUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Hearth Admin',
    email: 'admin@hearth.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'u-guest1',
    name: 'Maya Chen',
    email: 'maya@example.com',
    password: 'guest123',
    role: 'guest',
  },
  {
    id: 'u-guest2',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    password: 'guest123',
    role: 'guest',
  },
]

export const seedReviews: Review[] = [
  {
    id: 'r1',
    authorName: 'Maya Chen',
    rating: 5,
    comment:
      'The wood-fired chicken was perfect — crispy skin, juicy inside. Ordering from the table QR was effortless.',
    createdAt: daysAgo(2),
  },
  {
    id: 'r2',
    authorName: 'Jordan Lee',
    rating: 5,
    comment:
      'Cedar plank salmon is a must. Takeaway was ready on time and still hot. Will be back.',
    createdAt: daysAgo(5),
  },
  {
    id: 'r3',
    authorName: 'Sam Rivera',
    rating: 4,
    comment:
      'Loved the mushroom risotto and olive oil cake. Atmosphere feels calm and intentional.',
    createdAt: daysAgo(8),
  },
  {
    id: 'r4',
    authorName: 'Ava Brooks',
    rating: 5,
    comment:
      'Delivery arrived neatly packed. The short rib melted. Tracking the order live was a nice touch.',
    createdAt: daysAgo(12),
  },
  {
    id: 'r5',
    authorName: 'Chris Park',
    rating: 4,
    comment:
      'Charred corn soup is seasonal magic. Only wish we had more dessert options.',
    createdAt: daysAgo(18),
  },
]

export const seedOrders: Order[] = [
  {
    id: 'o1',
    code: 'HR-1042',
    type: 'dine-in',
    tableNumber: 7,
    customerName: 'Maya Chen',
    items: [
      {
        menuItemId: 'm4',
        name: 'Wood-Fired Roast Chicken',
        price: 28,
        quantity: 1,
      },
      {
        menuItemId: 'm8',
        name: 'Crispy Potatoes',
        price: 9,
        quantity: 1,
      },
    ],
    status: 'preparing',
    subtotal: 37,
    tax: 2.96,
    total: 39.96,
    createdAt: minsAgo(18),
    updatedAt: minsAgo(12),
    estimatedMinutes: 22,
  },
  {
    id: 'o2',
    code: 'HR-1043',
    type: 'takeaway',
    customerName: 'Jordan Lee',
    phone: '503-555-0199',
    items: [
      {
        menuItemId: 'm5',
        name: 'Cedar Plank Salmon',
        price: 32,
        quantity: 2,
      },
      {
        menuItemId: 'm12',
        name: 'Sparkling Yuzu',
        price: 7,
        quantity: 2,
      },
    ],
    status: 'pending',
    subtotal: 78,
    tax: 6.24,
    total: 84.24,
    createdAt: minsAgo(6),
    updatedAt: minsAgo(6),
    estimatedMinutes: 25,
  },
  {
    id: 'o3',
    code: 'HR-1041',
    type: 'dine-in',
    tableNumber: 12,
    customerName: 'Sam Rivera',
    items: [
      {
        menuItemId: 'm6',
        name: 'Mushroom Risotto',
        price: 24,
        quantity: 1,
      },
      {
        menuItemId: 'm10',
        name: 'Olive Oil Cake',
        price: 11,
        quantity: 1,
      },
    ],
    status: 'ready',
    subtotal: 35,
    tax: 2.8,
    total: 37.8,
    createdAt: minsAgo(35),
    updatedAt: minsAgo(4),
    estimatedMinutes: 25,
  },
  {
    id: 'o4',
    code: 'HR-1038',
    type: 'delivery',
    customerName: 'Ava Brooks',
    phone: '503-555-0177',
    items: [
      {
        menuItemId: 'm7',
        name: 'Braised Short Rib',
        price: 36,
        quantity: 1,
      },
      {
        menuItemId: 'm9',
        name: 'Seasonal Greens',
        price: 8,
        quantity: 1,
      },
      {
        menuItemId: 'm13',
        name: 'Cedar Old Fashioned',
        price: 14,
        quantity: 2,
      },
    ],
    status: 'completed',
    subtotal: 72,
    tax: 5.76,
    total: 77.76,
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(2.4),
    estimatedMinutes: 30,
  },
  {
    id: 'o5',
    code: 'HR-1035',
    type: 'dine-in',
    tableNumber: 3,
    customerName: 'Chris Park',
    items: [
      {
        menuItemId: 'm1',
        name: 'Charred Corn Soup',
        price: 12,
        quantity: 2,
      },
      {
        menuItemId: 'm4',
        name: 'Wood-Fired Roast Chicken',
        price: 28,
        quantity: 2,
      },
    ],
    status: 'completed',
    subtotal: 80,
    tax: 6.4,
    total: 86.4,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(4.5),
    estimatedMinutes: 28,
  },
  {
    id: 'o6',
    code: 'HR-1032',
    type: 'takeaway',
    customerName: 'Elena Soto',
    items: [
      {
        menuItemId: 'm5',
        name: 'Cedar Plank Salmon',
        price: 32,
        quantity: 1,
      },
    ],
    status: 'completed',
    subtotal: 32,
    tax: 2.56,
    total: 34.56,
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(25.5),
    estimatedMinutes: 20,
  },
  {
    id: 'o7',
    code: 'HR-1029',
    type: 'dine-in',
    tableNumber: 9,
    customerName: 'Noah Kim',
    items: [
      {
        menuItemId: 'm2',
        name: 'House Burrata',
        price: 16,
        quantity: 1,
      },
      {
        menuItemId: 'm7',
        name: 'Braised Short Rib',
        price: 36,
        quantity: 1,
      },
      {
        menuItemId: 'm11',
        name: 'Dark Chocolate Pot',
        price: 12,
        quantity: 2,
      },
    ],
    status: 'completed',
    subtotal: 76,
    tax: 6.08,
    total: 82.08,
    createdAt: hoursAgo(28),
    updatedAt: hoursAgo(27),
    estimatedMinutes: 30,
  },
]
