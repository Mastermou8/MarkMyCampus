# Backend Guide 🔧

This guide will help you build the backend server for MarkMyCampus, including the Express server, database, and API endpoints.

## Overview

The backend will handle:
- User authentication (register, login, logout)
- Database operations (SQLite)
- API endpoints for markers and statistics
- Session management

## Step 1: Create server.js

Create a file called `server.js` in the root directory.

### Basic Server Setup

Start with this basic structure:

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// TODO: Add middleware
// TODO: Initialize database
// TODO: Add routes
// TODO: Start server
```

## Step 2: Add Middleware

Middleware processes requests before they reach your routes. Add this after the variable declarations:

```javascript
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public/
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
```

**What this does**:
- `bodyParser`: Parses JSON and form data from requests
- `express.static`: Serves your HTML, CSS, and JS files
- `session`: Manages user sessions

## Step 3: Initialize SQLite Database

Add database initialization code:

```javascript
// Initialize SQLite database
const db = new sqlite3.Database('./campus.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Create tables if they don't exist
function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    console.log('Database tables initialized');
}
```

**Database Schema**:
- **users**: Stores user accounts (username, hashed password)
- **markers**: Stores marked points on the map with category and description

## Step 4: Create Authentication Middleware

This middleware verifies JWT tokens for protected routes:

```javascript
// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1] || req.session.token;
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
}
```

## Step 5: Create API Routes

### 5.1 User Registration

```javascript
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, hashedPassword], 
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }
                
                // Create JWT token
                const token = jwt.sign({ id: this.lastID, username }, SECRET_KEY, { expiresIn: '24h' });
                req.session.token = token;
                res.json({ 
                    message: 'User registered successfully', 
                    token,
                    userId: this.lastID,
                    username 
                });
            });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
```

### 5.2 User Login

```javascript
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        try {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
            req.session.token = token;
            res.json({ 
                message: 'Login successful', 
                token,
                userId: user.id,
                username: user.username 
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});
```

### 5.3 Logout

```javascript
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});
```

### 5.4 Add Marker (Protected Route)

```javascript
app.post('/api/markers', authenticateToken, (req, res) => {
    const { latitude, longitude, category, description } = req.body;
    const userId = req.user.id;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    db.run('INSERT INTO markers (user_id, latitude, longitude, category, description) VALUES (?, ?, ?, ?, ?)',
        [userId, latitude, longitude, category || 'general', description || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error adding marker' });
            }
            res.json({ 
                message: 'Marker added successfully',
                markerId: this.lastID,
                latitude,
                longitude,
                category,
                description
            });
        });
});
```

### 5.5 Get All Markers (Protected Route)

```javascript
app.get('/api/markers', authenticateToken, (req, res) => {
    db.all('SELECT id, latitude, longitude, category, description, created_at FROM markers', 
        [], 
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching markers' });
            }
            res.json({ markers: rows });
        });
});
```

### 5.6 Get Statistics (Protected Route)

```javascript
app.get('/api/stats', authenticateToken, (req, res) => {
    db.all('SELECT category, COUNT(*) as count FROM markers GROUP BY category', 
        [], 
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching statistics' });
            }
            res.json({ stats: rows });
        });
});
```

## Step 6: Serve Frontend

Add a route to serve your main HTML file:

```javascript
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

## Step 7: Start Server

Add the server startup code:

```javascript
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
```

## Step 8: Test Your Server

1. Start the server:
   ```bash
   npm start
   ```

2. You should see:
   ```
   Server running on http://localhost:3000
   Connected to SQLite database
   Database tables initialized
   ```

3. Test with curl (optional):
   ```bash
   # Test registration
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

## Common Issues

**Issue**: Database locked
**Solution**: Make sure only one instance of the server is running

**Issue**: Cannot find module
**Solution**: Run `npm install` to ensure all dependencies are installed

**Issue**: Port already in use
**Solution**: Stop other processes using port 3000 or change the PORT in your code

## Security Notes

⚠️ **Important for Production**:
1. Change the `SECRET_KEY` to a strong, random value
2. Use environment variables for secrets (`.env` file)
3. Enable HTTPS and set `cookie: { secure: true }`
4. Add rate limiting to prevent abuse
5. Validate and sanitize all user inputs

## Next Steps

✅ Your backend is complete!

**Continue to**: `FRONTEND_GUIDE.md` to build the user interface.
