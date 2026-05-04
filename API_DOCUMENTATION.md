# inovents API Documentation

This document provides a summary of all available API endpoints, the required request data, and their functionality.

---

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 1. Auth Module (`/auth`)

### Register User
- **Endpoint:** `POST /register`
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "Attendee" 
  }
  ```
  *Roles can be: `Attendee`, `Organizer`, `Admin` (defaults to `Attendee`).*

### Login User
- **Endpoint:** `POST /login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

---

## 2. Event Module (`/events`)

### Get All Events (Public)
- **Endpoint:** `GET /`
- **Description:** Fetches a list of all events with optional filters.
- **Query Parameters:**
  - `keyword`: Search in title/description.
  - `date`: Filter by date (YYYY-MM-DD).
  - `price_min`: Minimum price.
  - `price_max`: Maximum price.
  - `availability`: Only show events with tickets left (`true`/`false`).

### Get Event Details (Public)
- **Endpoint:** `GET /:eventId`
- **Description:** Fetches detailed information about a single event.

### Create Event (Organizer/Admin)
- **Endpoint:** `POST /organizer`
- **Description:** Creates a new event.
- **Request Body:**
  ```json
  {
    "title": "Summer Music Festival",
    "description": "A night of great music and fun.",
    "venue": {
      "address": "123 Park Ave, New York",
      "coordinates": { "lat": 40.7128, "lng": -74.0060 }
    },
    "dateTime": "2024-07-15T20:00:00Z",
    "totalCapacity": 500,
    "price": 49.99,
    "gallery": ["image_url_1", "image_url_2"],
    "refundPolicy": "No refunds within 24 hours.",
    "rules": "No outside food or drinks."
  }
  ```

### Get My Events (Organizer/Admin)
- **Endpoint:** `GET /organizer/mine`
- **Description:** Lists all events created by the logged-in organizer.

### Update Event (Organizer/Admin)
- **Endpoint:** `PUT /organizer/:eventId`
- **Description:** Updates an existing event (must be the owner).
- **Request Body:** (Partial updates allowed)
  ```json
  {
    "title": "Updated Event Title",
    "price": 55.00
  }
  ```

### Get Event Attendees (Organizer/Admin)
- **Endpoint:** `GET /organizer/:eventId/attendees`
- **Description:** Fetches a list of all tickets and their check-in status for a specific event.

---

## 3. Booking Module (`/bookings`)

### Create Booking (Attendee Only)
- **Endpoint:** `POST /`
- **Description:** Books tickets for an event. Reduces event capacity and generates tickets automatically.
- **Request Body:**
  ```json
  {
    "eventId": "event_mongodb_id",
    "quantity": 2
  }
  ```

### Get My Bookings (Attendee Only)
- **Endpoint:** `GET /`
- **Description:** Fetches the booking history for the logged-in attendee.

---

## 4. Ticket Module (`/tickets`)

### Get My Tickets (Attendee Only)
- **Endpoint:** `GET /`
- **Description:** Fetches all digital tickets owned by the logged-in attendee (Upcoming & Past).

### Get Ticket Details (Attendee Only)
- **Endpoint:** `GET /:ticketId`
- **Description:** Fetches specific ticket details including the scannable QR code (Base64).

### Ticket Check-In (Organizer/Admin)
- **Endpoint:** `POST /check-in`
- **Description:** Validates a ticket at the door using the validation token found in the QR code.
- **Request Body:**
  ```json
  {
    "ticketToken": "secure_validation_token_from_qr",
    "eventId": "event_mongodb_id"
  }
  ```

---

## 5. System

### Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies the server status.
