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

CampusLoop includes comprehensive end-to-end automated test suites for backend authentication, security, marketplace discovery, and listing lifecycle management:

```powershell
# Run all server tests (Auth + Marketplace Discovery + Phase 4 Exchanges & Workflows):
npm run test:server

# Or run individual test suites from the server folder:
cd server
npm run test:auth          # 23 Authentication & JWT assertions
npm run test:marketplace   # 30 Marketplace & Discovery assertions
npm run test:exchange      # 24 Exchange Requests, Workflows & Concurrency assertions
```

### Complete Test Suite Coverage (77 Assertions Total):

#### 1. Authentication & Security (23 Assertions):
- [x] Health endpoint status check (`GET /api/health`)
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

#### 2. Phase 3 Marketplace, Ownership & Discovery (30 Assertions):
- [x] Authenticated listing creation returns `201 Created`
- [x] Listing title, category, condition, and campus match
- [x] Initial listing status defaults to `available`
- [x] Automatic carbon offset (CO₂ kg saved) calculation on creation
- [x] Unauthenticated listing creation rejection (`401 Unauthorized`)
- [x] Validation rejection for titles < 3 characters or descriptions < 10 characters (`400 Bad Request`)
- [x] Course Swap listing creation with `desiredItems` and automatic $0 selling price
- [x] Public listing detail retrieval (`GET /api/listings/:id`)
- [x] Owner successfully updates listing details (`PUT /api/listings/:id`)
- [x] Non-owner updating listing rejected with `403 Forbidden` (ownership enforcement)
- [x] Owner updates availability status to `reserved` (`PATCH /api/listings/:id/status`)
- [x] Exchange request rejection on unavailable/reserved/completed items (`400 Bad Request`)
- [x] Non-owner deleting listing rejected with `403 Forbidden`
- [x] Owner successfully deletes listing (`DELETE /api/listings/:id`)
- [x] Deleted listing returns `404 Not Found`
- [x] Filtered discovery query returns `200 OK` with pagination metadata
- [x] Full-text search across titles, descriptions, and course tags
- [x] Price range filtering (`minPrice`, `maxPrice`) for Sell listings

#### 3. Phase 4 Exchange Requests, Donations & Concurrency (24 Assertions):
- [x] Created 3 distinct student accounts for multi-student workflow testing
- [x] Prevent self-requests on own listings (`400 Bad Request` with `SELF_REQUEST_FORBIDDEN`)
- [x] Swap request requires offering an available item (`400 Bad Request` with `OFFERED_ITEM_REQUIRED`)
- [x] Offering an item not owned by requester returns `403 Forbidden` (`NOT_OFFERED_ITEM_OWNER`)
- [x] Valid swap proposal creation returns `201 Created`
- [x] Duplicate active request prevention returns `409 Conflict` (`DUPLICATE_ACTIVE_REQUEST`)
- [x] Give Away request without offered item returns `201 Created`
- [x] Sell inquiry meetup request returns `201 Created` (without fake payment claim)
- [x] Requester can cancel pending request (`PATCH /api/exchanges/:id/cancel`)
- [x] Non-requester cancelling request rejected with `403 Forbidden`
- [x] Non-owner accepting request rejected with `403 Forbidden`
- [x] Owner accepts swap request: status becomes `accepted`
- [x] Accepting swap request consistently reserves **both target and offered listings** (`status: 'reserved'`)
- [x] Simultaneous conflicting reservation blocked when item is already reserved (`409 Conflict` with `LISTING_ALREADY_RESERVED`)
- [x] Request creation on reserved item rejected (`400 Bad Request` with `ITEM_UNAVAILABLE`)
- [x] Owner can decline pending request with optional polite reason (`PATCH /api/exchanges/:id/reject`)
- [x] Handover confirmation & completion marks request as `completed` (`PATCH /api/exchanges/:id/complete`)
- [x] Completed exchange updates associated listings to `completed` and awards +50 Eco-Karma
- [x] Fetch incoming proposals for owner returns filtered list (`GET /api/exchanges?role=incoming`)
- [x] Fetch outgoing requests for requester returns filtered list (`GET /api/exchanges?role=outgoing`)
- [x] In-app notifications automatically dispatched to student for all lifecycle events (`GET /api/notifications`)
- [x] Mark notification as read updates status (`PATCH /api/notifications/:id/read`)

#### 4. Phase 5 Sustainability Impact & Circular Swap Finder (15 Assertions):
- [x] Authenticate demo students (Maya Lin, Samira Rodriguez, Alex Chen)
- [x] Sustainability impact endpoint returns documented LCA assumptions (`GET /api/stats/impact`)
- [x] Clearly labels estimates as estimates (`isEstimated: true`, `methodologyVersion: '2026.1-campusloop-lca'`)
- [x] Strict data segregation: available and in-flight listings are strictly excluded from completed reuse count
- [x] Student money saved calculated strictly from stored completed catalog data
- [x] Campus reuse leaderboard returns ranked recyclers by completed items and Eco-Karma (`GET /api/stats/leaderboard`)
- [x] Discovers valid 3-way triangular exchange cycles ($A \to B \to C \to A$) with transparent match reasons
- [x] Discovers valid 2-way direct swap cycles ($A \leftrightarrow B$) with affinity scores
- [x] Matches are suggestions only: items in prospective cycles remain available and unreserved
- [x] Proposing circular cycle creates proposal with initiator accepted and others pending consent
- [x] In-app notifications delivered to all loop participants requesting explicit consent
- [x] Participant decline safely transitions proposal to declined without reserving or modifying any items
- [x] Item availability revalidation: automatically aborts and marks proposal expired if any item becomes unavailable
- [x] Full multi-party acceptance: proposal confirms only when all participants explicitly consent
- [x] Circular loop finalization updates all associated items to `completed` and awards Eco-Karma to all participants

