# CodeAvengers — CampusLoop: Collegiate Exchange & Reuse Marketplace

> **Campus Sustainability Hackathon 2026 — Phase 6: End-to-End Reliability, Testing & Demonstration Guide**  
> An eco-conscious, hyper-local circular reuse platform connecting university students to buy, sell, donate, and exchange textbooks, lab essentials, calculators, and study supplies while shrinking the collegiate carbon footprint.

---

## 🌍 Sustainability Mission & Core Value

Every semester, thousands of dollars worth of functional course gear (textbooks, lab coats, graphing calculators, and drafting equipment) ends up in student dumpsters or sits idle in dorm closets. Simultaneously, incoming students face exorbitant bookstore prices.

**CampusLoop** solves both issues through a closed-loop collegiate peer exchange:
- **Diverts Solid Waste:** Keeps reusable materials out of local municipal landfills.
- **Avoids Supply-Chain Carbon:** Spares manufacturing and shipping emissions for newly produced goods.
- **Puts Wealth Back in Students' Pockets:** Slashes textbook and lab kit costs by 60%–100%.
- **Guarantees Campus Safety:** Restricts listings to verified campus students and routes meetups through well-lit, public Safe Exchange Zones.
- **Enables Multi-Party Circular Swaps:** Discovers 2-way and 3-way circular trade loops ($A \to B \to C \to A$) when direct 1-to-1 trades are blocked.

---

## 🎨 Design System & Theme

Built with a sustainability-forward visual identity:
- **Forest Green (`#1b4634`, `#15392b`):** Grounded, trustworthy, nature-aligned anchor.
- **Sage Green (`#5e8c64`, `#a7c6ab`, `#cddfcf`):** Fresh, soft organic accents and badges.
- **Off-White / Cream (`#f9f9f6`, `#f3f2eb`):** Clean, warm paper-inspired neutral backgrounds.
- **Typography:** Modern, legible sans-serif using **Plus Jakarta Sans**.

---

## 🛠️ Prerequisites & System Requirements

Before running CampusLoop locally, ensure your machine has:
- **Node.js:** v18.0.0 or higher (v20+ / v24+ recommended)
- **npm:** v9.0.0 or higher
- **MongoDB (Optional):** Local MongoDB instance or MongoDB Atlas cluster.
  - *Zero-Friction Fallback:* If MongoDB is not running or unreachable, CampusLoop automatically activates its **In-Memory Resilient Repository**, allowing 100% of authentication, marketplace discovery, exchange workflows, and circular swaps to function out of the box with zero external setup.
- **Operating System:** Windows, macOS, or Linux.

---

## 📦 Project Architecture

