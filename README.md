# 🎟️ Eventora — Full Stack MERN Event Booking Platform

<div align="center">

![Eventora Banner](https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800)

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**A production-ready Event Management & Ticket Booking System with OTP Verification, Role-Based Access Control, and Admin Analytics Dashboard.**

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Flow](#-system-flow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Seed Data](#-seed-data)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🌟 Overview

**Eventora** is a full-stack MERN application that allows users to browse events, request ticket bookings using secure **email OTP verification**, and track their booking status. Admins get a powerful dashboard to create events, manage bookings, confirm payments, and monitor platform analytics.

> Built to demonstrate real-world patterns: JWT auth, OTP flow, role-based access, booking state machine, and admin analytics.

---

## ✨ Features

### 👤 User Features
- Browse and search all available events
- Request a ticket booking with seat selection
- **Secure OTP verification** via email before booking is submitted
- Personal dashboard to track booking status (Pending / Confirmed / Rejected)
- View booking history and event details

### 🛡️ Admin Features
- Create, edit, and delete events with images
- View all incoming booking requests
- **Confirm or reject** bookings (approval workflow)
- Auto-send confirmation email on approval
- Analytics dashboard — Revenue, Confirmed Bookings, Pending Requests
- Manage seats count dynamically on confirmation

### 🔐 Auth & Security
- JWT-based authentication with HTTP-only cookies
- Role-based access control (`user` / `admin`)
- bcryptjs password hashing
- OTP expiry and single-use validation

---

## 🔄 System Flow

### OTP Flow
```
User ──► Request OTP ──► Verify User ──► Generate OTP ──► Send OTP Email ──► Process Complete
```

### Booking Flow
```
User ──► Submit Booking ──► Validate OTP ──► Create Booking ──► Process Complete
```

### Admin Flow
```
Admin ──► Confirm Booking ──► Update Seats ──► Send Confirmation Email ──► Process Complete
```

> The full flowchart with all three flows (OTPFLOW, BOOKINGFLOW, ADMINFLOW) is shown below:

<img src="flowchart.png" alt="Eventora System Flowchart — OTP Flow, Booking Flow, Admin Flow" width="100%" />

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Email** | Nodemailer (OTP + Confirmation emails) |
| **State Management** | React Context / useState |
| **Routing** | React Router v6 |

---

## 📁 Project Structure

```
EventStack/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   └── OTPModal.jsx
│   │   ├── pages/                   # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Dashboard.jsx        # User booking dashboard
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageEvents.jsx
│   │   │       └── ManageBookings.jsx
│   │   ├── context/                 # Auth context
│   │   ├── utils/                   # Axios instance, helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── controllers/                 # Route handler logic
│   │   ├── authController.js        # Register, Login, Logout
│   │   ├── eventController.js       # CRUD for events
│   │   ├── bookingController.js     # Booking request + confirm
│   │   └── otpController.js         # OTP generation & validation
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify middleware
│   │   └── adminMiddleware.js       # Admin role guard
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, password, role)
│   │   ├── Event.js                 # Event schema (title, date, venue, seats)
│   │   └── Booking.js               # Booking schema (user, event, status, OTP)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── otpRoutes.js
│   ├── utils/
│   │   └── sendEmail.js             # Nodemailer email utility
│   ├── seed.js                      # Database seeder (users + events)
│   ├── index.js                     # Express app entry point
│   ├── .env
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eventora.git
cd eventora
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in `/server` (see [Environment Variables](#-environment-variables)).

```bash
# Seed the database with sample users & events
node seed.js

# Start the server
npm run dev
```

Server runs at: `http://localhost:5000`

### 3. Setup the Client

```bash
cd ../client
npm install
npm run dev
```

Client runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file inside the `/server` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventora

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Email (Nodemailer — Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development

# DNS (optional, for Mongoose)
DNS_SERVERS=8.8.4.4,8.8.8.8
```

> For Gmail, generate an **App Password** from [Google Account Security](https://myaccount.google.com/security).

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login & receive JWT | Public |
| POST | `/logout` | Clear auth cookie | Private |

### OTP Routes — `/api/otp`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/request` | Generate & email OTP | Private |
| POST | `/verify` | Validate submitted OTP | Private |

### Event Routes — `/api/events`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all events | Public |
| GET | `/:id` | Get single event | Public |
| POST | `/` | Create event | Admin |
| PUT | `/:id` | Update event | Admin |
| DELETE | `/:id` | Delete event | Admin |

### Booking Routes — `/api/bookings`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Submit booking request | Private |
| GET | `/my` | Get user's bookings | Private |
| GET | `/` | Get all bookings | Admin |
| PATCH | `/:id/confirm` | Confirm booking | Admin |
| PATCH | `/:id/reject` | Reject booking | Admin |

---

## 🌱 Seed Data

The `seed.js` file populates the database with:

**10 Sample Users:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventora.com | password123 |
| User | user@eventora.com | password123 |
| User | alice@eventora.com | password123 |
| User | bob@eventora.com | password123 |
| ... | ... | password123 |

**Sample Events** including:
- Node.js Developer Retreat
- Full-Stack Web Development Workshop
- *(and more — located in Silicon Valley Innovation Center, CA)*

> ⚠️ Change all passwords before deploying to production!

---

## 🗂️ Booking Status States

```
PENDING  ──► CONFIRMED
         └─► REJECTED
```

- **Pending** — Booking submitted, awaiting admin review
- **Confirmed** — Admin approved, seat deducted, confirmation email sent
- **Rejected** — Admin declined the request

---

## 👥 Roles

| Role | Capabilities |
|------|-------------|
| `user` | Browse events, request bookings, view own dashboard |
| `admin` | All user capabilities + create/manage events, approve/reject bookings, view analytics |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using the **MERN Stack**

⭐ Star this repo if you found it helpful!

</div>
