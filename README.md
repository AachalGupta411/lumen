# Lumen — Full-Stack Shopping Cart

A production-style e-commerce shopping cart built with **MERN + Redis + Socket.IO**, featuring guest carts, persistent user carts, real-time sync across tabs, and a polished modern UI.

```
React (Vite) + Tailwind + Redux Toolkit + Framer Motion
Node.js + Express + MongoDB (Mongoose) + Redis + Socket.IO + JWT
```

## Highlights

- **Guest cart** stored in Redis (with in-memory fallback) keyed by `x-session-id`
- **Persistent cart** in MongoDB for logged-in users
- **Cart merge** on login/register — combines quantities, respects stock, drops invalid items
- **Real-time updates** over Socket.IO — multi-tab sync, instant cart count/total updates
- **JWT auth** with axios interceptor + protected routes
- **Beautiful UI** — sticky navbar, slide-over cart drawer, mobile nav, skeleton loaders, toasts, page transitions

## Project structure

```
shopping-cart/
├── backend/
│   ├── config/db.js                 Mongo connection
│   ├── controllers/                 auth | product | cart | order
│   ├── middleware/                  auth, error, asyncHandler
│   ├── models/                      User, Product, Cart, Order
│   ├── redis/redisClient.js         Redis + memory fallback
│   ├── routes/
│   ├── seed/seed.js                 Realistic 20-item catalog + demo user
│   ├── services/cartService.js      Guest + user + merge logic
│   ├── sockets/index.js             Socket.IO rooms (user:* / guest:*)
│   ├── utils/jwt.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/              Navbar, CartDrawer, ProductCard, …
        ├── hooks/useCartSocket.js
        ├── layouts/MainLayout.jsx
        ├── pages/                   Home, Products, ProductDetail, Cart, Checkout, Login, Register, Profile, OrderSuccess
        ├── redux/slices/            auth, cart, products, ui
        ├── routes/ProtectedRoute.jsx
        ├── services/                api.js (axios) | session.js | socket.js
        └── utils/format.js
```

## Quick start

### 1. Prerequisites

- Node 18+
- MongoDB (running locally or via `MONGO_URI`)
- Redis _(optional — falls back to in-memory if unavailable)_

### 2. Install

```bash
npm run install:all
# or, individually:
npm --prefix backend install
npm --prefix frontend install
```

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
# edit backend/.env if needed
```

### 4. Seed the database

```bash
npm run seed
# → seeds 20 products + creates demo user (demo@shop.dev / demo1234)
```

### 5. Run dev servers

```bash
# in two terminals
npm run dev:backend     # http://localhost:5000
npm run dev:frontend    # http://localhost:5173
```

Vite proxies `/api` and `/socket.io` to the backend, so the frontend works as a single origin during development.

## Demo credentials

```
Email:    demo@shop.dev
Password: demo1234
```

## API surface

| Method | Endpoint              | Auth     | Notes                                    |
| ------ | --------------------- | -------- | ---------------------------------------- |
| POST   | `/api/auth/register`  | —        | Returns JWT, optionally merges guest cart |
| POST   | `/api/auth/login`     | —        | Returns JWT, optionally merges guest cart |
| GET    | `/api/auth/me`        | Bearer   | Current user                             |
| GET    | `/api/products`       | —        | `q, category, sort, page, limit`         |
| GET    | `/api/products/:id`   | —        |                                          |
| GET    | `/api/cart`           | optional | Guest by `x-session-id`, else user cart  |
| POST   | `/api/cart/add`       | optional | `{ productId, quantity }`                |
| PUT    | `/api/cart/update`    | optional | `{ productId, quantity }`                |
| POST   | `/api/cart/remove`    | optional | `{ productId }`                          |
| DELETE | `/api/cart/clear`     | optional |                                          |
| POST   | `/api/cart/merge`     | Bearer   | Merge guest → user cart                  |
| POST   | `/api/orders`         | Bearer   | Validates stock, decrements stock        |
| GET    | `/api/orders`         | Bearer   | My orders                                |

## Cart architecture

```
Guest                           Logged in
─────                           ─────────
x-session-id header             Authorization: Bearer <jwt>
        │                                 │
        ▼                                 ▼
   Redis (TTL 7d)                    MongoDB Cart
        │                                 │
        └────── merge on login ───────────┘
                  │
        sums quantities · clamps to stock · drops missing products
```

## Real-time sync

Each cart mutation emits to:

- `user:<userId>` for authenticated users
- `guest:<sessionId>` for guests

The frontend joins its room on connect (`useCartSocket`), so any tab in the same session receives `cart:update` and Redux state stays in sync without polling.

## Production notes

- Replace `JWT_SECRET` with a long random secret
- Set `CLIENT_URL` to your production domain
- Use a managed Mongo + Redis (Atlas / Upstash / etc.)
- `helmet`, `cors`, and `express-rate-limit` are enabled out of the box
