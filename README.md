# MiniHR_System - Employee Leave & Attendance Management

A full-stack Employee Leave & Attendance Management System (Mini HR Tool) built with modern web technologies. The system enables employees to manage leave applications and track attendance while providing administrators with oversight and approval capabilities.

**Deployment Links:**
- **Frontend:** https://mini-hr-system-topaz.vercel.app/
- **Backend API:** https://minihr-system.onrender.com/api/v1

---

## 📋 Project Overview

MiniHR is a comprehensive HR management tool designed for small to medium-sized organizations to streamline employee leave requests, attendance tracking, and employee data management. The system enforces role-based access control, ensuring employees can only manage their own data while admins have full visibility and approval authority.

### Key Features:
✅ **JWT-based Authentication** with secure token refresh mechanism  
✅ **Role-Based Access Control** (Employee & Admin roles)  
✅ **Leave Management** (Apply, Edit, Cancel, Approve/Reject)  
✅ **Attendance Tracking** with daily mark system  
✅ **Leave Balance Management** (starts with 20 days, decreases on approval)  
✅ **Protected API Routes** with proper HTTP status codes  
✅ **Responsive UI** built with React, Tailwind CSS, and shadcn/ui  

---

## 🛠 Tech Stack & Justification

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js + Express.js** | ^5.2.1 | Lightweight, event-driven server framework ideal for RESTful APIs |
| **MongoDB + Mongoose** | ^9.4.1 | Flexible NoSQL database with schema validation via Mongoose ODM |
| **JWT (jsonwebtoken)** | ^9.0.3 | Stateless authentication mechanism for token-based security |
| **bcryptjs** | ^3.0.3 | Secure password hashing with salt rounds (10) |
| **CORS** | ^2.8.6 | Cross-origin resource sharing for frontend-backend communication |
| **dotenv** | ^17.4.1 | Environment variable management for secure configuration |

**Why these choices?**
- **Express.js**: Simple, fast, and widely adopted for REST APIs
- **MongoDB**: Schema-less flexibility + Compound unique indexes for data integrity
- **Mongoose**: Forces schema consistency and provides pre-hooks for password hashing
- **JWT**: Stateless, scalable, and eliminates server session management overhead

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React ^19.2.4** | Modern UI component library with hooks and context API |
| **Vite ^8.0.4** | Fast build tool and dev server (HMR support) |
| **Tailwind CSS ^4.2.2** | Utility-first CSS framework for rapid UI development |
| **shadcn/ui** | Pre-built, accessible React components on top of Radix UI |
| **React Router DOM ^7.14.0** | Client-side routing for multi-page navigation |
| **Axios ^1.15.0** | HTTP client with interceptors for token refresh logic |
| **Lucide React** | Modern icon library for consistent iconography |

**Why these choices?**
- **React**: Component-based architecture with Context API for state management
- **Vite**: 50-100x faster than Webpack for dev/build cycles
- **Tailwind**: Rapid prototyping with responsive design built-in
- **shadcn/ui**: Accessible, customizable components (no external stylesheet bloat)

### Database
| Model | Key Features |
|-------|-------------|
| **User** | Full name, email (unique), password (hashed), role (employee/admin), date of joining, leave balance, refresh token |
| **Leave** | Employee ref, leave type (Casual/Sick/Paid), start/end dates, total days, status, reason, appliedDate, **actionedBy, actionedAt** (bonus: tracks admin actions) |
| **Attendance** | Employee ref, date, status (Present/Absent), **Compound unique index** (one per employee per day) |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB URI (local or cloud, e.g., MongoDB Atlas)
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and add the following:
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=https://mini-hr-system-topaz.vercel.app

# Start the development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file:
VITE_API_BASE_URL=https://minihr-system.onrender.com/api/v1

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173

