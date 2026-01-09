# System Architecture 🏗️

This document explains how MarkMyCampus works and how all the pieces fit together.

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        MarkMyCampus                          │
│                    Campus Heat Map System                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │         User Interface              │
        │   (HTML + CSS + JavaScript)         │
        │  - Login/Register Form              │
        │  - Interactive Map (Leaflet.js)     │
        │  - Heat Map Visualization           │
        │  - Statistics Dashboard             │
        └────────────────────────────────────┘
                              │
                              ▼ API Requests (JSON)
        ┌────────────────────────────────────┐
        │       Backend Server               │
        │      (Node.js + Express)           │
        │  - Authentication (JWT)            │
        │  - API Endpoints                   │
        │  - Session Management              │
        └────────────────────────────────────┘
                              │
                              ▼ SQL Queries
        ┌────────────────────────────────────┐
        │         Database                   │
        │         (SQLite)                   │
        │  - Users Table                     │
        │  - Markers Table                   │
        └────────────────────────────────────┘
```

## Component Details

### 1. Frontend (Client Side)

**Location**: `/public` folder

#### index.html
- Structure of the application
- Login/register modal
- Map container
- Control panels
- Statistics display

#### style.css
- Visual styling and layout
- Responsive design
- Color schemes
- Button and form styles

#### app.js
- Client-side logic
- User authentication
- Map interaction
- Heat map rendering
- API communication

**Libraries Used**:
- **Leaflet.js**: Interactive map library
- **Leaflet.heat**: Heat map plugin

### 2. Backend (Server Side)

**Location**: `server.js`

**Responsibilities**:
- Serve static files (HTML, CSS, JS)
- Handle authentication (register, login, logout)
- Manage database operations
- Provide API endpoints
- Validate user input
- Generate JWT tokens

**Key Components**:
```javascript
Express Server
├── Middleware
│   ├── body-parser (parse JSON)
│   ├── express.static (serve files)
│   └── express-session (manage sessions)
├── Database Connection (SQLite)
├── Authentication Middleware (JWT verification)
└── API Routes
    ├── /api/register
    ├── /api/login
    ├── /api/logout
    ├── /api/markers (GET, POST)
    └── /api/stats
```

### 3. Database (SQLite)

**Location**: `campus.db` (auto-created)

#### Tables

**users**
```sql
id          INTEGER PRIMARY KEY
username    TEXT UNIQUE NOT NULL
password    TEXT NOT NULL (hashed with bcrypt)
created_at  DATETIME
```

**markers**
```sql
id          INTEGER PRIMARY KEY
user_id     INTEGER (foreign key → users.id)
latitude    REAL
longitude   REAL
category    TEXT (seating, study, social, food, etc.)
description TEXT
created_at  DATETIME
```

## Data Flow

### User Registration Flow

```
User fills form → Frontend validates → POST /api/register
                                              ↓
                                    Server validates input
                                              ↓
                                    Hash password (bcrypt)
                                              ↓
                                    Save to database
                                              ↓
                                    Generate JWT token
                                              ↓
Frontend ← Return token & user info ← Server
    ↓
Store token in sessionStorage
    ↓
Redirect to map interface
```

### Add Marker Flow

```
User clicks map → Frontend gets coordinates → POST /api/markers
                                                     ↓
                                          Verify JWT token
                                                     ↓
                                          Validate coordinates
                                                     ↓
                                          Save to database
                                                     ↓
Frontend ← Confirm success ← Server
    ↓
Reload markers
    ↓
Update heat map
```

### Heat Map Generation Flow

```
Page loads → GET /api/markers → Server queries database
                                        ↓
Frontend ← Returns all markers ← Server
    ↓
Convert to coordinates array
    ↓
Generate heat map with Leaflet.heat
    ↓
Display color gradient on map
    (blue → cyan → yellow → red)
```

## Authentication System

### JWT (JSON Web Token)

**Token Structure**:
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    id: 1,
    username: "johndoe",
    iat: 1704816000,  // issued at
    exp: 1704902400   // expires (24 hours)
  },
  signature: "..."
}
```

**Flow**:
1. User logs in with username/password
2. Server verifies credentials
3. Server generates JWT token
4. Client stores token (sessionStorage)
5. Client includes token in all API requests
6. Server verifies token before processing requests

### Password Security

