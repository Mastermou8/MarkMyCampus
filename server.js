/*
    MarkMyCampus - Backend Server
    
    This file will contain:
    1. Express server setup
    2. SQLite database initialization
    3. Authentication routes (register, login, logout)
    4. Marker management routes
    5. Statistics routes
    6. JWT token verification middleware
    
    Follow the BACKEND_GUIDE.md in the docs/ folder for complete implementation.
*/

// TODO: Import required packages
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
// TODO: Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'mou8_1s_so_c0ol_and_1_l0v3_him_a77_dy1an'


// TODO: Setup middleware
//this processes request with json payloads
// - `bodyParser`: Parses JSON and form data from requests
// - `express.static`: Serves your HTML, CSS, and JS files
// - `session`: Manages user sessions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public/
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// TODO: Initialize SQLite database
const db = new sqlite3.Database('./markmycampus.db', (err) => {
    if (err) {
        console.error('could not connect to database', err);
    } else {
        console.log('connected to database');
        initDatabase();
    }
});

// TODO: Create database tables
// **Database Schema**:
// - **users**: Stores user accounts (username, hashed password)
// - **markers**: Stores marked points on the map with category and description

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

// TODO: Add authentication middleware
// TODO: Add authentication routes
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

//USER registration
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

//user login
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

//logout 
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});


// TODO: Add marker routes
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

// get markers (protected route)
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
// TODO: Add statistics routes
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

// TODO: Start server & serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ADMIN ROUTES
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MD30N_FP'; // Change this to a strong password!
const ExcelJS = require('exceljs');

// Admin authentication - simple password check
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid admin password' });
    }

    const adminToken = jwt.sign({ isAdmin: true }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ 
        message: 'Admin login successful', 
        token: adminToken 
    });
});

// Middleware to verify admin token
function authenticateAdmin(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.isAdmin = true;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid admin token' });
    }
}

// Download stats as Excel file
app.get('/api/admin/download-stats', authenticateAdmin, async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Campus Statistics');

        // Add headers
        worksheet.columns = [
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Number of Marks', key: 'count', width: 15 }
        ];

        // Style headers
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF667eea' } };

        // Get stats from database
        db.all('SELECT category, COUNT(*) as count FROM markers GROUP BY category ORDER BY count DESC',
            [],
            async (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching statistics' });
                }

                // Add data rows
                rows.forEach(row => {
                    worksheet.addRow({
                        category: row.category,
                        count: row.count
                    });
                });

                // Generate file
                const fileName = `campus-stats-${new Date().toISOString().split('T')[0]}.xlsx`;
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

                await workbook.xlsx.write(res);
                res.end();
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error generating Excel file' });
    }
});

// Delete a specific marker (admin only)
app.delete('/api/admin/markers/:id', authenticateAdmin, (req, res) => {
    const markerId = req.params.id;

    db.run('DELETE FROM markers WHERE id = ?', [markerId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting marker' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Marker not found' });
        }

        res.json({ message: 'Marker deleted successfully' });
    });
});

// Delete all markers (admin only)
app.post('/api/admin/clear-all-markers', authenticateAdmin, (req, res) => {
    db.run('DELETE FROM markers', function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error clearing markers' });
        }

        res.json({ 
            message: 'All markers deleted successfully',
            deletedCount: this.changes 
        });
    });
});

// Get all markers with user info (admin only)
app.get('/api/admin/markers', authenticateAdmin, (req, res) => {
    db.all(`SELECT m.id, m.latitude, m.longitude, m.category, m.description, 
            m.created_at, u.username FROM markers m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.created_at DESC`, 
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching markers' });
            }
            res.json({ markers: rows });
        }
    );
});

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