```
CampusLoop/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx      # Sticky nav with verification badge, notification drawer & loop link
│   │   │   ├── Footer.jsx      # Eco-mission footer with safety guidelines
│   │   │   ├── ItemCard.jsx    # Reusable card with carbon offset badge & seller status
│   │   │   └── ItemDetailModal.jsx # Quick-view modal with exchange proposal form
│   │   ├── pages/              # Routed Views
│   │   │   ├── LandingPage.jsx       # Mission hero, live impact scoreboard, CTAs
│   │   │   ├── MarketplacePage.jsx   # Search, category pills, type tabs, price filtering, sorting
│   │   │   ├── ItemDetailPage.jsx    # Full item page with swap item selector & safe meetup zones
│   │   │   ├── CreateListingPage.jsx # Form with live carbon savings calculator & desired items
│   │   │   ├── CircularSwapPage.jsx  # Multi-party circular swap loop visualizer & consent workflow
│   │   │   ├── ImpactPage.jsx        # Verified completed sustainability dashboard & leaderboard
│   │   │   ├── AuthPage.jsx          # Live JWT login/register + validation alerts + demo shortcuts
│   │   │   └── DashboardPage.jsx     # Eco-Karma, my listings, incoming/outgoing exchange requests
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Global state, JWT storage, backend auth sync, notifications
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
│   │   │   ├── User.js             # Mongoose User model with bcrypt & college domain check
│   │   │   ├── Listing.js          # Mongoose Listing model with eco metrics & location
│   │   │   ├── ExchangeRequest.js  # Mongoose model for Swap, Giveaway, and Sell workflows
│   │   │   ├── CircularProposal.js # Mongoose model for multi-party exchange loops & consents
│   │   │   └── Notification.js     # Mongoose model for persistent student in-app notifications
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT protection (`protect`) and guest-tolerant (`optionalAuth`)
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, login, profile, verification, logout
│   │   │   ├── listingController.js      # Listing CRUD, search, filter, categories
│   │   │   ├── exchangeController.js     # Exchange requests, accept, reject, cancel, complete
│   │   │   ├── circularSwapController.js # Cycle discovery, proposal creation, consent response
│   │   │   ├── notificationController.js # Notifications and mark-as-read
│   │   │   └── statsController.js        # Completed-only impact stats and leaderboard
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   ├── listingRoutes.js      # /api/listings
│   │   │   ├── exchangeRoutes.js     # /api/exchanges
│   │   │   ├── circularSwapRoutes.js # /api/circular-swap
│   │   │   ├── notificationRoutes.js # /api/notifications
│   │   │   └── statsRoutes.js        # /api/stats
│   │   ├── services/
│   │   │   ├── listingStore.js       # Listing repository with search, filter & status logic
│   │   │   ├── exchangeStore.js      # Two-phase reservation, concurrency locks & handover
│   │   │   ├── circularSwapStore.js  # Transparent graph matching engine (2-way & 3-way cycles)
│   │   │   ├── statsStore.js         # Completed-only LCA benchmarks & reuse leaderboard
│   │   │   ├── notificationStore.js  # In-app notification dispatcher
│   │   │   └── inMemoryUserStore.js  # In-memory user store for zero-setup local dev
│   │   ├── scripts/
│   │   │   └── seed.js         # Seeding script for demo accounts & realistic listings
│   │   ├── utils/
│   │   │   └── token.js        # JWT generation and verification helpers
│   │   └── server.js           # Express app, CORS, error handling, health check
│   ├── tests/
│   │   ├── auth.test.js        # 23-assertion auth & JWT test suite
│   │   ├── marketplace.test.js # 30-assertion marketplace & discovery test suite
│   │   ├── exchange.test.js    # 24-assertion exchange requests & concurrency test suite
│   │   ├── circularSwap.test.js# 15-assertion circular loop & consent test suite
│   │   └── e2eJourneys.test.js # 20-assertion full end-to-end hackathon demo test suite
│   ├── .env.example            # Documented environment variable template (no real secrets)
│   ├── .env                    # Local development configuration
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

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
JWT_SECRET=campusloop_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d

# CORS Allowed Client URL
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB:** If MongoDB is running locally or an Atlas connection string is provided, Mongoose connects automatically. If MongoDB is offline, CampusLoop displays a friendly warning and operates via its built-in In-Memory Resilient Repository so development and evaluation never halt.

---

## 🚀 Installation & Quick Start

### Option 1: Run with Two Terminals (Recommended)

#### Terminal 1 — Start the Backend Server (Port 5000):
```powershell
cd server
npm install
npm start
```

#### Terminal 2 — Start the Frontend Client (Port 5173):
```powershell
cd client
npm install
npm run dev
```

Visit the app in your browser at: **`http://localhost:5173`**

---

### Option 2: Run from Root Directory

```powershell
# 1. Install all dependencies across client and server
npm run install:all

# 2. Seed database (optional, when MongoDB is active)
npm run seed

# 3. Start backend dev server
npm run dev:server

# 4. Start frontend dev server
npm run dev:client
```

---

## 👥 Demo Student Accounts

CampusLoop comes pre-configured with realistic student demo accounts for immediate testing:

| Student Name | Email | Password | Verification Status | Department & Year | Role / Demo Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Samira Rodriguez** | `s.rodriguez@campus.edu` | `CampusLoop2026!` | ✅ Verified (`.edu`) | Environmental Studies, Junior | Active seller & loop participant |
| **Maya Lin** | `maya.lin@campus.edu` | `CampusLoop2026!` | ✅ Verified (`.edu`) | Biological Sciences, Junior | Pre-Med donor & textbook swapper |
| **Alex Chen** | `alex.chen@campus.edu` | `CampusLoop2026!` | ✅ Verified (`.edu`) | Computer Science, Junior | 3-way circular loop participant |
| **Jordan Guest** | `guest.student@gmail.com`| `CampusLoop2026!` | ⚠️ Unverified (`gmail`) | General Studies, Freshman | Demonstrates unverified student ID prompt |

> **Convenience Feature:** The Login page (`/login`) includes **1-Click Test Buttons** that instantly sign in as either Maya, Samira, Alex, or the guest student without typing credentials.

---

## 🧪 Comprehensive Automated Testing (112 Total Assertions, 0 Failures)

CampusLoop includes **5 automated test suites** validating every layer of the application:

```powershell
# Run all 112 automated tests across all 5 test suites:
npm run test:server

# Or run individual test suites from the server folder:
cd server
npm run test:auth          # 23 Authentication & JWT assertions
npm run test:marketplace   # 30 Marketplace Discovery & Ownership assertions
npm run test:exchange      # 24 Exchange Requests, Workflows & Concurrency assertions
npm run test:circular      # 15 Circular Swap Finder & Consent assertions
npm run test:e2e           # 20 End-to-End Multi-Student Journey assertions
```

### Test Suite Summary:

