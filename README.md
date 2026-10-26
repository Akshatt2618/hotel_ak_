# Hotel_AK_  (HotelAK)
> A modern, secure, and luxury-tier Hotel Management System built with the MERN stack.

![HotelPro Demo](https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80)

## Overview
**Hotel_On_ management** provides a comprehensive hospitality management platform designed to meet the evolving needs of boutique resorts, luxury suites, and hotel chains. It delivers a fast, light-themed, accessible guest booking interface alongside robust staff and administrative operational dashboards.

---

## Key Features

### 🌟 1. Guest Experience (Light Luxury Aesthetic)
- **Visual Suite Catalog**: Explore high-end accommodations with dynamic filtering across categories (*Presidential Suites, Deluxe Suites, Executive Rooms, Family Villas, Classic Rooms*), status filters, and nightly rate budget sliders.
- **Suite Details & Gallery**: Real-time room capacity, sq. ft. measurements, bed configurations, verified reviews, and signature amenities.
- **Instant Booking Engine**: Automated calculation of stays, occupancy rates, and state hospitality taxes with instant confirmation.
- **Verified Payments**: Integrated Card and UPI / Razorpay payment flows with instant receipt and confetti verification.
- **Digital Tax Invoice**: Printable official hospitality tax invoice with unique booking reference tokens.

### 🛎️ 2. Front Desk & Housekeeping Operations (Staff Portal)
- **Check-In & Departure Desk**: 1-click status update (`Confirmed` → `Checked In` → `Checked Out`) syncing room inventory immediately.
- **Housekeeping & Turnover**: Live room turnover control (`Available`, `Occupied`, `Cleaning`, `Maintenance`).
- **In-Room Guest Requests**: Real-time service order ticketing for housekeeping, dining, and concierge requests.

### 📊 3. Executive GM Dashboard (Admin Analytics)
- **Occupancy & RevPAR Analytics**: Real-time tracking of total revenue, occupancy rate %, active check-ins, and turnover bottlenecks.
- **Inventory & Pricing Matrix**: Add new suites dynamically into the inventory with custom imagery, pricing, and amenities.
- **Security & Audit Logs**: System-wide JWT authentication events, transaction verification, and activity logs.

---

## Tech Stack
- **Frontend**: React (Vite), CSS3 Custom Luxury Design System (Light Theme), Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express.js REST API.
- **Security**: JSON Web Tokens (JWT), bcrypt password hashing, CORS protection, Role-Based Access Control (RBAC).
- **Database / Store**: In-Memory & MongoDB-ready schema design for Rooms, Bookings, Users, Services, and Audit Logs.

---

## Getting Started Locally
https://github.com/Akshatt2618/hotel_ak_

### 2. Start the Backend API Server
```bash
cd server
npm install
node server.js
```
*Backend runs on `http://localhost:5001`*

### 3. Start the Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## Multi-Role Demo Mode
Use the top header demo role buttons to instantly toggle between user roles:
- **Guest**: Eleanor Vance (Book rooms, view reservations, print invoices)
- **Staff**: Marcus Sterling (Manage check-ins, departures, room cleaning statuses, service tickets)
- **Admin**: Victoria Hawthorne (View executive revenue analytics, add inventory, monitor security audit logs)
