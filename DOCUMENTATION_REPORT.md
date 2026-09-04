# 🇱🇰 SLIIT — Faculty of Computing
## SE3090 – Software Engineering Frameworks
### Assignment 2 — Mini Hackathon: "Build for Sri Lanka"
**Academic Year 3 | Semester 1 | 2026**

---

# PROJECT DOCUMENTATION REPORT

```
========================================================================================
PROJECT TITLE      : Disaster Management LK — Community-Powered Disaster Reporting 
                     & Emergency Situational Awareness Platform
GROUP ID           : [Insert Your Group ID, e.g., WE_04]
REPOSITORY LINK    : https://github.com/VTN02/Community-Disaster.git
DEPLOYED APP LINK  : https://community-disaster.vercel.app/
DEMONSTRATION VIDEO: [Insert OneDrive / YouTube / Google Drive Link to 2-Min Video]
DATE OF SUBMISSION : 4th September 2026
========================================================================================
```

---

## 👥 1. Team Members & Contribution Breakdown

| Student ID | Member Full Name | Assigned Area / Role | Key Contributions & Modules Owned |
| :--- | :--- | :--- | :--- |
| **[IT Number 1]** | **Vijaya Kumar Vithusan** | Functional Implementation & Backend Architecture | Designed MongoDB schemas, Express REST API controllers, JWT authentication, DNS SRV resolution for MongoDB Atlas, seed data automation, and server deployment. |
| **[IT Number 2]** | **Y. H. Prasad** | UI Development & Component Architecture | Developed responsive React components with Tailwind CSS, built Navbar, Footer, Disaster Cards, Hero Section with DMC visual assets, and mobile filter drawers. |
| **[IT Number 3]** | **[Member 3 Full Name]** | Forms, Validation & Interactive Maps | Implemented Disaster Report Form using React Hook Form + Zod, Leaflet/OpenStreetMap GPS pin integration, and client-side error handling. |
| **[IT Number 4]** | **[Member 4 Full Name]** | Testing, CI/CD, Documentation & Demo | Performed end-to-end integration testing, managed Git branching/commit workflows, Vercel frontend deployment, and coordinated the 2-minute demonstration video. |

---

## 🌊 2. Problem Framing: The Sri Lankan Context

### 2.1 The Core Problem
Sri Lanka is increasingly vulnerable to climate-induced natural disasters—predominantly monsoon-triggered flash floods, devastating landslides across the central highlands, and severe coastal storms. During major events (such as the Southwest and Northeast monsoons affecting river basins like the Kelani, Kalu, Gin, and Nilwala), citizens and emergency services encounter critical information bottlenecks:
- **Delayed Official Bulletins**: Formal government hazard notices often suffer from reporting lags of several hours before reaching ground-level residents.
- **Lack of Hyper-Local Situational Awareness**: Ordinary commuters and families lack real-time visibility into impassable roads, waterlogged town centers, or destabilized hill slopes in their immediate vicinity.
- **Misinformation on Unverified Social Channels**: Rumors circulate quickly on messaging apps without geolocation or authenticity checks, tying up scarce emergency relief resources.
- **Fragmented Emergency Communication**: Citizens struggle to find direct, working hotline numbers for specific responding bodies (DMC, Suwa Seriya, Police, Fire, NBRO).

### 2.2 Target Beneficiaries
- **Vulnerable Local Communities & Families**: Residents in high-risk flood plains (Gampaha, Colombo, Ratnapura, Kalutara) and landslide-prone mountain districts (Kandy, Badulla, Kegalle, Nuwara Eliya).
- **Daily Commuters & Public Transport Operators**: Drivers who need up-to-the-minute awareness of road blockages and impassable bridges.
- **Emergency First Responders & District Secretariats**: Quick triage of citizen reports with GPS coordinates to dispatch 1990 Suwa Seriya ambulances, Sri Lanka Navy rescue boats, or divisional disaster relief teams.

---

## 💡 3. The Proposed Solution: Disaster Management LK

**Disaster Management LK** is an accessible, community-driven, and authority-verified web application designed specifically for rapid deployment during emergency crises in Sri Lanka.