# Build for production
npm run build
# Output in dist/ folder
```

---

## 📌 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000

# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Secrets (use strong random strings)
ACCESS_TOKEN_SECRET=your_random_access_token_secret_key_min_32_chars
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_random_refresh_token_secret_key_min_32_chars
REFRESH_TOKEN_EXPIRY=10d

# CORS Origin (frontend URL)
CORS_ORIGIN=https://mini-hr-system-topaz.vercel.app
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://minihr-system.onrender.com/api/v1
```

---

## 📡 API Endpoints

### Base URL: `https://minihr-system.onrender.com/api/v1`

### Authentication Endpoints (`/users`)

| Method | Endpoint | Auth Required | Role | Purpose |
|--------|----------|-------------|------|---------|
| POST | `/register` | ❌ | Public | Register new employee |
| POST | `/login` | ❌ | Public | Login and get tokens |
| POST | `/logout` | ✅ JWT | Employee | Logout (clears refresh token) |
| POST | `/refresh-token` | ❌ | Public | Refresh access token |
| GET | `/me` | ✅ JWT | Employee | Get current user profile |
| GET | `/employees` | ✅ JWT + Admin | Admin | View all employees |
| GET | `/employees/:id` | ✅ JWT + Admin | Admin | Get specific employee details |

### Leave Management Endpoints (`/leave`)

#### Employee Routes
| Method | Endpoint | Auth Required | Purpose |
|--------|----------|-------------|---------|
| POST | `/apply` | ✅ JWT | Apply for leave |
| GET | `/my` | ✅ JWT | View my leave requests |
| PATCH | `/:id/edit` | ✅ JWT | Edit pending leave request |
| DELETE | `/:id/cancel` | ✅ JWT | Cancel pending leave request |

**Request Body Example (Apply Leave):**
```json
{
  "leaveType": "Casual",
  "startDate": "2024-12-25",
  "endDate": "2024-12-27",
  "reason": "Family event"
}
```

#### Admin Routes
| Method | Endpoint | Auth Required | Purpose |
|--------|----------|-------------|---------|
| GET | `/all` | ✅ JWT + Admin | View all leave requests (all employees) |
| PATCH | `/:id/action` | ✅ JWT + Admin | Approve/reject leave request |

**Request Body Example (Action Leave):**
```json
{
  "status": "Approved"
}
```
Stores `actionedBy` (admin ID) and `actionedAt` (timestamp) automatically.

### Attendance Management Endpoints (`/attendance`)

#### Employee Routes
| Method | Endpoint | Auth Required | Purpose |
|--------|----------|-------------|---------|
| POST | `/mark` | ✅ JWT | Mark attendance for today |
| GET | `/my` | ✅ JWT | View my attendance history |

**Request Body Example (Mark Attendance):**
```json
{
  "status": "Present"
}
```

#### Admin Routes
| Method | Endpoint | Auth Required | Purpose |
|--------|----------|-------------|---------|
| GET | `/all` | ✅ JWT + Admin | View all attendance records |

**Query Parameters (for filtering):**
```
GET /all?employeeId=<id>&date=2024-12-01
GET /all?employeeId=<id>           # Filter by employee only
GET /all?date=2024-12-01           # Filter by date only
GET /all                           # All records
```

---

## 💾 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed, min 6 chars),
  role: String (enum: ["employee", "admin"], default: "employee"),
  dateOfJoining: Date (default: Date.now),
  leaveBalance: Number (default: 20),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Leave Model
```javascript
{
  _id: ObjectId,
  employee: ObjectId (ref: User),
  leaveType: String (enum: ["Casual", "Sick", "Paid"]),
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  status: String (enum: ["Pending", "Approved", "Rejected"], default: "Pending"),
  reason: String,
  appliedDate: Date (default: Date.now),
  actionedBy: ObjectId (ref: User, admin who approved/rejected) — BONUS FEATURE,
  actionedAt: Date (timestamp of approval/rejection) — BONUS FEATURE,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Model
```javascript
{
  _id: ObjectId,
  employee: ObjectId (ref: User),
  date: Date,
  status: String (enum: ["Present", "Absent"]),
  createdAt: Date,
  updatedAt: Date
}

