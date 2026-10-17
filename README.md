# CodeAvengers — CampusLoop: Campus Exchange & Reuse Marketplace

> **Sustainability Hackathon — Phase 1 Prototype by Team CodeAvengers**  
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

## 📦 Project Architecture

```
CampusLoop/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx      # Responsive nav with impact ticker & mobile drawer
│   │   │   ├── Footer.jsx      # Eco-mission footer with safety guidelines
│   │   │   ├── ItemCard.jsx    # Reusable card with carbon offset badge & prices
│   │   │   └── ItemDetailModal.jsx # Rich item modal with campus pickup form
│   │   ├── pages/              # Routed Views
│   │   │   ├── LandingPage.jsx       # Mission hero, live impact scoreboard, CTAs
│   │   │   ├── MarketplacePage.jsx   # Search, category pills, type tabs, sorting
│   │   │   ├── ItemDetailPage.jsx    # Deep-linkable item page layout
│   │   │   ├── CreateListingPage.jsx # Form with live carbon savings calculator
│   │   │   ├── AuthPage.jsx          # Login/Register UI + 1-Click Demo Sign-In
│   │   │   └── DashboardPage.jsx     # Personal Eco-Karma, listings, pickup requests
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Global state, backend sync, wishlist, notifications
│   │   ├── data/
│   │   │   └── sampleData.js   # Client fallback sample dataset & demo profile
│   │   ├── App.jsx             # React Router route registry
│   │   ├── index.css           # Tailwind directives & eco utilities
│   │   └── main.jsx
│   ├── tailwind.config.js      # Custom forest/sage/offwhite theme palette
│   ├── vite.config.js          # Vite config with API proxy to port 5000
│   └── package.json
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── data/               # Isolated Demo/Sample Data Sources
│   │   │   ├── categories.js   # Campus categories with carbon multipliers
│   │   │   └── sampleListings.js # High-fidelity sample listings (textbooks, tech, lab gear)
│   │   ├── services/
│   │   │   └── listingStore.js # Data-access repository isolating sample data from DB
│   │   ├── controllers/
│   │   │   ├── listingController.js # Listing retrieval, creation, category APIs
│   │   │   └── statsController.js   # Sustainability impact calculations
│   │   ├── routes/
│   │   │   ├── listingRoutes.js # /api/listings
│   │   │   └── statsRoutes.js   # /api/stats
│   │   └── server.js           # Express app, CORS, error handling, health check
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

### 🛡️ Clean Separation of Demo vs. Real Database Data
In accordance with production best practices, demo/sample records are strictly isolated in `server/src/data/sampleListings.js`. The backend queries exclusively through `server/src/services/listingStore.js`. In Phase 2, this store will connect directly to MongoDB or PostgreSQL without altering route handlers or frontend contracts.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24)
- **npm**: v9.0.0 or higher

---

### Option 1: Quick Start (Two Terminals)

#### 1. Start the Backend API (Port 5000)
```powershell
cd server
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

#### 2. Start the Frontend Client (Port 5173)
```powershell
cd client
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

### Option 2: Run from Root Directory
From the project root (`CampusLoop/`):

```powershell
# Install both client and server dependencies
npm run install:all

# In Terminal 1 - start server:
npm run dev:server

# In Terminal 2 - start client:
npm run dev:client
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and server status |
| `GET` | `/api/listings` | Fetch listings (supports `?search=`, `?category=`, `?type=`, `?sort=`) |
| `GET` | `/api/listings/:id` | Fetch detailed listing by ID |
| `POST` | `/api/listings` | Create a new listing with instant carbon calculation |
| `GET` | `/api/listings/categories` | Retrieve categories with carbon offset factors |
| `GET` | `/api/stats` | Aggregated carbon, dollar, and tree metrics |

---

## ✨ Features Implemented in Phase 1

1. **Sustainability Landing Page:**
   - Hero with zero-waste mission and student trust badges.
   - Live carbon scoreboard: CO₂ averted (kg), student dollars saved ($), mature tree absorption equivalents, and total recirculated items.
   - Interactive 4-category equipment spotlights.
   - "How Circular Reuse Works" step-by-step explainer.

2. **Responsive Navigation & Footer:**
   - Sticky navbar with live sustainability ticker and mobile responsive drawer.
   - Quick filters, profile badge, and prominent "+ List an Item" CTA.
   - Footer with UN SDG #12 alignment, safe meeting zone policies, and campus pledges.

3. **Marketplace & Filter Suite:**
   - Instant search across titles, descriptions, course codes (e.g. `CHEM 111`, `BIOL 1101`), and buildings.
   - Horizontal category pill filters (Textbooks, Calculators, Lab Coats, Stationery, Dorm, Free Giveaways).
   - Exchange-type tabs (`All`, `For Sale`, `Free Giveaways 🎁`, `Trades / Swaps 🔄`).
   - Condition filter (`Like New`, `Good`, `Fair`).
   - Smart sorting: **Highest CO₂ Saved 🌱**, Price Low-to-High, Price High-to-Low, Newest.

4. **Reusable Item Cards & Detail Layout:**
   - Realistic sample listings covering **Textbooks** (Campbell Biology, Stewart Calculus), **Calculators** (TI-84 Plus CE, Casio ClassWiz), **Lab Coats & Goggles** (100% cotton PPE), and **Stationery** (Rotring Drafting Set, Micron Art Bundle).
   - Environmental footprint badges (`-14.2 kg CO₂`).
   - Campus Safe Exchange Zone location tags (Du Bois Library 2nd Fl, Engineering Commons, Science Lobby).
   - Pickup proposal form with preset time slots (`Today after 3 PM`, `Tomorrow @ 11 AM`).

5. **Create Listing Flow:**
   - Category picker with dynamic real-time CO₂ diversion preview.
   - Price vs original bookstore retail price comparison.
   - Safe campus meeting spot selector.
   - One-click realistic preset image selectors or custom image URL input.

6. **Authentication UI:**
   - Dedicated .edu student sign-in and registration tabs.
   - University sustainability pledge agreement.
   - **1-Click Demo Login** button for judges to test authenticated features without typing.

7. **Student Eco Dashboard:**
   - Personal Carbon Scorecard (`64.2 kg CO₂ diverted`, `$320 saved`, `485 Eco-Karma`).
   - Active listings management.
   - Saved items wishlist.
   - Pickup proposals preview with Accept/Reschedule actions.
   - Printable "Certificate of Circular Stewardship" badge.

---

## 🔮 Roadmap for Phase 2
- Persistent database integration (MongoDB Atlas / PostgreSQL via Prisma).
- University SSO (.edu OAuth / SAML).
- WebSockets for real-time buyer-seller safe meetup coordination.
- Automated OCR scanning of textbook ISBN codes for instantaneous listing creation.