| Test Suite | Assertions | Focus Areas | Result |
| :--- | :---: | :--- | :---: |
| `tests/auth.test.js` | 23 | Collegiate domain validation, bcrypt hashing, JWT issuance, protected routes, profile updates | ✅ 100% Pass |
| `tests/marketplace.test.js` | 30 | Item CRUD, ownership enforcement (403), search & filtering, pagination, status badges | ✅ 100% Pass |
| `tests/exchange.test.js` | 24 | Swap offering validation, duplicate prevention (409), two-phase reservation, handover confirmation | ✅ 100% Pass |
| `tests/circularSwap.test.js` | 15 | Graph cycle discovery (2-way and 3-way), participant consent, unavailable item abort | ✅ 100% Pass |
| `tests/e2eJourneys.test.js` | 20 | Complete multi-student end-to-end journey, giveaway claims, security protections, data leakage guards | ✅ 100% Pass |
| **Total Assertions** | **112** | **Full system coverage** | **✅ 112 Passed / 0 Failed** |

---

## 🎬 Step-by-Step Hackathon Demonstration Script

Follow this script to demonstrate all Phase 6 capabilities during an evaluation or presentation:

### Step 1: Student A Registration & Listing Creation
1. Open `http://localhost:5173/register`.
2. Register as **Student A** with an institutional `.edu` email (e.g., `studentA@campus.edu`). Notice the **`.edu Verified Student`** shield is immediately awarded.
3. Click **"List an Item"** (`/create`).
4. Create a **Swap** listing:
   - Title: `Organic Chemistry 8th Edition (Wade)`
   - Category: `Textbooks & Notes`
   - Listing Type: `Swap / Trade`
   - Desired Items: `Casio Scientific Calculator or Physics 131`
   - Notice the selling price automatically locks to **$0** and the real-time **Carbon Offset Calculator** computes ~10.4 kg CO₂ saved.
5. Click **"Publish Listing"**. The listing appears as `Available` with a green badge.

### Step 2: Student B Independent Session & Discovery
1. Open an **Incognito / Private browser window** (or second browser) and navigate to `http://localhost:5173/login`.
2. Click the **"Maya Lin"** or **"Samira Rodriguez"** 1-click login button, or register as `studentB@campus.edu`.
3. Navigate to **Marketplace** (`/marketplace`).
4. Type `Organic Chemistry` into the search bar and select the `Textbooks` filter. Student A's listing appears in the results.
5. Click on the item card to open the **Item Detail View**.

### Step 3: Swap Request Submission & Acceptance
1. In Student B's session, under **"Propose Exchange"**, select one of Student B's available items from the dropdown (e.g., `Casio fx-991EX Calculator`).
2. Choose a campus meetup spot (e.g., `Main Library 2nd Floor Safe Zone`) and enter a polite note.
3. Click **"Send Exchange Proposal"**.
4. Switch back to **Student A's browser session** and go to **Dashboard** (`/dashboard`).
5. Open the **"Exchange Requests"** tab. Under **"Incoming Proposals"**, Student B's proposal is visible with proposed swap items side-by-side.
6. Click **"Accept Proposal"**.
7. **Verify Consistent Reservation:** Both Student A's item and Student B's offered item now display amber **`Reserved`** badges. Attempting to submit a new exchange request on either item is automatically blocked by the server.

### Step 4: Handover Completion & Eco-Karma Award
1. In Student A's dashboard under **"Active Reservations"**, click **"Confirm Handover & Complete"**.
2. Both items transition to **`Completed`**.
3. Student A and Student B each receive a celebratory in-app notification and are awarded **+50 Eco-Karma**.
4. Navigate to **Campus Sustainability Dashboard** (`/impact`). Notice that the completed items are now tallied under **Actual Reused Items**, and estimated student savings and CO₂ avoided have updated!

### Step 5: Give Away (Donation) Flow
1. Student A lists an item with type **"Give Away"** (e.g., `Lab Safety Splash Goggles`).
2. Student B views the item and submits a pickup request **without needing to offer any item**.
3. Student A accepts and completes the handover.
4. Under `/impact`, the **Donated Items** counter increments.

### Step 6: Security & Unauthorized Action Testing
1. In Student B's session, attempt to edit or delete Student A's listing by navigating to `/item/:id`. Notice there are **no edit/delete buttons for non-owners**.
2. If Student B attempts to call `PUT /api/listings/:id` directly via API, the server returns `403 Forbidden` (`NOT_LISTING_OWNER`).
3. Attempting to submit an exchange request for one's own item returns `400 Bad Request` (`SELF_REQUEST_FORBIDDEN`).