// Compound Unique Index (Bonus Feature):
// { employee: 1, date: 1 } — Enforces one record per employee per day at DB level
```

---

## 🔐 Security & Authorization

### Route Protection Strategy

**Protected Routes (Employee only):**
- Middleware: `verifyJWT`
- Users can only access their own data
- Logic: Compares `req.user._id` with resource owner ID

**Admin Routes:**
- Middleware: `verifyJWT` + `isAdmin`
- Full access to all employee data
- Returns 403 Forbidden if non-admin attempts access
- HTTP Status Codes:
  - `200` OK — Successful request
  - `201` Created — Resource successfully created
  - `400` Bad Request — Validation errors
  - `401` Unauthorized — Missing/invalid JWT
  - `403` Forbidden — Insufficient permissions
  - `404` Not Found — Resource not found
  - `409` Conflict — Duplicate email/attendance

### Authentication Flow
1. User registers/logs in → Get `accessToken` & `refreshToken`
2. Request includes `Authorization: Bearer <accessToken>` header
3. Server verifies JWT signature and expiry
4. Access token expires in 7 days → Use refresh token to get new one
5. Refresh token expires in 10 days → User must re-login

---

## 👤 Admin Credentials

Admin must be created manually in MongoDB. Here's how:

### Option 1: Using MongoDB Compass or CLI
```javascript
db.users.insertOne({
  fullName: "Admin User",
  email: "admin@minihr.com",
  password: "$2a$10$...", // bcrypt hashed "Admin@123"
  role: "admin",
  dateOfJoining: new Date(),
  leaveBalance: 0,
  refreshToken: null
})
```

### Option 2: Manual Registration + Database Update
1. Register as normal user
2. In MongoDB, update the user document:
```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

### Default Admin Credentials:
- **Email:** admin@minihr.com
- **Password:** admin123

---

## 🤖 AI Tools Usage & Transparency

### Claude (GitHub Copilot) — Responsible Usage Disclosure

#### What Claude Assisted With:
1. **Backend Scaffolding & Boilerplate**

2. **Frontend Component Generation**
   - React component scaffolding
   - Form components (Login, Register, Leave Application, Attendance)
   - Layout wrappers and routing structure
   - Responsive grid layouts using Tailwind CSS

3. **Documentation**   

#### What Was Implemented Manually:
- **All Business Logic** — Leave balance calculations, approval workflows, attendance validation
- **Authentication Flow** — JWT token generation, refresh token mechanism, cookie-based storage
- **API Integration** — Axios interceptors for token refresh, error handling patterns
- **Database Relationships** — Mongoose ref population, query optimization, compound indexes
- **Middleware Implementation** — Role-based access control, request logging, error transformation
- **UI Polish** — Responsive design tweaks, accessibility improvements, user feedback (toasts, forms)

#### Code Reusability & DRY Principle:
- **Utility Functions** (coded in previous project, reused here):
  - `asyncHandler()` — Wrapper for async controller functions to catch errors
  - `ApiError()` — Standardized error response class
  - `ApiResponse()` — Uniform API response format
- **Middleware Reuse**:
  - `verifyJWT` — Token validation middleware
  - `isAdmin` — Role-checking middleware
- **Benefit**: Eliminates try-catch boilerplate, ensures consistent error/response formatting across all endpoints

---

## 🎯 Extra Features Beyond Requirements

### 1. 🔍 **Advanced Attendance Filtering** (Bonus)
The assignment specified "filter by date OR employee", but we implemented simultaneous filtering:
```bash
# Filter by both date AND employee
GET /api/v1/attendance/all?employeeId=<id>&date=2024-12-01

# Filter by employee only
GET /api/v1/attendance/all?employeeId=<id>

# Filter by date only
GET /api/v1/attendance/all?date=2024-12-01

# All records
GET /api/v1/attendance/all
```

