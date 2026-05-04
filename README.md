# inovents - Event Ticketing System

A modern, scalable Event Ticketing System backend built with Node.js, Express, and MongoDB. This platform allows organizers to create and manage events, and attendees to discover events and book digital tickets with unique QR codes.

## 🚀 Features

- **Authentication & Authorization:** Secure JWT-based auth with Role-Based Access Control (RBAC) for Attendees, Organizers, and Admins.
- **Event Discovery:** Browse and search events with advanced filtering (keyword, date, price, availability).
- **Booking Engine:** Atomic database transactions ensure ticket availability is updated safely without race conditions.
- **Digital Tickets:** Automatic generation of unique digital tickets with scannable QR codes upon booking.
- **Check-In System:** Secure door validation with duplicate scan protection and real-time check-in logging.
- **Vercel Ready:** Optimized for serverless deployment with connection pooling and stateless handling.

## 🛠 Tech Stack

- **Framework:** Express.js (TypeScript)
- **Database:** MongoDB with Mongoose ODM
- **Security:** Helmet, CORS, Bcryptjs
- **Auth:** JSON Web Tokens (JWT)
- **Tools:** Zod (Validation), QRcode (Generation), Dotenv, Concurrently

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/dev-mahmoud-zain/inovents-demo.git
cd inovents-demo/Server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your credentials:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Run the project
**Development Mode (auto-reload):**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

---

## 📂 Project Structure (NestJS-inspired)

```
Server/
├── src/
│   ├── app.ts                  # Express app & middleware setup
│   ├── server.ts               # Local server entry point
│   ├── config/                 # Database & external service configs
│   ├── common/                 # Shared enums, interfaces, types, & utils
│   ├── middleware/             # Auth & Role guards
│   └── modules/                # Domain-specific modules (Auth, Events, Bookings, Tickets)
├── index.ts                    # Vercel entry point
└── vercel.json                 # Vercel deployment config
```

---

## 📖 API Documentation

### Base URL
`http://localhost:3000/api`

### 0. System Endpoints
- **GET /**: Returns basic server information and description.
- **GET /api/health**: Verifies server and database connection status.

### 1. Auth Module (`/api/auth`)
- **POST /register**: Creates a new account (`name`, `email`, `password`, `role`).
- **POST /login**: Returns a JWT token for existing users.

### 2. Event Module (`/api/events`)
- **GET /**: Public discovery with filters (`keyword`, `date`, `price_min`, `price_max`, `availability`).
- **GET /:eventId**: Detailed info for a single event.
- **POST /create**: Create a new event (Organizer only).
- **GET /my-events**: List events created by the logged-in organizer.
- **PUT /update/:eventId**: Update event details (Organizer only).
- **GET /attendees/:eventId**: View all tickets and check-in statuses for an event (Organizer only).

### 3. Booking Module (`/api/bookings`)
- **POST /**: Book tickets for an event (`eventId`, `quantity`).
- **GET /**: View your personal booking history.

### 4. Ticket Module (`/api/tickets`)
- **GET /**: View your digital tickets (Upcoming & Past).
- **GET /:ticketId**: Get ticket details and QR code.
- **POST /check-in**: Validate a ticket at the door using its QR token (Organizer only).

---

## 🌐 Deployment

This project is optimized for **Vercel**. To deploy:
1. Connect your repository to Vercel.
2. Add your `.env` variables to the Vercel Dashboard.
3. Vercel will automatically use the `vercel.json` and `index.ts` to host the API as serverless functions.

---

## 📝 Author
Created by **Mahmoud Zain** as a technical demonstration of a scalable event management backend.