### Core Value Proposition
1. **Zero-Barrier Public Reporting**: Anyone can submit a local disaster alert in under 60 seconds without logging in or creating an account.
2. **Precision Geolocation**: Browser Geolocation API captures exact GPS coordinates (`latitude`, `longitude`), with an interactive Leaflet/OpenStreetMap click-to-pin fallback.
3. **Institutional Verification Pipeline**: Reports enter a moderation queue where designated disaster administrators review, verify, or escalate incidents—preventing panic while highlighting confirmed hazards.
4. **Interactive National Disaster Map**: Nationwide spatial visualization using Leaflet and OpenStreetMap, with color-coded severity markers (Critical, High, Medium, Low).
5. **Direct Emergency Hotline Speed-Dial**: One-tap phone links to Sri Lanka's official lifelines:
   - **117**: Disaster Management Centre (DMC)
   - **119**: Police Emergency
   - **1990**: 1990 Suwa Seriya Pre-Hospital Free Ambulance
   - **110**: Fire & Rescue
   - **1954**: Water Board Emergency

---

## 🛠️ 4. Technology Stack & Framework Justification

| Architectural Layer | Framework / Technology | Justification & Selection Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 (SPA)** | Fast component re-rendering, robust virtual DOM, and extensive ecosystem for interactive map-based dashboards. |
| **Build Tooling** | **Vite 5** | Instant Hot Module Replacement (HMR) and optimized Rollup production builds (sub-10s compile time during the 4-hour hackathon). |
| **Styling & Design** | **Tailwind CSS 3** | Utility-first CSS providing a professional, consistent design system with zero runtime overhead, responsive utility breakpoints, and custom disaster severity color schemes. |
| **Routing** | **React Router v6** | Client-side routing with nested routes, dynamic parameters (`/disasters/:id`), and token-based Protected Routes for the Admin portal. |
| **Form Management & Validation** | **React Hook Form + Zod** | Uncontrolled form inputs for peak performance, combined with strict schema-based input validation and friendly user-facing error feedback. |
| **Mapping & Geospatial** | **Leaflet + React Leaflet + OpenStreetMap** | Completely free and open-source geospatial visualization requiring no proprietary API keys or billing quotas; provides smooth map zooming, custom colored markers, and popups. |
| **Icons & UI Assets** | **Lucide React** | Lightweight, accessible SVG icon set for clean emergency UI motifs. |
| **Backend API** | **Node.js + Express.js** | Non-blocking, asynchronous I/O runtime well-suited for high-concurrency disaster reporting and RESTful JSON micro-services. |
| **Database & ODM** | **MongoDB Atlas + Mongoose** | Flexible JSON document storage ideal for geo-coordinates, evolving disaster schemas, and fast multi-criteria queries. Hosted on high-availability MongoDB Atlas cloud. |
| **Authentication & Security** | **JWT + bcryptjs** | Stateless JSON Web Token authentication with 12-round salted password hashing for administrative access. |
| **Deployment Hosting** | **Vercel + Cloud** | Frontend deployed to Vercel global CDN edge network for sub-second page loads across mobile and desktop devices. |

---

## ✅ 5. Compliance with 10 Minimum Software Requirements