---

## 📡 Complete API Endpoint Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new student with bcrypt hashing & collegiate domain check |
| `POST` | `/api/auth/login` | No | Login student and return signed JWT token |
| `GET` | `/api/auth/me` | **Yes (Bearer JWT)** | Fetch authenticated student profile |
| `PUT` | `/api/auth/profile` | **Yes (Bearer JWT)** | Update profile (department, year, campus, avatar) |
| `POST` | `/api/auth/verify-college` | **Yes (Bearer JWT)** | Verify collegiate status via campus ID code |
| `POST` | `/api/auth/logout` | No | Invalidate/confirm logout session |

### Marketplace Discovery & Listing Routes (`/api/listings`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/listings` | No | Discover items with search, category, type, condition, price range, sorting, and pagination |
| `GET` | `/api/listings/:id` | No | Get single listing details with seller profile & safe-zone info |
| `POST` | `/api/listings` | **Yes (Bearer JWT)** | Create new item listing (Swap, Give Away, or Sell) |
| `PUT` | `/api/listings/:id` | **Yes (Owner Only)** | Update listing details (enforces owner `403 Forbidden` check) |
| `PATCH` | `/api/listings/:id/status` | **Yes (Owner Only)** | Update availability status (`available`, `reserved`, `completed`) |
| `DELETE` | `/api/listings/:id` | **Yes (Owner Only)** | Delete item listing (enforces owner `403 Forbidden` check) |
| `POST` | `/api/listings/:id/request-exchange` | Optional / Bearer | Submit meetup proposal (rejected if item is reserved or completed) |
| `GET` | `/api/listings/categories` | No | Category metadata with environmental offset metrics |

### Exchange Requests & Workflows (`/api/exchanges`) — Phase 4
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/exchanges` | **Yes (Bearer JWT)** | Submit new proposal: Swap (with offered item), Give Away (free item claim), or Sell (cash inquiry) |
| `GET` | `/api/exchanges` | **Yes (Bearer JWT)** | List user exchange requests (supports `?role=incoming\|outgoing\|all&status=pending\|accepted...`) |
| `GET` | `/api/exchanges/:id` | **Yes (Party Only)** | Get request details, status history, and handover confirmation state |
| `PATCH` | `/api/exchanges/:id/accept` | **Yes (Owner Only)** | Accept proposal; reserves target item and offered swap item consistently |
| `PATCH` | `/api/exchanges/:id/reject` | **Yes (Owner Only)** | Decline proposal with optional reason (notifies requester) |
| `PATCH` | `/api/exchanges/:id/cancel` | **Yes (Requester Only)**| Cancel pending proposal |
| `PATCH` | `/api/exchanges/:id/complete` | **Yes (Party Only)** | Confirm handover; marks request & listings `completed`, awards +50 Eco-Karma |

### Circular Swap Finder & Multi-Party Loops (`/api/circular-swap`) — Phase 5
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/circular-swap/suggestions` | Optional / Bearer | Discover 2-way and 3-way exchange cycles among available listings with match explanations |
| `POST` | `/api/circular-swap/propose` | **Yes (Bearer JWT)** | Initiate formal proposal for a suggested cycle; sets initiator consent to `accepted` |
| `GET` | `/api/circular-swap/proposals` | **Yes (Bearer JWT)** | List all circular proposals involving the current authenticated student |
| `GET` | `/api/circular-swap/proposals/:id` | **Yes (Bearer JWT)** | Get proposal details, participant consent status map, and transfer steps |
| `POST` | `/api/circular-swap/proposals/:id/respond`| **Yes (Bearer JWT)** | Explicit consent (`accepted` or `declined`). Revalidates item availability before confirming |

### In-App Student Notifications (`/api/notifications`) — Phase 4 & 5
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | **Yes (Bearer JWT)** | Fetch persistent student notifications and unread count |
| `PATCH` | `/api/notifications/:id/read` | **Yes (Bearer JWT)** | Mark specific notification as read |
| `PATCH` | `/api/notifications/read-all` | **Yes (Bearer JWT)** | Mark all student notifications as read |

### Sustainability Impact & Health Routes (`/api/stats`, `/api/health`) — Phase 5
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | No | Legacy aggregated stats endpoint |
| `GET` | `/api/stats/impact` | No | Detailed sustainability dashboard: completed-only metrics, active catalog counts, documented LCA benchmarks |
| `GET` | `/api/stats/leaderboard` | No | Ranked campus recyclers leaderboard by completed items reused and Eco-Karma score |
| `GET` | `/api/health` | No | API health, uptime & database connectivity check |