- Passwords are hashed using **bcrypt** (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters required

## API Communication

### Request Format

```javascript
fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer JWT_TOKEN_HERE'
    },
    body: JSON.stringify({ data })
})
```

### Response Format

**Success**:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error**:
```json
{
  "error": "Error message"
}
```

## Heat Map Algorithm

The heat map uses a gradient to show intensity:

```
Intensity = Number of markers in area

Colors:
0.0 (low)  → Blue
0.3        → Cyan
0.5        → Lime/Green
0.7        → Yellow
1.0 (high) → Red
```

**Parameters**:
- **Radius**: 25 pixels (area of influence)
- **Blur**: 15 pixels (smoothing)
- **Max Zoom**: 17 (best visibility level)

## Session Management

- **Storage**: sessionStorage (browser)
- **Persistence**: Until browser tab closes
- **Data Stored**:
  - authToken (JWT)
  - username
  - userId

## File Structure

```
MarkMyCampus/
├── docs/                       # Documentation
│   ├── SETUP_GUIDE.md         # Initial setup
│   ├── BACKEND_GUIDE.md       # Server implementation
│   ├── FRONTEND_GUIDE.md      # UI implementation
│   └── API_REFERENCE.md       # API documentation
├── public/                     # Frontend files (served statically)
│   ├── index.html             # Main HTML
│   ├── css/
│   │   └── style.css          # Styling
│   └── js/
│       └── app.js             # Frontend logic
├── server.js                   # Backend server
├── campus.db                   # SQLite database (auto-created)
├── package.json                # Node.js dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
├── QUICK_START.md             # Quick start checklist
└── ARCHITECTURE.md            # This file
```

## Technology Choices

### Why Node.js + Express?
- JavaScript on both frontend and backend
- Easy to learn for beginners
- Large ecosystem of packages
- Fast development

### Why SQLite?
- No separate database server needed
- Zero configuration
- Perfect for small to medium applications
- File-based (portable)

### Why Leaflet.js?
- Open source and free
- Easy to use
- Excellent documentation
- Active community
- Mobile-friendly

### Why JWT?
- Stateless authentication
- No server-side session storage needed
- Can be used across multiple domains
- Industry standard

## Security Considerations

### Current Implementation
✅ Password hashing (bcrypt)
✅ JWT token authentication
✅ SQL injection prevention (parameterized queries)
✅ Input validation

### Production Improvements
- [ ] HTTPS (SSL/TLS)
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Environment variables for secrets
- [ ] Stronger password requirements
- [ ] Account verification (email)
- [ ] Password reset functionality
- [ ] XSS protection
- [ ] CSRF protection

## Scalability

### Current Capacity
- **Users**: Hundreds to low thousands
- **Markers**: Tens of thousands
- **Concurrent Users**: 50-100

### To Scale Further
1. **Database**: Migrate to PostgreSQL or MySQL
2. **Caching**: Add Redis for session management
3. **Load Balancing**: Use multiple server instances
4. **CDN**: Serve static files via CDN
5. **Cloud Storage**: Store database on cloud service

## Extension Ideas

### Features You Could Add

1. **User Profiles**
   - Profile pictures
   - Bio/description
   - Student year/major

2. **Marker Interactions**
   - Upvote/downvote markers
   - Comments on markers
   - Marker categories filter

3. **Admin Dashboard**
   - View all users
   - Moderate markers
   - Export data as CSV
   - Generate reports

4. **Notifications**
   - Email updates to SGA
   - Push notifications
   - Daily/weekly digests

5. **Advanced Analytics**
   - Time-based heat maps
   - Trending locations
   - Category comparisons
   - Historical data

6. **Social Features**
   - Share markers
   - Tag friends
   - Create groups

## Troubleshooting

### Common Issues

**Database locked**
- Only one process can write at a time
- Close other server instances

**Port already in use**
- Another app is using port 3000
- Change PORT in server.js or kill the other process

**Map not loading**
- Check internet connection (Leaflet CDN)
- Check browser console for errors
- Verify tile server is accessible

**Token expired**
- Tokens expire after 24 hours
- User must log in again
- Consider refresh tokens for better UX

## Development Workflow

1. **Code** → Write/modify code
2. **Test** → Run server and test in browser
3. **Debug** → Fix errors, check console
4. **Commit** → Save changes with git
5. **Repeat** → Continue until feature complete

## Deployment Checklist

- [ ] Set environment variables
- [ ] Change SECRET_KEY to strong random value
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add monitoring
- [ ] Test on production environment
- [ ] Update README with deployment URL

---

**Understanding the architecture will help you build, debug, and extend MarkMyCampus!** 🚀