| # | Minimum Requirement (Assignment Specification) | Implementation in Disaster Management LK | Location in Codebase |
| :---: | :--- | :--- | :--- |
| **1** | **Clear landing page or main user interface** | Executive landing page featuring national trust badges, hero visual showcase with official DMC operational media (`dmc_slider_04.jpg`), live metrics ticker, and speed-dial emergency grid. | [`frontend/src/pages/public/HomePage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/HomePage.jsx) |
| **2** | **Short explanation of Sri Lankan problem inside app** | Dedicated "Why Disaster Management LK?" and "Sri Lanka Emergency Context" sections detailing monsoon floods, landslides, and road blockages across Sri Lanka's 25 districts. | [`frontend/src/pages/public/AboutPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/AboutPage.jsx)<br>[`HomePage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/HomePage.jsx) |
| **3** | **At least two functional software features** | 1. **Interactive Nationwide Disaster Map** (Leaflet map with colored severity markers & popups).<br>2. **Real-time Incident Stream & Multi-Criteria Filter** (Filter by type, severity, status, and district).<br>3. **Admin Verification & Status Workflow** (Verify/reject citizen reports). | [`frontend/src/pages/public/MapPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/MapPage.jsx)<br>[`frontend/src/pages/public/DisastersPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/DisastersPage.jsx)<br>[`frontend/src/pages/admin/AdminDashboard.jsx`](file:///d:/Hackathon1/frontend/src/pages/admin/AdminDashboard.jsx) |
| **4** | **At least one form that accepts user input** | 1. **Disaster Incident Reporting Form** (Disaster type, district, area, description, GPS location picker, optional reporter contact).<br>2. **Admin Authentication Form** (`/admin/login`).<br>3. **Emergency Contact CRUD Form**. | [`frontend/src/pages/public/ReportPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/ReportPage.jsx)<br>[`frontend/src/pages/admin/LoginPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/admin/LoginPage.jsx) |
| **5** | **Input validation with friendly error messages** | Zod schema validation enforcing required fields (description min length, valid Sri Lankan district selection, numeric coordinate boundaries) with red visual highlight borders and friendly explanatory error text. | [`frontend/src/pages/public/ReportPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/ReportPage.jsx)<br>[`backend/src/middleware/validator.js`](file:///d:/Hackathon1/backend/src/middleware/validator.js) |
| **6** | **Display, search, filter, calculate, update or process information** | - Search by keywords across title, description, and area.<br>- Multi-filter by disaster type, severity, district, status, verification.<br>- **Haversine formula calculation** computing exact kilometer distance between user and incident.<br>- Real-time aggregation statistics (`/api/reports/stats`). | [`backend/src/controllers/reportsController.js`](file:///d:/Hackathon1/backend/src/controllers/reportsController.js)<br>[`frontend/src/utils/constants.js`](file:///d:/Hackathon1/frontend/src/utils/constants.js)<br>[`frontend/src/pages/public/DisastersPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/DisastersPage.jsx) |
| **7** | **Responsive interface (Desktop & Mobile)** | Built with Tailwind CSS responsive breakpoints (`sm`, `md`, `lg`, `xl`). Mobile view features slide-out navigation menus, mobile filter bottom drawer, stacked responsive tables, and tap-to-call mobile buttons. | [`frontend/src/components/layout/Navbar.jsx`](file:///d:/Hackathon1/frontend/src/components/layout/Navbar.jsx)<br>[`frontend/src/pages/public/DisastersPage.jsx`](file:///d:/Hackathon1/frontend/src/pages/public/DisastersPage.jsx) |
| **8** | **Basic navigation between sections** | Persistent sticky Navbar with active state indicators, deep-link breadcrumbs, and a comprehensive footer linking to Home, Reports, Map, Emergency Hotlines, Safety Guidelines, About, and Admin Portal. | [`frontend/src/components/layout/Navbar.jsx`](file:///d:/Hackathon1/frontend/src/components/layout/Navbar.jsx)<br>[`frontend/src/components/layout/Footer.jsx`](file:///d:/Hackathon1/frontend/src/components/layout/Footer.jsx) |
| **9** | **Sample data relevant to chosen problem** | Pre-seeded database with 12 authentic Sri Lankan disaster reports (Kelani River Baseline Road flood, Kadugannawa A1 landslide, Gampaha waterlogging, Jaffna coastal storm) and 8 verified national emergency contacts. | [`backend/src/seed/seedData.js`](file:///d:/Hackathon1/backend/src/seed/seedData.js) |
| **10** | **Clear demonstration of value to Sri Lankan users** | Solves ground-level life safety during monsoons; provides offline emergency numbers, pre-disaster safety checklists (flood steps, NBRO landslide warnings), and transparent community vigilance. | Verified in live demo and deployed platform. |

---

## 🤖 6. CLEAR AI Framework & Prompt Log (Mandatory)

### 6.1 AI Usage Declaration
> **Official Declaration (in compliance with Assignment Section 2.3):**
>
> "This project was built with the assistance of **Antigravity AI (Google DeepMind)** and large language models. The AI tools were utilized for architectural scaffolding, rapid Tailwind CSS component styling, REST API route generation, DNS SRV resolution troubleshooting on Windows networks, and automated database seed generation. All generated code was thoroughly reviewed, debugged, manually verified, and customized by the student team. The team fully understands, owns, and can defend every line of code submitted."

### 6.2 AI Prompt Log (Mandatory Section 2.2)

| # | AI Tool | Exact Prompt Submitted | Specific Purpose | How Output Was Checked, Modified & Verified |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Antigravity AI (Google DeepMind)** | `"can you clone https://github.com/VTN02/Community-Disaster.git to this project"` | Clone and establish the base full-stack repository in the hackathon workspace. | Verified repository files, directory tree (`backend`, `frontend`), and Git commit history. |
| **2** | **Antigravity AI (Google DeepMind)** | `"yes do it"` *(Follow-up on dependency installation and environment configuration)* | Install npm packages, configure `.env` files for backend & frontend, and run seed script. | Ran into Windows DNS SRV connection error (`querySrv ECONNREFUSED`). Diagnosed that Windows c-ares resolver failed on MongoDB Atlas SRV records; modified `src/config/db.js` and `src/seed/seedData.js` to set public DNS (`dns.setServers(['8.8.8.8', '1.1.1.1'])`), verifying clean connection to MongoDB Atlas. |
| **3** | **Antigravity AI (Google DeepMind)** | `"project working well.. now i want to design it more professional .. i also add picture to public folder can you add it to landing page.."` | Transform the landing page (`HomePage.jsx`) into an authoritative national disaster platform utilizing `dmc_slider_04.jpg`. | Reviewed generated component layout, ensured responsive behavior across mobile breakpoints, added top live emergency broadcast bar, speed-dial hotline grid, and verified build with `npm run build` (0 errors). |
| **4** | **Antigravity AI (Google DeepMind)** | `"now i want to design this page more professionally https://community-disaster.vercel.app/disasters"` | Redesign the disaster reports and search page (`DisastersPage.jsx`) to professional incident management standards. | Upgraded `FilterPanel.jsx` with category tabs and severity pills; upgraded `DisasterCard.jsx` to support dual Grid/List view modes; added live KPI status counters and verified client-side sorting by severity and time. |

---

## 🏗️ 7. System Architecture & Component Design

```
+-----------------------------------------------------------------------------------+
|                                CLIENT BROWSER                                     |
|  React 18 + Vite (SPA) | Tailwind CSS | React Router v6 | Leaflet Maps            |
|                                                                                   |
|  [ Public Routes ]                       [ Protected Admin Routes ]               |
|  /            -> HomePage                /admin/login     -> AdminLogin           |
|  /disasters   -> DisastersPage           /admin/dashboard -> AdminDashboard       |
|  /map         -> MapPage                 /admin/reports   -> ManageReports        |
|  /report      -> ReportPage              /admin/contacts  -> ManageContacts       |
|  /emergency   -> EmergencyPage                                                    |
|  /safety      -> SafetyPage                                                       |
+-----------------------------------------------------------------------------------+
                                         │  Axios HTTP / JSON
                                         ▼
+-----------------------------------------------------------------------------------+
|                              BACKEND REST API                                     |
|  Node.js + Express.js Server (Port 5000)                                          |
|                                                                                   |
|  [ Middleware Layer ]                                                             |
|  ├── CORS Cross-Origin Handler                                                    |
|  ├── JWT Authentication Middleware (Bearer Token Verification)                     |
|  └── Express-Validator Request Sanitization                                       |
|                                                                                   |
|  [ API Controller Endpoints ]                                                     |
|  ├── /api/reports            (GET, POST, PUT, DELETE, PATCH status/verify)        |
|  ├── /api/reports/stats      (GET aggregated disaster telemetry)                  |
|  ├── /api/emergency-contacts (GET, POST, PUT, DELETE)                             |
|  └── /api/auth/login         (POST credentials, JWT issuance)                     |
+-----------------------------------------------------------------------------------+
                                         │  Mongoose ODM
                                         ▼
+-----------------------------------------------------------------------------------+
|                             DATABASE STORAGE                                      |
|  MongoDB Atlas Cloud (Replica Set cluster0.3cwyioh.mongodb.net)                   |
|  ├── Collections: `admins`, `disasterreports`, `emergencycontacts`                |
+-----------------------------------------------------------------------------------+
```

---

## 📹 8. Two-Minute Demonstration Video Script Guide

| Timestamp | Video Section | Screen Shown | Key Script & Talking Points |
| :---: | :--- | :--- | :--- |
| **0:00 - 0:25** | **Problem & Team Introduction** | Team camera / Title Slide + Landing Page Hero | *"Hello, we are Team [Group ID]. In Sri Lanka, sudden monsoon floods and landslides threaten lives every season, but official alerts are slow and fragmented. We built **Disaster Management LK**, a community-powered real-time disaster reporting and situational awareness platform."* |
| **0:25 - 0:50** | **Citizen Reporting & GPS Mapping** | `/report` page & `/map` | *"Anyone witnessing a hazard can report it in under 60 seconds with no account needed. We capture exact GPS coordinates using the browser location API or map pin drop, with Zod schema validation. The incident instantly renders on our interactive Leaflet map with color-coded severity markers."* |
| **0:50 - 1:20** | **Incident Filtering & Intelligence** | `/disasters` page | *"On the active reports portal, users can filter across 25 districts, disaster types, and severity levels. We also support both grid and operational list views, dynamic sorting, and instant tap-to-call links for Sri Lanka's 117 DMC and 1990 Suwa Seriya hotlines."* |
| **1:20 - 1:45** | **Admin Verification Workflow** | `/admin/dashboard` | *"To prevent fake news, our JWT-protected admin portal allows emergency coordinators to inspect submissions, verify authenticity, update response status to 'Investigating' or 'Resolved', and maintain official emergency contacts."* |
| **1:45 - 2:00** | **Impact & Conclusion** | Deployed application on Vercel (`community-disaster.vercel.app`) | *"Our application is fully responsive, tested, and deployed live on Vercel with MongoDB Atlas. Disaster Management LK delivers immediate, lifesaving situational intelligence to all Sri Lankans. Thank you!"* |

---

## 🚀 9. Installation, Local Execution & Verification

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Internet Connection**: To communicate with MongoDB Atlas

### 1. Clone the Repository
```bash
git clone https://github.com/VTN02/Community-Disaster.git
cd Community-Disaster
```

### 2. Backend Setup & Configuration
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://vijayakumarvithusan2912_db_user:vtnv@cluster0.3cwyioh.mongodb.net/disaster?retryWrites=true&w=majority
JWT_SECRET=disasterlk_jwt_secret_key_2024_secure
CLIENT_URL=http://localhost:5173
```
Seed the database with sample Sri Lankan data:
```bash
npm run seed
```
Start the backend development server:
```bash
npm run dev
# Server will listen on http://localhost:5000/api
```

### 3. Frontend Setup & Configuration
```bash
cd ../frontend
npm install
```
Create a `.env` file inside the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
# Application will run on http://localhost:5173/
```

### 4. Default Admin Credentials
- **Portal URL**: `http://localhost:5173/admin/login` (or `https://community-disaster.vercel.app/admin/login`)
- **Email**: `admin@disasterlk.gov.lk`
- **Password**: `Admin@123`

---

## 📝 10. Conclusion & Reflection

During this intensive 4-hour Mini Hackathon sprint, our team successfully framed a high-priority Sri Lankan challenge, designed an accessible mobile-first software solution, integrated modern web frameworks, leveraged agentic AI tools responsibly under the CLEAR framework, and deployed a production-ready application to the public web. 

**Disaster Management LK** stands as an example of how modern full-stack frameworks (React, Vite, Tailwind CSS, Express, MongoDB Atlas, Leaflet) and AI pair-programming can be harnessed to deliver meaningful civic technology that helps real people stay safe.

---
*Report compiled for SLIIT Faculty of Computing · SE3090 Software Engineering Frameworks · Assignment 2*
