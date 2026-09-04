# 🇱🇰 Disaster Management LK

> **Report danger. Stay informed. Stay safe.**  
> A community-powered disaster reporting and situational awareness platform for Sri Lanka, built for the SLIIT SE3090 Assignment 2 Mini Hackathon ("Build for Sri Lanka").

---

### 📌 Hackathon Deliverable Links & Metadata
- **Group ID**: `[Insert Group ID, e.g., WE_04]`
- **Repository**: [https://github.com/VTN02/Community-Disaster.git](https://github.com/VTN02/Community-Disaster.git)
- **Live Deployed Application**: [https://community-disaster.vercel.app/](https://community-disaster.vercel.app/)
- **Two-Minute Demonstration Video**: `[Insert OneDrive / YouTube / Drive Link]`
- **Full Documentation Report**: See [`DOCUMENTATION_REPORT.md`](./DOCUMENTATION_REPORT.md) or open [`DOCUMENTATION_REPORT.html`](./DOCUMENTATION_REPORT.html) in your browser to print as PDF.

---

### 👥 Team Members & Contributions
| Student ID | Full Name | Role | Key Contributions |
| :--- | :--- | :--- | :--- |
| `[IT Number 1]` | **Vijaya Kumar Vithusan** | Backend & DB Architecture | Express API, MongoDB models, JWT auth, Atlas DNS resolver fix, seed scripts, server deployment. |
| `[IT Number 2]` | **Y. H. Prasad** | UI & Frontend Frameworks | Responsive React components, Tailwind styling, DMC operational hero assets, Navbar, Disaster Cards. |
| `[IT Number 3]` | **[Member 3 Name]** | Forms & Mapping | Disaster Report form, React Hook Form + Zod validation, Leaflet/OSM GPS pin picker. |
| `[IT Number 4]` | **[Member 4 Name]** | QA, Deployment & Demo | Integration testing, Git version control, Vercel frontend CI/CD, 2-minute video lead. |

---

## 🌊 The Problem

Sri Lanka experiences frequent natural disasters — floods, landslides, storms — especially during monsoon seasons. During emergencies, people need real-time, location-accurate information about affected areas. Official channels are often too slow, and there is no simple way for ordinary citizens to share what they are witnessing on the ground.

## 💡 The Solution

Disaster Management LK is a simple, accessible platform that:
- Allows anyone (no registration needed) to report a local disaster with GPS location
- Displays all incidents on an interactive map
- Allows community filtering and search
- Provides quick access to emergency contacts
- Lets administrators verify, manage, and update reports

---

## ✨ Key Features

### Public (No Login Required)
- 🏠 **Home Page** — Live statistics, active incidents, emergency quick-access
- 🚨 **Report Disaster** — Form with GPS location or map picker, validation
- 🗺️ **Disaster Map** — Full Leaflet + OpenStreetMap interactive map with severity markers
- 📋 **Active Reports** — Filterable dashboard (type, severity, status, district, search)
- 📄 **Disaster Details** — Full incident detail with mini-map and safety tips
- 📞 **Emergency Contacts** — Official Sri Lankan numbers with tap-to-call
- 🛡️ **Safety Guidelines** — Disaster-specific safety instructions
- ℹ️ **About** — Platform information and disclaimer

### Admin Portal (JWT Protected)
- 🔐 **Secure Login** — JWT + bcrypt authentication
- 📊 **Dashboard** — Statistics, charts, pending reports
- ✅ **Report Management** — Verify, reject, update status, update severity, delete
- 🗺️ **Admin Map** — Full incident map view
- 📞 **Emergency Contacts CRUD** — Add, edit, delete contacts

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Maps | Leaflet + React Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## 🏗️ Architecture

```
disaster-management-lk/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Public + Admin pages
│       ├── context/       # AuthContext (JWT state)
│       ├── services/      # Axios API service
│       ├── routes/        # ProtectedRoute
│       └── utils/         # Constants, helpers
│
├── backend/           # Node.js + Express API
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── models/        # Mongoose schemas
│       ├── controllers/   # Route handlers
│       ├── middleware/     # JWT auth middleware
│       ├── routes/        # API routes
│       └── seed/          # Sample data seeder
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the project
```bash
git clone <repo-url>
cd disaster-management-lk
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Seed sample data:
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

---

## 🌐 API Overview

### Public Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/reports` | Get all reports (supports filters) |
| GET | `/api/reports/:id` | Get single report |
| POST | `/api/reports` | Submit new report |
| GET | `/api/reports/stats` | Get statistics |
| GET | `/api/emergency-contacts` | Get all contacts |

### Admin Endpoints (JWT Required)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current admin |
| PUT | `/api/reports/:id` | Update report |
| DELETE | `/api/reports/:id` | Delete report |
| PATCH | `/api/reports/:id/status` | Update status |
| PATCH | `/api/reports/:id/verify` | Verify/reject |
| POST | `/api/emergency-contacts` | Add contact |
| PUT | `/api/emergency-contacts/:id` | Update contact |
| DELETE | `/api/emergency-contacts/:id` | Delete contact |

### Filtering
```
GET /api/reports?type=Flood
GET /api/reports?severity=critical
GET /api/reports?status=investigating
GET /api/reports?district=Gampaha
GET /api/reports?search=road
```

---

## 🔐 Admin Access

Default admin credentials (after seeding):
```
Email:    admin@disasterlk.gov.lk
Password: Admin@123
```

**Change these credentials in production!**

---

## 🗺️ Maps

All maps use **Leaflet + OpenStreetMap** — completely free with no API key required.

Location features:
- 📍 "Use My Current Location" via browser Geolocation API
- 🗺️ Click-to-select on interactive map
- Disaster markers coloured by severity on public map

---

## 🚢 Deployment

| Layer | Recommended Service |
|-------|-------------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

Environment variable to update for production:
- Backend: Set `CLIENT_URL` to your Vercel frontend URL
- Frontend: Set `VITE_API_URL` to your Render/Railway backend URL

---

## 🤖 AI Usage Declaration

This project was built with the assistance of **Antigravity AI (Google DeepMind)** for:
- UI component architecture and Tailwind CSS styling
- React component code generation
- Express.js API route structure
- Mongoose schema design
- General debugging and code review

All generated code was reviewed, understood, tested, and modified as needed by the development team. Every team member understands the code they contributed.

---

## 📸 Screenshots

- Homepage with hero, emergency bar, and live stats
- Disaster reporting form with GPS + map picker
- Leaflet map with colour-coded severity markers
- Admin dashboard with charts and pending reports
- Emergency contacts with tap-to-call

---

## ⚠️ Disclaimer

**Disaster Management LK is a community information platform.**

For emergencies, always contact official emergency services:
- **Police:** 119
- **Fire & Rescue:** 110
- **Ambulance (Suwa Seriya):** 1990
- **Disaster Management Centre:** 117

This platform does not replace official disaster management channels.
