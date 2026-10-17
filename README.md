# CodeAvengers — CampusLoop: Campus Exchange & Reuse Marketplace

> **Sustainability Hackathon — Phase 2: Authentication & MongoDB Integration**  
> An eco-conscious, hyper-local circular reuse platform connecting university students to buy, sell, donate, and exchange textbooks, lab essentials, calculators, and study supplies while shrinking the collegiate carbon footprint.

---

## 🌍 Sustainability Mission

Every semester, thousands of dollars worth of functional course gear (textbooks, lab coats, graphing calculators, and drafting equipment) ends up in student dumpsters or sits idle in dorm closets. Simultaneously, incoming students face exorbitant bookstore prices.

**CampusLoop** solves both issues through a closed-loop peer exchange:
- **Diverts Solid Waste:** Keeps reusable materials out of local municipal landfills.
- **Avoids Supply-Chain Carbon:** Spares manufacturing and shipping emissions for newly produced goods.
- **Puts Wealth Back in Students' Pockets:** Slashes textbook and lab kit costs by 60%–100%.
- **Guarantees Campus Safety:** Restricts listings to verified campus students and routes meetups through well-lit, public Safe Exchange Zones.

---

## 🎨 Design System & Theme

Built with a sustainability-forward visual identity:
- **Forest Green (`#1b4634`, `#15392b`):** Grounded, trustworthy, nature-aligned anchor.
- **Sage Green (`#5e8c64`, `#a7c6ab`, `#cddfcf`):** Fresh, soft organic accents and badges.
- **Off-White / Cream (`#f9f9f6`, `#f3f2eb`):** Clean, warm paper-inspired neutral backgrounds.
- **Typography:** Modern, legible sans-serif using **Plus Jakarta Sans**.

---

## 📦 Project Architecture (Phase 2)

```
CampusLoop/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx      # Responsive nav with dynamic verification checkmark & ticker
│   │   │   ├── Footer.jsx      # Eco-mission footer with safety guidelines
│   │   │   ├── ItemCard.jsx    # Reusable card with carbon offset badge & seller status
│   │   │   └── ItemDetailModal.jsx # Rich item modal with campus pickup form
│   │   ├── pages/              # Routed Views
│   │   │   ├── LandingPage.jsx       # Mission hero, live impact scoreboard, CTAs
│   │   │   ├── MarketplacePage.jsx   # Search, category pills, type tabs, sorting
│   │   │   ├── ItemDetailPage.jsx    # Deep-linkable item page layout
│   │   │   ├── CreateListingPage.jsx # Form with live carbon savings calculator
│   │   │   ├── AuthPage.jsx          # Live JWT login/register + validation alerts + demo shortcuts
│   │   │   └── DashboardPage.jsx     # Personal Eco-Karma, verified status, listings, pickup proposals
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Global state, JWT storage, backend auth sync, notifications
│   │   ├── data/
│   │   │   └── sampleData.js   # Client fallback sample dataset & demo profile
│   │   ├── App.jsx             # React Router route registry
│   │   ├── index.css           # Tailwind directives & eco utilities
│   │   └── main.jsx
│   ├── tailwind.config.js      # Custom forest/sage/offwhite theme palette
│   ├── vite.config.js          # Vite config with API proxy to port 5000
│   └── package.json
│
├── server/                     # Express + MongoDB + Mongoose Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose connection manager with offline resilience
│   │   ├── models/
│   │   │   ├── User.js         # Mongoose User model with bcrypt hashing & college domain check
│   │   │   └── Listing.js      # Mongoose Listing model with eco metrics & location
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # JWT protection middleware for private routes
│   │   │   └── optionalAuthMiddleware.js # Extracts user if token present without blocking guests
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, profile, verification, logout
│   │   │   ├── listingController.js # Listing retrieval, creation, category APIs
│   │   │   └── statsController.js   # Sustainability impact calculations
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # /api/auth
│   │   │   ├── listingRoutes.js # /api/listings
│   │   │   └── statsRoutes.js   # /api/stats
│   │   ├── services/
│   │   │   ├── listingStore.js      # Mongoose-backed repository with memory fallback
│   │   │   └── inMemoryUserStore.js # In-memory user repository for zero-setup local dev
│   │   ├── scripts/
│   │   │   └── seed.js         # Documented seed script for demo accounts & realistic listings
│   │   ├── utils/
│   │   │   └── token.js        # JWT generation and verification helpers
│   │   └── server.js           # Express app, CORS, error handling, health check
│   ├── tests/
│   │   └── auth.test.js        # 23-assertion automated auth & protected routes test suite
│   ├── .env.example            # Documented environment variable template (no real secrets)
│   ├── .env                    # Local development configuration
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🎓 College Verification Policy

> **"Do not falsely label users as college-verified without implementing verification."**

CampusLoop enforces transparent, real verification:
1. **Collegiate Domain Check:**  
   During registration, the backend checks whether the user's email ends in an accredited academic institution domain:
   - Matches: `.edu`, `.ac.uk`, `.edu.in`, `.ac.in`, `.edu.*`, `.ac.*`, or `@campus.edu`.
   - **Result:** `isCollegeVerified: true`, `verificationStatus: 'verified'`, `verificationMethod: 'institutional_email'`. Displays the green **`.edu Verified Student`** shield.
2. **Generic Email Accounts:**  
   Users who sign up with non-collegiate email addresses (`@gmail.com`, `@yahoo.com`, etc.):
   - **Result:** `isCollegeVerified: false`, `verificationStatus: 'unverified'`, `verificationMethod: 'none'`.
   - Displays an amber **`⚠️ Unverified Student`** badge.
   - Provides an interactive verification prompt in the Student Dashboard where users can enter their verified campus student ID code to upgrade their trust status.

---

## 🔑 Environment Variables Setup

Configuration parameters are stored in `server/.env`. A clean template is provided in `server/.env.example`:

```bash
# server/.env.example
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/campusloop

