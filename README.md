# Swastik Distributor & Marketing — E-commerce Website

A full-stack online store with an admin panel and Razorpay payments, built for Swastik Distributor & Marketing.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT admin auth, Razorpay
- **Frontend:** React (Vite), React Router

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either installed locally, or a free cluster from MongoDB Atlas
- A Razorpay account (sign up at razorpay.com) — use **Test Mode** keys first

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from your Razorpay dashboard (Settings → API Keys)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login you'll use for the admin dashboard

Create the admin account and a few sample products:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

It runs on `http://localhost:5000`.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` — that's your store.
Admin dashboard is at `http://localhost:5173/admin/login`.

## 4. How the payment flow works

1. Customer fills the checkout form and clicks **Pay**.
2. The frontend calls `POST /api/orders/create`, which recalculates the total
   from the database (never trusts the browser) and creates a Razorpay order.
3. Razorpay's checkout popup opens for the customer to pay via UPI, card, or netbanking.
4. On success, the frontend calls `POST /api/orders/verify`, which checks the
   payment signature using your Razorpay secret key. Only then is the order
   marked "paid" and stock is reduced.

This two-step create → verify pattern is Razorpay's standard integration and
prevents someone from faking a successful payment.

## 5. Going live

- Switch your Razorpay dashboard from Test Mode to Live Mode and swap in the live API keys.
- Deploy the backend (Render, Railway, or a VPS) and the frontend (Vercel, Netlify).
- Update `FRONTEND_URL` in the backend `.env` and `VITE_API_URL` in the frontend `.env`
  to your real domains.
- Use a proper MongoDB Atlas cluster instead of a local database.
- Consider adding a Razorpay webhook (`checkout.razorpay.com` docs) as a backup
  confirmation in case the customer closes the browser right after paying.

## 6. Project structure

```
backend/
  models/        Product, Order, Admin schemas
  routes/        auth, products, orders (create/verify payment)
  middleware/    JWT admin auth guard
  utils/         Razorpay client, database seed script
frontend/
  src/pages/     Home, ProductDetail, Cart, Checkout, Admin
  src/context/   Cart state (persisted in session storage)
  src/api.js     Talks to the backend
```