### 2. ✅ **Leave Action Tracking** (Bonus)
Leave requests now store action metadata:
- `actionedBy` — ID of admin who approved/rejected
- `actionedAt` — Exact timestamp of decision
- Assignment never mentioned this; purely our addition for audit trails

### 3. 🗄️ **Compound Unique Index** (Bonus)
Enforced at MongoDB level rather than just controller validation:
```javascript
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
```
Prevents duplicate records at the database layer, providing stronger data integrity.

### 4. 🔒 **Double Balance Check** (Bonus)
Leave balance validation performed twice:
1. When employee **applies** for leave
2. When admin **approves** the leave request

Assignment only implied checking once; we added extra validation for consistency.

### 5. 🧪 **Postman Tested**
All endpoints tested and validated in Postman with various scenarios:
- Happy paths (success cases)
- Edge cases (duplicate attendance, insufficient leave balance)
- Error cases (unauthorized, forbidden, not found)
- Token refresh mechanics

---

## ⚙️ Running the Application

### Development Environment
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Backend (Render)
npm start

# Frontend (Vercel)
npm run build
# Vercel automatically deploys after build
```

---

## 📊 Project Structure

```
MiniHR_System/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js        # Auth, profile, employee listing
│   │   │   ├── leave.controller.js       # Leave CRUD, approval logic
│   │   │   └── attendance.controller.js  # Attendance mark, history, filtering
│   │   ├── models/
│   │   │   ├── user.model.js             # User schema + JWT generation methods
│   │   │   ├── leave.model.js            # Leave schema + relationships
│   │   │   └── attendance.model.js       # Attendance schema + unique index
│   │   ├── routes/
│   │   │   ├── user.routes.js            # Public/Protected/Admin routes
│   │   │   ├── leave.routes.js           # Employee & Admin leave endpoints
│   │   │   └── attendance.routes.js      # Employee & Admin attendance endpoints
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   └── role.middleware.js        # Admin role enforcement
│   │   ├── utils/
│   │   │   ├── asyncHandler.js           # Error-catching wrapper for async functions
│   │   │   ├── ApiError.js               # Standard error response class
│   │   │   ├── ApiResponse.js            # Standard success response class
│   │   │   └── multer.middleware.js      # File upload setup (unused, from template)
│   │   ├── db/
│   │   │   └── index.js                  # MongoDB connection
│   │   ├── app.js                        # Express app setup, middleware, routes
│   │   ├── index.js                      # Server entry point
│   │   └── package.json
│   └── .env                              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                  # Axios instance + token refresh interceptor
│   │   ├── components/
│   │   │   ├── Layout.jsx                # Main layout wrapper (navbar, sidebar, content)
│   │   │   ├── Navbar.jsx                # Fixed top navigation bar
│   │   │   ├── Sidebar.jsx               # Fixed left sidebar with nav links
│   │   │   ├── ProtectedRoute.jsx        # Route guard for authenticated users
│   │   │   ├── AdminRoute.jsx            # Route guard for admin-only pages
│   │   │   └── ui/                       # shadcn/ui components
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global auth state (login, logout, user data)
│   │   ├── pages/
│   │   │   ├── Login.jsx                 # Employee/Admin login form
│   │   │   ├── Register.jsx              # Employee registration form
│   │   │   ├── Profile.jsx               # User profile display (get /users/me)
│   │   │   ├── employee/
│   │   │   │   ├── Dashboard.jsx         # Leave balance, recent leave, attendance summary
│   │   │   │   ├── ApplyLeave.jsx        # Apply for leave form
│   │   │   │   ├── MyLeaves.jsx          # View, edit, cancel leave requests
│   │   │   │   ├── MarkAttendance.jsx    # Daily attendance marking
│   │   │   │   └── AttendanceHistory.jsx # View attendance records
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx         # Overview stats, pending leaves
│   │   │       ├── LeaveApprovals.jsx    # Approve/reject leave requests
│   │   │       ├── AttendanceManager.jsx # View all attendance, filter by date/employee
│   │   │       └── EmployeeManager.jsx   # View all employees, individual details
│   │   ├── lib/
│   │   │   └── utils.js                  # Tailwind className merge utility
│   │   ├── services/
│   │   │   └── (API calls via axios)
│   │   ├── App.jsx                       # Main app component, routes, auth check
│   │   ├── main.jsx                      # React entry point
│   │   └── package.json
│   ├── vite.config.js                    # Vite configuration
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── .env                              # Frontend environment variables
│   └── index.html                        # HTML entry point
│
└── README.md                             # This file
```

---

## 🚨 Known Limitations & Issues

### CORS Hardcoding (Main Limitation)
- **Issue**: Frontend URL hardcoded in backend `app.js` instead of using environment variable
- **Reason**: Despite specifying `CORS_ORIGIN` in `.env`, Render.com's deployment had unresolvable CORS failures when using env variable directly
- **Solution**: Hardcoded the verified frontend URL `https://mini-hr-system-topaz.vercel.app/` in `app.js`
- **Impact**: Changing frontend URL requires backend redeploy
- **Workaround**: Future deployments should use a dynamic CORS validation or API Gateway

