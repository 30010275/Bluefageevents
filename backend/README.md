# Bluefage Events - Backend API

Production-ready REST API built with Node.js, Express.js, and PostgreSQL for the Bluefage Events website.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing
- **File Upload:** Multer
- **Email:** Nodemailer
- **Validation:** express-validator
- **Security:** Helmet, CORS, Rate Limiting, Input Sanitization
- **Logging:** Morgan

## Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL 14+ running locally or remotely

### Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Set up your .env file (edit as needed)
cp .env.example .env

# Push schema to database and seed
npm run prisma:push
npm run prisma:seed

# Start development server
npm run dev
```

### Default Admin Credentials

- **Email:** `admin@bluefageevents.com`
- **Password:** `Admin@123456`

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js            # Server entry point
│   ├── config/              # Database, multer, nodemailer config
│   ├── controllers/         # Route handlers (MVC controllers)
│   ├── middleware/           # Auth, error handler, rate limiter, validation
│   ├── prisma/               # Schema and seed script
│   ├── routes/              # Route definitions
│   ├── services/            # Business logic (auth, email, upload)
│   ├── utils/               # Helpers and token utilities
│   ├── validations/         # express-validator rules
│   └── uploads/             # Uploaded images (gitignored)
├── .env                     # Environment variables
├── .env.example             # Template for environment variables
└── package.json
```

## API Endpoints

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| POST | `/api/auth/refresh` | - | Refresh access token |
| POST | `/api/auth/logout` | User | Logout user |
| GET | `/api/auth/me` | User | Get current user profile |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | User | Create booking |
| GET | `/api/bookings` | User/Admin | List bookings (filters: `status`, `eventType`, `page`, `limit`) |
| GET | `/api/bookings/mine` | User | Get current user's bookings |
| GET | `/api/bookings/:id` | User/Admin | Get single booking |
| PUT | `/api/bookings/:id/status` | Admin | Update booking status |
| PUT | `/api/bookings/:id` | Admin | Update booking |
| DELETE | `/api/bookings/:id` | Admin | Delete booking |

**Booking Statuses:** `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED`

### Quote Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/quotes` | User | Submit quote request |
| GET | `/api/quotes` | User/Admin | List quotes |
| GET | `/api/quotes/:id` | User/Admin | Get single quote |
| PUT | `/api/quotes/:id` | Admin | Update quote status/response |
| DELETE | `/api/quotes/:id` | Admin | Delete quote |

**Quote Statuses:** `PENDING`, `RESPONDED`, `COMPLETED`

### Contact Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contacts` | - | Submit contact form |
| GET | `/api/contacts` | Admin | List contacts |
| GET | `/api/contacts/:id` | Admin | Get contact message |
| PUT | `/api/contacts/:id` | Admin | Mark as read/archived |
| DELETE | `/api/contacts/:id` | Admin | Delete message |

**Contact Statuses:** `UNREAD`, `READ`, `ARCHIVED`

### Newsletter

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/newsletter` | - | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe/:email` | - | Unsubscribe |
| GET | `/api/newsletter` | Admin | List subscribers |

### Gallery

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/gallery` | - | List gallery (`?category=`) |
| POST | `/api/gallery` | Admin | Upload image (multipart) |
| PUT | `/api/gallery/:id` | Admin | Update image/caption |
| DELETE | `/api/gallery/:id` | Admin | Delete image |

### Blog

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | - | List published blogs (`?page=`, `?limit=`, `?search=`) |
| GET | `/api/blogs/:slug` | - | Get blog post by slug |
| GET | `/api/blogs/all` | Admin | List all blog posts |
| POST | `/api/blogs` | Admin | Create blog post |
| PUT | `/api/blogs/:id` | Admin | Update blog post |
| DELETE | `/api/blogs/:id` | Admin | Delete blog post |

### Testimonials

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/testimonials` | - | List approved testimonials |
| GET | `/api/testimonials/all` | Admin | List all testimonials |
| POST | `/api/testimonials` | User | Submit testimonial |
| PUT | `/api/testimonials/:id` | Admin | Approve/reject testimonial |
| DELETE | `/api/testimonials/:id` | Admin | Delete testimonial |

**Testimonial Statuses:** `PENDING`, `APPROVED`, `REJECTED`

### Packages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/packages` | - | List active packages |
| GET | `/api/packages/all` | Admin | List all packages |
| GET | `/api/packages/:id` | - | Get single package |
| POST | `/api/packages` | Admin | Create package |
| PUT | `/api/packages/:id` | Admin | Update package |
| DELETE | `/api/packages/:id` | Admin | Delete package |

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password is required" }
  ]
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

## Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Global API | 10,000 requests | 15 minutes |
| Auth endpoints | 20 requests | 15 minutes |
| Form submissions | 10 requests | 1 hour |

## Email Notifications

Automatic emails are sent for:
- Booking confirmation (to customer)
- Booking status update (approved/rejected)
- Quote request confirmation
- Newsletter subscription welcome

Configure SMTP settings in `.env` to enable email delivery. Emails are silently logged when SMTP is not configured.

## Frontend Integration

The API is CORS-enabled and returns standard JSON. Connect any HTML/CSS/JavaScript frontend using `fetch()` or Axios:

```javascript
// Login example
const res = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();

// Store token for subsequent requests
localStorage.setItem('token', data.data.accessToken);

// Authenticated request
const res = await fetch('http://localhost:4000/api/bookings', {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Environment Variables

See `.env.example` for all configurable variables. Key settings:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - JWT signing keys
- `SMTP_*` - Email configuration
- `FRONTEND_URL` - CORS origin
