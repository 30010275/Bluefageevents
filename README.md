# Bluefage Events

Event management website with Node.js/Express backend and vanilla HTML/CSS/JS frontend.

## Project Structure

```
├── index.html              # Home page (landing)
├── about.html              # About page
├── services.html           # Services page
├── gallery.html            # Gallery (loaded from API)
├── packages.html           # Packages (loaded from API)
├── testimonials.html       # Testimonials (loaded from API)
├── blog.html               # Blog listing + detail view (loaded from API)
├── booking.html            # Booking form (requires auth)
├── quote.html              # Quote request form (requires auth)
├── contact.html            # Contact form
├── css/style.css           # All styles
├── js/
│   ├── api.js              # API client (fetch wrapper, auth tokens)
│   └── main.js             # UI logic, dynamic data loading, form handlers
├── backend/                # Express API server
│   ├── src/
│   │   ├── server.js       # Entry point (port 4000)
│   │   ├── app.js          # Express app config (CORS, middleware)
│   │   ├── routes/         # Route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (auth, email, upload)
│   │   ├── middleware/     # Auth, rate limiting, validation, error handler
│   │   ├── validations/    # express-validator rules
│   │   ├── prisma/         # Schema (PostgreSQL) + seed script
│   │   ├── config/         # DB, multer, nodemailer config
│   │   └── utils/          # Helpers, JWT tokens
│   ├── .env.example        # Environment template
│   ├── package.json
│   └── README.md           # Backend-specific docs
```

## Backend Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Quick Start

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Copy environment file and edit if needed
cp .env.example .env

# Push schema to database and seed with admin user + packages
npm run prisma:push
npm run prisma:seed

# Start development server
npm run dev
```

### Admin Credentials

- **Email:** admin@bluefageevents.com
- **Password:** Admin@123456

### Default Port

- Backend API runs on **http://localhost:4000**

## Frontend-Backend Connection

### API Base URL

All frontend pages connect to the backend at `http://localhost:4000/api` via the API client in `js/api.js`.

### CORS

The backend is configured to accept requests from `http://localhost:5501` (configured in `backend/.env` as `FRONTEND_URL`). If you serve the frontend from a different port, update `FRONTEND_URL` in `backend/.env` and restart the backend.

### How Frontend Pages Load Data

| Page | Data Source | API Endpoint |
|------|-------------|-------------|
| Home (index.html) | API via `loadPackages()`, `loadTestimonials()`, `loadBlogs()`, `loadGallery()` | `GET /api/packages`, `GET /api/testimonials`, `GET /api/blogs`, `GET /api/gallery` |
| blog.html | API via `loadAllBlogs()` / `loadBlogPost(slug)` | `GET /api/blogs`, `GET /api/blogs/:slug` |
| gallery.html | API via `loadGallery()` | `GET /api/gallery` |
| packages.html | API via `loadPackages()` | `GET /api/packages` |
| testimonials.html | API via `loadTestimonials()` | `GET /api/testimonials` |

### How Forms Submit Data

| Form | Auth Required | API Endpoint |
|------|--------------|-------------|
| Contact form (#contact-form) | No | `POST /api/contacts` |
| Newsletter (#newsletter-form) | No | `POST /api/newsletter` |
| Booking form (#booking-form) | Yes (JWT token) | `POST /api/bookings` |
| Quote form (#quote-form) | Yes (JWT token) | `POST /api/quotes` |

### Authentication Flow

1. Click "Login" button (top nav, right side)
2. Login modal appears with Login/Register tabs
3. On success, JWT token is stored in `localStorage`
4. The button changes to "My Account" with a dropdown (Bookings, Quotes, Write Review, Logout)
5. All authenticated API requests include `Authorization: Bearer <token>` header

### Running the Frontend

Open any `.html` file directly in your browser, or use a local dev server:

```bash
# Using VS Code Live Server (recommended, port 5501)
# Or Python's built-in server
python3 -m http.server 5501
```

Then visit `http://localhost:5501`.

### API Documentation

Full API endpoint reference is in `backend/README.md`.

Standard response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```
