# Enkai

Enkai is a lightweight event booking application with a Vite + React frontend and a Node.js + Express backend. It provides user authentication, event browsing, booking flows, and payment result pages to demonstrate an end-to-end booking experience.

**Contents**
- Live demo: Not included
- Tech stack: `React (Vite)`, `Node.js`, `Express`, and simple email/OTP utilities

## Features
- User registration and login (OTP/email helpers)
- Browse events and view event details
- Book seats and view booking history
- Payment success and failure handling pages
- Admin dashboard for event management (stubbed)

## Prerequisites
- Node.js 16 or newer
- npm (or yarn/pnpm)

## Quick start (development)
1. Install dependencies for root, client and server:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Run the backend (from `server/`):

```bash
cd server
npm run dev
```

3. Run the frontend (from `client/`):

```bash
cd client
npm run dev
```

4. Open the app in your browser at the Vite dev URL (typically `http://localhost:5173`).

## Environment variables
Create a `.env` file in `server/` with at least the following values (example):

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=some_secret
EMAIL_USER=you@example.com
EMAIL_PASS=supersecret
```

Adjust as needed for your email/OTP and payment integrations.

## Project structure
- `client/` — React frontend built with Vite
- `server/` — Express API and controllers
- `server/models` — Mongoose models for `User`, `Event`, `Bookings`, `OTP`
- `server/controllers` — Route handlers for auth, events, bookings
- `client/src/components` — Reusable UI components

## Scripts
- Root: none by default (run client/server individually)
- `client`: `npm run dev`, `npm run build`
- `server`: `npm run dev`, `npm start`


