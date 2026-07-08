const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');

const { errorHandler } = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');
const passport = require('./config/passport');
const routes = require('./routes');

const app = express();

app.use(passport.initialize());

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5501',
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', globalLimiter, routes);

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bluefage Events API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    header { text-align: center; padding: 3rem 0; border-bottom: 1px solid #1e293b; margin-bottom: 2rem; }
    header h1 { font-size: 2.5rem; background: linear-gradient(135deg, #f59e0b, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
    header p { color: #94a3b8; font-size: 1.1rem; }
    .status-card { background: #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
    .status-card .badge { background: #22c55e; color: #fff; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .status-card .info { color: #94a3b8; font-size: 0.9rem; }
    .section-title { font-size: 1.3rem; font-weight: 600; margin: 2rem 0 1rem; color: #f59e0b; }
    .endpoint { background: #1e293b; border: 1px solid #334155; border-radius: 8px; margin-bottom: 0.75rem; overflow: hidden; transition: all 0.2s; }
    .endpoint:hover { border-color: #f59e0b; }
    .endpoint-summary { display: flex; align-items: center; padding: 1rem 1.2rem; cursor: pointer; gap: 1rem; }
    .method { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; min-width: 60px; text-align: center; }
    .method.get { background: #1e3a5f; color: #60a5fa; }
    .method.post { background: #1a3a2a; color: #4ade80; }
    .method.put { background: #3a2a1a; color: #fbbf24; }
    .method.patch { background: #2a1a3a; color: #c084fc; }
    .method.delete { background: #3a1a1a; color: #f87171; }
    .path { font-family: 'Fira Code', monospace; font-size: 0.9rem; color: #e2e8f0; flex: 1; }
    .auth-badge { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 10px; background: #334155; color: #94a3b8; }
    .auth-badge.admin { background: #3a1a1a; color: #f87171; }
    .auth-badge.public { background: #1a3a2a; color: #4ade80; }
    .endpoint-details { display: none; padding: 0 1.2rem 1rem; }
    .endpoint-details.open { display: block; }
    .endpoint-details p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .endpoint-details pre { background: #0f172a; padding: 0.8rem; border-radius: 6px; font-size: 0.8rem; color: #94a3b8; overflow-x: auto; }
    footer { text-align: center; padding: 2rem 0; color: #475569; font-size: 0.85rem; border-top: 1px solid #1e293b; margin-top: 2rem; }
    footer a { color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Bluefage Events API</h1>
      <p>RESTful backend for event management platform</p>
    </header>

    <div class="status-card">
      <div>
        <div style="font-weight:600;margin-bottom:0.25rem;">API Status</div>
        <div class="info">Environment: ${process.env.NODE_ENV || 'development'} &middot; ${new Date().toISOString()}</div>
      </div>
      <span class="badge">Operational</span>
    </div>

    <div class="section-title">Authentication</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/auth/register</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Register a new user.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/auth/login</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Login and receive JWT token.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/auth/refresh</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Refresh expired JWT token.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/auth/logout</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Logout and invalidate refresh token.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/auth/me</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Get currently authenticated user profile.</p></div>
    </div>

    <div class="section-title">Bookings</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/bookings</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all bookings (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/bookings/mine</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Get current user's bookings.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/bookings</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Create a new booking.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/bookings/:id</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Get a single booking by ID.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/bookings/:id</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Update a booking.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/bookings/:id/status</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update booking status (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/bookings/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a booking (admin).</p></div>
    </div>

    <div class="section-title">Packages</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/packages</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get visible/published packages.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/packages/all</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all packages including hidden (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/packages/:id</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get a single package by ID.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/packages</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Create a new package.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/packages/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update a package.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/packages/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a package.</p></div>
    </div>

    <div class="section-title">Gallery</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/gallery</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get published gallery items.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/gallery</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Add a new gallery item (multipart).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/gallery/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update a gallery item.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/gallery/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a gallery item.</p></div>
    </div>

    <div class="section-title">Blogs</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/blogs</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get published blogs.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/blogs/all</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all blogs including drafts (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/blogs/:slug</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get a single blog by slug.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/blogs</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Create a new blog post.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/blogs/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update a blog post.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/blogs/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a blog post.</p></div>
    </div>

    <div class="section-title">Testimonials</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/testimonials</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Get approved testimonials.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/testimonials/all</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all testimonials (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/testimonials</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Submit a testimonial.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/testimonials/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update a testimonial (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/testimonials/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a testimonial (admin).</p></div>
    </div>

    <div class="section-title">Quotes</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/quotes</span><span class="auth-badge">auth</span>
      </div>
      <div class="endpoint-details"><p>Request a quote.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/quotes</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all quotes.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/quotes/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get a single quote.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/quotes/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update a quote.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/quotes/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a quote.</p></div>
    </div>

    <div class="section-title">Contact</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/contacts</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Submit a contact form.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/contacts</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all contact submissions.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method put">PUT</span><span class="path">/api/contacts/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Update contact status.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method delete">DEL</span><span class="path">/api/contacts/:id</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Delete a contact submission.</p></div>
    </div>

    <div class="section-title">Newsletter</div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/newsletter</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Subscribe to newsletter.</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method get">GET</span><span class="path">/api/newsletter</span><span class="auth-badge admin">admin</span>
      </div>
      <div class="endpoint-details"><p>Get all subscribers (admin).</p></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-summary" onclick="this.nextElementSibling.classList.toggle('open')">
        <span class="method post">POST</span><span class="path">/api/newsletter/unsubscribe/:email</span><span class="auth-badge public">public</span>
      </div>
      <div class="endpoint-details"><p>Unsubscribe from newsletter.</p></div>
    </div>

    <footer>
      <p><a href="https://bluefageevents.com" target="_blank">Bluefage Events</a> &middot; Built with Express &middot; PostgreSQL &middot; Prisma</p>
    </footer>
  </div>

  <script>
    document.querySelectorAll('.endpoint-summary').forEach(el => {
      el.addEventListener('click', function() {
        const details = this.nextElementSibling;
        details.classList.toggle('open');
      });
    });
  </script>
</body>
</html>`);
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bluefage Events API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