# JWT Authentication Secret and Expiration
JWT_SECRET=replace_with_a_secure_random_secret_in_production
JWT_EXPIRES_IN=7d

# CORS Allowed Client URL
CLIENT_URL=http://localhost:5173
```

---

## 👥 Demo Accounts & Seeding Workflow

To populate MongoDB with realistic demo accounts and sample campus exchange listings:

```powershell
# From project root:
npm run seed

# Or from server directory:
cd server
npm run seed
```

### Pre-Seeded Accounts:

| Role | Email | Password | Verification Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Verified Student** | `s.rodriguez@campus.edu` | `CampusLoop2026!` | ✅ Verified (`.edu`) | 485 Karma, 8 items reused |
| **Verified Student** | `maya.lin@campus.edu` | `CampusLoop2026!` | ✅ Verified (`.edu`) | Biology pre-med donor |
| **Unverified Student** | `guest.student@gmail.com` | `CampusLoop2026!` | ⚠️ Unverified (`gmail`) | Demonstrates accurate unverified handling |

> **Tip:** The Login page includes **1-Click Test Buttons** that instantly sign in with either the verified student or the unverified account.

---

## 🚀 Running the Project

### Option 1: Quick Start (Two Terminals)

#### Terminal 1 — Start the Backend (Port 5000):
```powershell
cd server
npm install
npm run dev
```

#### Terminal 2 — Start the Frontend (Port 5173):
```powershell
cd client
npm install
npm run dev
```

Visit the app at: **`http://localhost:5173`**

---

### Option 2: Run from Root Directory

```powershell
# 1. Install all dependencies
npm run install:all

# 2. Seed database (optional, when MongoDB is active)
npm run seed

# 3. Start backend in Terminal 1
npm run dev:server

# 4. Start frontend in Terminal 2
npm run dev:client
```

---

## 🧪 Automated Testing

CampusLoop includes an end-to-end automated test suite for backend authentication, password hashing, JWT issuance, college verification checks, and protected routes:

```powershell
# From project root:
npm run test:server

# Or from server directory:
cd server
npm test
```

### Test Suite Coverage (23 Assertions):
- [x] Health endpoint status check
- [x] Student registration with collegiate `.edu` email (`isCollegeVerified === true`)
- [x] Student registration with personal email (`isCollegeVerified === false`)
- [x] Duplicate email registration rejection (`409 Conflict`)
- [x] Invalid inputs rejection (`400 Bad Request`)
- [x] Successful login with valid credentials & JWT issuance
- [x] Wrong password rejection (`401 Unauthorized`)
- [x] Non-existent email rejection (`401 Unauthorized`)
- [x] Protected route access with valid Bearer JWT (`GET /api/auth/me`)
- [x] Protected route rejection without token (`401 Unauthorized`)
- [x] Protected route rejection with corrupted token (`401 Unauthorized`)
- [x] Profile update via protected route (`PUT /api/auth/profile`)
- [x] Logout confirmation (`POST /api/auth/logout`)

---

## 📡 Complete API Endpoint Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new student with bcrypt hashing & domain check |
| `POST` | `/api/auth/login` | No | Login student and return signed JWT token |
| `GET` | `/api/auth/me` | **Yes (Bearer JWT)** | Fetch authenticated student profile |
| `PUT` | `/api/auth/profile` | **Yes (Bearer JWT)** | Update profile (department, year, campus, avatar) |
| `POST` | `/api/auth/verify-college` | **Yes (Bearer JWT)** | Verify collegiate status via campus ID or .edu email |
| `POST` | `/api/auth/logout` | No | Confirm logout |

### Marketplace & Impact Routes
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | No | API health & database connection status |
| `GET` | `/api/listings` | No | Browse items with search, category, type, and sort filters |
| `GET` | `/api/listings/:id` | No | Get single listing details |
| `POST` | `/api/listings` | Optional | Post sustainable item (attaches authenticated seller if logged in) |
| `GET` | `/api/listings/categories` | No | Category metadata with CO₂ offset rates |
| `GET` | `/api/stats` | No | Live aggregated campus impact scoreboard |