### Additional Limitations
- **Email Notifications**: Not implemented (mentioned as bonus). Can be added with Nodemailer or AWS SES
- **Pagination**: Not implemented for admin endpoints (mentioned as bonus)
- **File Uploads**: Multer middleware prepared but unused; profile picture uploads not implemented
- **Unit Tests**: Not implemented (mentioned as bonus)
- **Docker Support**: Not implemented (mentioned as bonus)

---

## ⏱️ Time Spent

- **Backend Development**: ~3-4 hours
  - Scaffolding with Claude: ~30 min
  - API implementation (routes, controllers, models): ~2 hours
  - Authentication & role-based access: ~1 hour
  - Testing & debugging: ~30 min

- **Frontend Development**: ~3-4 hours
  - React component scaffolding with Claude: ~1 hour
  - Page implementations: ~1 hours
  - Form handling & API integration: ~1.5 hours
  - Layout fixes & responsive design: ~1 hour
  - Auth flow & context setup: ~30 min

- **Deployment & Configuration**: ~1-2 hours
  - Render backend deployment: ~30 min
  - Vercel frontend deployment: ~30 min
  - CORS troubleshooting: ~1 hour

- **Documentation**: ~45 min
  - README, API docs, comments

**Total Approximate Time: 10-12 hours**

---

## ✅ Completeness Checklist

- ✅ User Registration (employees only, no self-register as admin)
- ✅ Secure Login with JWT
- ✅ Password Hashing (bcryptjs with 10 salt rounds)
- ✅ Profile View (name, email, role, date of joining)
- ✅ Leave Application (Casual, Sick, Paid)
- ✅ Leave Approval/Rejection (admin only)
- ✅ Leave Balance Tracking (starts with 20, decreases on approval)
- ✅ Leave History (employees view own, admins view all)
- ✅ Attendance Marking (Present/Absent, one per day per employee)
- ✅ Attendance History (employees view own, admins view all with filters)
- ✅ Admin User Management (view employees, individual details)
- ✅ Protected API Routes (401, 403, 404 status codes)
- ✅ Role-Based Access Control (employee vs admin)
- ✅ Responsive UI (React + Tailwind + shadcn/ui)
- ✅ Logout Functionality
- ✅ Error Messages & Success Notifications
- ✅ Deployed (Vercel + Render)
- ✅ Documentation & README

---

## 🔗 Links & Resources

- **GitHub Repository**: [aayushmathur15/MiniHR_System](https://github.com/aayushmathur15/MiniHR_System)
- **Frontend URL**: https://mini-hr-system-topaz.vercel.app/
- **Backend API**: https://minihr-system.onrender.com/api/v1
- **Tech Stack Documentation**:
  - [Express.js](https://expressjs.com/)
  - [MongoDB & Mongoose](https://mongoosejs.com/)
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)

---
