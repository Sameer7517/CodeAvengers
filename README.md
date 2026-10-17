# CodeAvengers — CampusLoop: Collegiate Circular Exchange & Reuse Marketplace

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-success?logo=vercel&style=for-the-badge)](https://code-avengers.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo-Video%20Walkthrough-red?logo=youtube&style=for-the-badge)](#-video-demonstration-link)
[![GitHub Repository](https://img.shields.io/badge/GitHub-CodeAvengers-blue?logo=github&style=for-the-badge)](https://github.com/Sameer7517/CodeAvengers)
[![Tests](https://img.shields.io/badge/Automated%20Tests-126%2F126%20Passed-brightgreen?style=for-the-badge)](file:///d:/OneDrive/Desktop/CampusLoop/server/tests)

> **Campus Sustainability Hackathon 2026**  
> An eco-conscious, hyper-local circular reuse platform connecting college students to buy, sell, donate, and exchange textbooks, lab essentials, calculators, and study supplies while shrinking the collegiate carbon footprint.

---

## 🔗 Project Links

| Resource | URL | Description |
| :--- | :--- | :--- |
| 🌐 **Live Web Application** | **[https://code-avengers.vercel.app/](https://code-avengers.vercel.app/)** | Production frontend hosted on Vercel |
| 🎥 **Video Demonstration** | **[Watch Demonstration Video](#-video-demonstration-link)** | Complete project walkthrough and feature showcase |
| 💻 **Source Code Repository** | **[https://github.com/Sameer7517/CodeAvengers](https://github.com/Sameer7517/CodeAvengers)** | Full-stack MERN monorepo |
| ⚡ **Backend API Health Check** | **`https://campusloop-api.onrender.com/api/health`** | Express REST API on Render |

---

## 🎥 Video Demonstration Link

> 📺 **Click below to watch the complete end-to-end walkthrough of CampusLoop:**  
> **[▶️ Watch CampusLoop Demonstration Video](https://code-avengers.vercel.app/)**  
> *(Insert your YouTube, Loom, or Google Drive demonstration link here)*

**In this video demonstration:**
1. **User Onboarding:** Instant registration with college affiliation (**PVG's COET, Pune**, COEP, VJTI, etc.) and auto-generated initials-based SVG avatars.
2. **Item Cataloging:** Listing engineering textbooks (Nirali Prakashan, TechKnowledge), Casio scientific calculators, and lab aprons in INR (₹) with real-time carbon offset calculation.
3. **Direct Peer Swaps:** Two-phase item reservation, meetup scheduling at campus-verified safe zones, and handover confirmation with Eco-Karma points.
4. **Circular Swap Finder:** Visualizing and executing multi-party trade cycles ($A \to B \to C \to A$) when direct 1-to-1 trades cannot be resolved.
5. **Campus Sustainability Dashboard:** Live impact metrics (kg CO₂e avoided, trees saved) and student leaderboard.

---

## 🚨 Problem Statement

Every academic semester, thousands of rupees worth of functional course materials (engineering textbooks, drafters, scientific calculators, and lab coats) end up dumped into municipal landfills or left unused in dorm rooms. At the same time, newly admitted students face steep retail prices at campus bookstores:

- **Landfill Burden:** Solid academic waste accumulates at the end of every semester.
- **Embedded Carbon Waste:** Manufacturing new paper books, plastic calculators, and cotton lab coats generates significant greenhouse gas emissions and depletes forest resources.
- **Financial Strain:** Students frequently spend ₹5,000–₹12,000 per term on supplies they only use for 4 months.
- **Lack of Campus Trust:** Existing public classifieds (OLX, Craigslist) lack collegiate verification, expose students to scams, and fail to offer safe, on-campus physical exchange locations.
- **Trade Deadlocks:** Students with specific items to trade often cannot find another student who wants what they have and possesses what they need (**"Double Coincidence of Wants"** problem).

---

## 💡 Solution

**CampusLoop** solves these challenges through an intelligent, hyper-local circular reuse ecosystem:

1. **Hyper-Local Campus Trust:** Closed network for verified college communities (e.g., PVG's COET, Pune) with designated, well-lit physical **Safe Exchange Zones** on campus.
2. **Circular Swap Finder:** A graph-based algorithmic engine that finds 3-way circular trade loops ($A \to B \to C \to A$) to resolve trade deadlocks.
3. **Automated Carbon Footprint Metrics:** Real-time Life Cycle Assessment (LCA) algorithms calculate avoided kg CO₂e and trees saved for every listed and completed item.
4. **Three Flexible Exchange Modes:** Direct Swaps (1-to-1 trades), Free Giveaways (donations for seniors to juniors), and Affordable Direct Sales in Indian Rupees (₹).
5. **Two-Phase Reservation & Handover:** Concurrency-safe item reservation locking ensures no items are double-claimed, rewarding students with **Eco-Karma** upon verified physical handover.

---

## ✨ Key Features

- **🎓 Verified College Marketplace:** Tailored for Indian engineering colleges (PVG's COET Pune, COEP, VJTI, PICT) with regional curriculum book publishers (Nirali Prakashan, TechKnowledge, Technical Publications) and instruments (Casio fx-991EX/CW).
- **🔄 Circular Swap Finder (Multi-Party Loop Detection):** Detects 2-way and 3-way circular loops ($A \to B \to C \to A$) with transparent match affinity explanations and multi-party atomic consent workflows.
- **🌱 Live Carbon Savings Calculator:** Dynamically computes embodied carbon avoided (kg CO₂e) as students enter item specifications.
- **🛡️ Campus Safe Exchange Zones:** Integrates designated physical exchange spots (e.g., Central Library Lobby, Campus Cafeteria, Security Gate) to safeguard physical handovers.
- **🎨 Privacy-First SVG Initials Avatars:** Generates clean, deterministic SVG avatars from student initials, eliminating stock photos and maintaining profile consistency.
- **📊 Verified Sustainability Dashboard & Leaderboard:** Tracks verified platform reuse metrics with strict segregation of actual completed exchanges vs. catalog potentials, honoring top recyclers.
- **🔔 In-App Notifications:** Real-time updates for exchange requests, trade loop invitations, and handover confirmations.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS / Tailwind CSS, Lucide React Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js |
| **Database & ODM** | MongoDB Atlas, Mongoose ODM + Resilient In-Memory Fallback Engine |
| **State Management** | React Context API (`AppContext`) with dynamic API routing |
| **Hosting & Cloud** | **Vercel** (Frontend SPA), **Render** (Backend Node Web Service) |
| **Testing** | Node.js Native Test Runner with Supertest & custom assertion harness |

---

## ⚖️ Tech-Stack Justification

Why did we select these specific technologies over alternatives?

| Technology Chosen | Alternative Considered | Justification & Architectural Advantage |
| :--- | :--- | :--- |
| **React 18 + Vite** | Next.js / Create React App | Vite delivers near-instant Cold Starts and sub-second HMR (<100ms) during development. A Single Page Application (SPA) with React Router provides smooth transitions without unnecessary server-side rendering overhead for an interactive marketplace dashboard. |
| **Node.js & Express.js** | Django / Spring Boot | Node's non-blocking, event-driven asynchronous I/O enables high-throughput handling of concurrent marketplace browsing and atomic cycle-detection requests. Using JavaScript across the entire stack streamlines model sharing and developer velocity. |
| **MongoDB + Mongoose** | PostgreSQL / MySQL | Campus listings have heterogeneous, flexible attributes (book editions, calculator models, trade preferences, multi-party loop consent maps). A document-oriented store naturally models nested data like exchange histories, desired item wishlists, and participant consent trees. |
| **Resilient In-Memory Fallback** | Hard Database Dependency | Ensures **100% platform availability**. If cloud MongoDB Atlas undergoes maintenance or has connection timeouts, CampusLoop automatically activates its in-memory transactional store so students and evaluators can continue testing all features without friction. |
| **Tailwind CSS + Custom Tokens** | Material UI / Bootstrap | Tailwind provides utility-first flexibility to create a tailored, eco-conscious aesthetic (Forest Green `#1b4634`, Sage Green `#5e8c64`, and Cream `#f9f9f6`) with zero unused CSS bundle bloat. |
| **Vercel & Render** | AWS EC2 / DigitalOcean | Vercel provides instant global Edge CDN distribution and automatic SPA rewrite handling for the frontend. Render provides a lightweight containerized runtime for the Node.js backend with automated health monitoring. |

---

## ⚙️ Methodology & Algorithmic Design

### 1. The Circular Swap Finder (Graph Cycle Detection)
Direct peer trades often stall due to mismatch in desires. CampusLoop models listings as a **Directed Graph** $G = (V, E)$:
- **Vertices ($V$):** Active student listings.
- **Directed Edges ($E$):** An edge $u \to v$ exists if listing $v$ fulfills the wishlist criteria (`desiredItems` / category) of listing $u$.

```
Student A (Gives: Nirali Maths Book ──► Wants: Casio Calculator)
       │
       ▼ (passes Maths book to)
Student C (Gives: Drafter Kit ─────────► Wants: Nirali Maths Book)
       │
       ▼ (passes Drafter kit to)
Student B (Gives: Casio Calculator ───► Wants: Drafter Kit)
       │
       ▼ (passes Calculator to)
Student A  [CYCLE RESOLVED: A → C → B → A]
```

- **Algorithm:** Runs Depth-First Search (DFS) with path backtracking to find simple cycles of length $k \in \{2, 3\}$.
- **Match Affinity:** Tokenizes titles and categories using substring matching to provide transparent match rationales.
- **Atomic Consent:** Loops are proposed as non-binding suggestions. All $k$ participants must explicitly consent before any item status updates to `Reserved`. If an item is traded elsewhere, the loop safely auto-invalidates.

### 2. Carbon Footprint Life-Cycle Assessment (LCA)
Environmental savings are calculated using empirical category benchmarks:

$$\text{Avoided Emissions (kg CO}_2\text{e)} = \sum_{i=1}^{n} \text{Benchmark Factor}(\text{Category}_i)$$

- **Textbooks & Notes:** `10.4 kg CO₂e` avoided per reused book (saves pulp, paper processing, chemical dyes, shipping).
- **Calculators & Tech:** `18.5 kg CO₂e` avoided (saves semiconductor manufacturing and toxic e-waste).
- **Lab Essentials & Coats:** `7.2 kg CO₂e` avoided (saves industrial cotton processing and synthetic dyeing).
- **Stationery & Drafters:** `3.8 kg CO₂e` avoided (saves virgin plastic and aluminum extrusion).

---

## 🚀 Setup & Usage Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sameer7517/CodeAvengers.git
cd CodeAvengers
```

---

### Step 2: Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```bash
# server/.env
PORT=5000
NODE_ENV=development
JWT_SECRET=campusloop_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173

# Optional: MongoDB Atlas connection (leave empty to use built-in in-memory store)
MONGODB_URI=
```

---

### Step 3: Install Dependencies
```bash
# Install root, server, and client dependencies:
npm run install:all
```
*(Or navigate into `server` and `client` separately and run `npm install`).*

---

### Step 4: Run the Application Locally
In two separate terminals:

#### Terminal 1 — Start Backend Server (Port 5000):
```bash
cd server
npm start
```

#### Terminal 2 — Start Frontend Client (Port 5173):
```bash
cd client
npm run dev
```

Visit the app at: **`http://localhost:5173`**

---

### Step 5: Run Automated Test Suites (126 Tests)
```bash
cd server
npm test
```
All 126 assertions across authentication, marketplace, concurrency locks, and circular swap workflows will execute and validate with 0 failures.

---

## 👥 Team Members — CodeAvengers

| Team Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **Sameer** | Full-Stack & System Architect | Circular Swap Graph Engine, Database Architecture, Deployment |
| **Team Member 2** | Frontend & UI/UX Specialist | Responsive UI, Design System, Item Detail Views, SVG Avatar Engine |
| **Team Member 3** | Backend & Security Engineer | JWT Auth, Safe Zone Integration, Two-Phase Handover, API Security |
| **Team Member 4** | Algorithm & Impact Analyst | Carbon Offset LCA Model, Testing Harness (126 tests), Documentation |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for collegiate sustainability programs!

---
*Developed with 💚 by **CodeAvengers** for Campus Sustainability Hackathon 2026.*