### Step 7: Circular Swap Finder & Multi-Party Consent
1. Click **"Swap Finder"** (`/circular-swap`) in the navbar.
2. The transparent graph matching engine displays discovered multi-party loops:
   - **3-Way Loop:** Maya gives Calculus to Alex $\to$ Alex gives Drafting Set to Samira $\to$ Samira gives Casio Calculator to Maya!
   - **2-Way Swap:** Maya gives Molecular Model Kit $\leftrightarrow$ Samira gives Lab Goggles!
3. Notice that each transfer step displays a **transparent match explanation** (e.g. *`Desired: "Casio Calculator" matched listing title`*).
4. Notice the **Suggestions Only** banner: items in prospective loops remain `Available`.
5. Click **"Propose Circular Loop"**. An explicit consent proposal is created, setting the initiator to `accepted` and peers to `pending`.
6. Log in as a participating student and view **"My Loop Proposals"**:
   - Accepting updates participant consent status.
   - If any participant declines, the proposal safely cancels with **no items reserved**.
   - If an item becomes unavailable before all accept, the engine automatically aborts (`status: 'expired'`) with a revalidation notice.

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
| `POST` | `/api/exchanges` | **Yes (Bearer JWT)** | Submit new proposal: Swap (with offered item), Give Away (free claim), or Sell (meetup inquiry) |
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

---

## 🔧 Troubleshooting Guide

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Port 5000 or 5173 Already in Use** | Another server process is running on that port. | Kill existing Node processes: `Get-Process node \| Stop-Process -Force` (PowerShell) or change `PORT=5001` in `server/.env`. |
| **MongoDB Atlas Connection Timeout** | Your current IP address is not on the Atlas whitelist. | Add your IP (or `0.0.0.0/0` for development) in MongoDB Atlas $\to$ **Network Access** $\to$ **IP Access List**. CampusLoop will automatically use its in-memory repository until connected. |
| **CORS Error in Browser Console** | Frontend running on unexpected host/port. | Ensure the client is accessed via `http://localhost:5173`. The backend CORS policy is configured to allow `http://localhost:5173`, `http://127.0.0.1:5173`, and `CLIENT_URL`. |
| **Login Returns 401 Unauthorized** | Typed incorrect password or testing modified account. | Use the 1-click test buttons on `/login` or enter password `CampusLoop2026!` for all pre-seeded demo accounts. |
| **Swap Request Dropdown Empty** | Student B does not currently own any `available` listings. | Create an item listing first while logged in as Student B, or choose a Give Away listing which does not require an offered item. |

---

## 📋 Concise Phase 6 Final Report

### 1. Implemented Features:
- **Collegiate Authentication & Verification:** Bcrypt password hashing, JWT Bearer tokens, `.edu` domain verification with unverified student fallback and campus ID upgrade.
- **Full Marketplace Management:** Search by title/description, category filtering, condition filtering, listing type selection (Swap, Give Away, Sell), price filtering, sorting, pagination, and ownership-guarded editing/deletion.
- **Two-Phase Exchange & Handover Workflows:** Complete request creation, viewing, acceptance, polite rejection with reason, cancellation, consistent two-sided item reservations, and handover confirmation with Eco-Karma rewards.
- **Verified Sustainability Dashboard:** Completed-only metrics segregation, documented LCA environmental benchmarks (textbooks, tech, lab gear, stationery, water, trees) with explicit `isEstimated` labels, and a campus student reuse leaderboard.
- **Circular Swap Finder:** Graph cycle engine detecting 2-way and 3-way exchange loops ($A \to B \to C \to A$) with transparent affinity match explanations, suggestions-only safety notices, explicit multi-party consent, and pre-finalization availability revalidation.
- **In-App Notification Center:** Real-time event notifications for all request transitions, circular proposals, and handover completions.

### 2. Tested Features:
- **112 Automated Unit, Integration & End-to-End Test Assertions:**
  - 23 Auth & JWT tests (`auth.test.js`)
  - 30 Marketplace & Discovery tests (`marketplace.test.js`)
  - 24 Exchange Requests & Concurrency tests (`exchange.test.js`)
  - 15 Circular Swap Finder & Consent tests (`circularSwap.test.js`)
  - 20 End-to-End Multi-Student Journeys & Security tests (`e2eJourneys.test.js`)
- **Browser Subagent Visual Verification:** Tested `/marketplace`, `/item/:id`, `/circular-swap`, `/impact`, and `/dashboard` across desktop and responsive viewports.
- **Production Build:** Vite production bundle compiles in <1 second with zero warnings or errors.

### 3. Limitations & Future Scope:
- **Payment Gateway:** Sell listings currently use safe-zone in-person exchange rather than on-platform payment processing (clearly labeled with no fake payment claims). Future iterations can integrate Stripe Connect for collegiate peer escrow.
- **Push Notifications:** Currently implemented as in-app persistent notifications; future versions can integrate Web Push / Email alerts for off-platform notifications.
