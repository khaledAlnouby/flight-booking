# Flight Booking System

A full-stack MERN (MongoDB, Express, React, Node.js) application for booking flights. The platform supports two types of users: **Companies** (who create and manage flights) and **Passengers** (who search for and book flights).

## Features

- **Role-Based Portals:** Dedicated dashboards for Companies and Passengers.
- **Flight Management:** Companies can add flights, view registered passengers, and cancel flights (which automatically refunds passengers).
- **Booking System:** Passengers can search for flights by destination and book them seamlessly using their account balance.
- **Real-Time Messaging:** A built-in chat interface allows Passengers to communicate with Companies directly.
- **Modern UI:** Built with React and Vanilla CSS, featuring glassmorphism aesthetics, responsive design, and smooth animations.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or update the URI in backend `.env`)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd flight-booking
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   *Optional:* Create a `.env` file in the `backend` directory to override default environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/flight-booking
   JWT_SECRET=your_secret_key_here
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new User (Company or Passenger)
- `POST /login` - Authenticate a User and return a JWT

### Users (`/api/users`)
- `GET /profile` - Get the current user's profile
- `PUT /profile` - Update the current user's profile
- `GET /companies` - Get a list of all registered companies (Used for passenger messaging)

### Flights (`/api/flights`)
- `POST /` - Create a new flight (Company only)
- `GET /` - Get all available flights
- `GET /:id` - Get details of a specific flight
- `POST /:id/book` - Book a specific flight (Passenger only)
- `POST /:id/cancel` - Cancel a flight and refund passengers (Company only)

### Messages (`/api/messages`)
- `POST /` - Send a message to a contact
- `GET /:otherUserId` - Get the chat history with a specific user
- `GET /contacts/list` - Get a list of users you have active conversations with
