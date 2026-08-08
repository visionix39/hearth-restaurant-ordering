# Hearth — Restaurant Ordering System

A frontend-only restaurant ordering demo built with **React 19** and **Vite** for portfolio use. No backend required — state is persisted in `localStorage`.

## Features

- **QR Menu** — generate per-table QR codes that open a live menu
- **Online Ordering** — browse categories, cart, checkout (dine-in / takeaway / delivery)
- **Order Tracking** — status timeline by order code
- **Kitchen Dashboard** — ticket board to advance orders through the line
- **Admin Panel** — menu CRUD, order overrides, restaurant settings
- **Analytics** — revenue charts, order mix, top sellers

## Stack

- React 19 + TypeScript
- React Router 7
- Recharts
- qrcode.react
- Lucide icons
- CSS (custom design system, no UI kit)

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview production build
```

## Demo flow

1. Open **Menu** or **QR Menu** → pick a table → add dishes
2. **Checkout** → place an order → land on **Track**
3. Open **Kitchen** → advance the ticket (`pending` → `completed`)
4. Explore **Admin** (edit menu / settings) and **Analytics**

Seeded track codes: `HR-1042`, `HR-1043`, `HR-1041`

Use **Reset demo data** in Admin to restore the seed dataset.

## Project structure

```
src/
  components/   # shell, menu cards, badges
  context/      # restaurant store (orders, menu, cart)
  data/         # seed menu + orders
  pages/        # route screens
  types/        # shared TypeScript types
```

## Notes

- Designed as a portfolio showcase — not production POS software
- Images load from Unsplash; an internet connection is needed for photos
- Brand: **Hearth** (cedar green + ember accent)
