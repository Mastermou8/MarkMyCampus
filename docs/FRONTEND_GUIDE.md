# Frontend Guide 🎨

This guide will help you build the user interface for MarkMyCampus, including the HTML structure, CSS styling, and JavaScript functionality.

## Overview

The frontend consists of three main files:
1. `public/index.html` - HTML structure
2. `public/css/style.css` - Styling
3. `public/js/app.js` - JavaScript logic

## Part 1: HTML Structure

Create `public/index.html`:

### Basic HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarkMyCampus - Campus Heat Map</title>
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <!-- Your CSS -->
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- TODO: Add login modal -->
    <!-- TODO: Add main application -->
    <!-- TODO: Add JavaScript -->
</body>
</html>
```

### Add Login/Register Modal

Add this inside the `<body>` tag:

```html
<!-- Login/Register Modal -->
<div id="authModal" class="modal">
    <div class="modal-content">
        <h2 id="authTitle">Login to MarkMyCampus</h2>
        <div id="authError" class="error-message"></div>
        
        <form id="authForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required minlength="6">
            </div>
            
            <button type="submit" id="authSubmit" class="btn btn-primary">Login</button>
        </form>
        
        <p class="toggle-auth">
            <span id="toggleAuthText">Don't have an account?</span>
            <a href="#" id="toggleAuth">Register here</a>
        </p>
    </div>
</div>
```

### Add Main Application Interface

Add this after the modal:

```html
<!-- Main Application -->
<div id="app" class="hidden">
    <header>
        <div class="container">
            <h1>🗺️ MarkMyCampus</h1>
            <div class="user-info">
                <span id="welcomeUser"></span>
                <button id="logoutBtn" class="btn btn-secondary">Logout</button>
            </div>
        </div>
    </header>

    <div class="container">
        <!-- Instructions -->
        <div class="instructions">
            <h2>How to Use</h2>
            <p>Click anywhere on the campus map to mark a point of interest. Areas with more marks will appear "hotter" on the heat map, helping SGA identify popular areas that may need improvements like benches, study spaces, or other amenities.</p>
        </div>

        <!-- Controls -->
        <div class="controls">
            <div class="control-group">
                <label for="categorySelect">Category:</label>
                <select id="categorySelect">
                    <option value="general">General Interest</option>
                    <option value="seating">Need Seating</option>
                    <option value="study">Study Space</option>
                    <option value="social">Social Area</option>
                    <option value="food">Food/Dining</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="control-group">
                <label for="descriptionInput">Description (optional):</label>
                <input type="text" id="descriptionInput" placeholder="e.g., Need more benches here">
            </div>

            <button id="toggleHeatmap" class="btn btn-primary">Toggle Heat Map</button>
            <button id="viewStats" class="btn btn-secondary">View Statistics</button>
        </div>

        <!-- Map Container -->
        <div id="map"></div>

        <!-- Statistics Panel -->
        <div id="statsPanel" class="stats-panel hidden">
            <h3>Campus Interest Statistics</h3>
            <div id="statsContent"></div>
        </div>
    </div>
</div>
```

### Add Scripts

Add these script tags before the closing `</body>` tag:

```html
<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<!-- Leaflet Heat Plugin -->
<script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
<!-- Your JavaScript -->
<script src="/js/app.js"></script>
```

## Part 2: CSS Styling

Create `public/css/style.css`:

### Reset and Base Styles

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.hidden {
    display: none !important;
}
```

### Modal Styles

```css
.modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
}

.modal-content h2 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}
```

### Form Styles

```css
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    font-weight: 500;
}

.form-group input,
.control-group input,
.control-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}

.form-group input:focus,
.control-group input:focus,
.control-group select:focus {
    outline: none;
    border-color: #667eea;
}
```

### Button Styles

```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #667eea;
    color: white;
}

.btn-primary:hover {
    background-color: #5568d3;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}
```

### Header and Layout Styles

```css
header {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
}

header h1 {
    color: #667eea;
    font-size: 24px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}
```

### Map Styles

```css
#map {
    height: 600px;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}
```

### Add Responsive Design

```css
@media (max-width: 768px) {
    header .container {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }

    .controls {
        flex-direction: column;
    }

    #map {
        height: 400px;
    }
}
```

**💡 Tip**: The full CSS file should include styles for `.instructions`, `.controls`, `.stats-panel`, and error messages. Add styling that matches your school's colors!

## Part 3: JavaScript Functionality

Create `public/js/app.js`:

### Global Variables

```javascript
let map;
let heatLayer;
let markersLayer;
let currentUser = null;
let authToken = null;
let isLoginMode = true;
let showingHeatmap = true;
```

### Initialize Application

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = sessionStorage.getItem('authToken');
    if (token) {
        authToken = token;
        currentUser = {
            username: sessionStorage.getItem('username'),
            userId: sessionStorage.getItem('userId')
        };
        showApp();
    } else {
        showAuthModal();
    }

    // Setup event listeners
    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('toggleAuth').addEventListener('click', toggleAuthMode);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
    document.getElementById('viewStats').addEventListener('click', toggleStats);
});
```

### Authentication Functions

```javascript
async function handleAuth(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = { username: data.username, userId: data.userId };
            sessionStorage.setItem('authToken', authToken);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('userId', data.userId);
            showApp();
        } else {
            showError(data.error || 'Authentication failed');
        }
    } catch (error) {
        showError('Server error. Please try again.');
    }
}
```

### Initialize Map

```javascript
function initMap() {
    // Initialize map - change coordinates to your campus!
    map = L.map('map').setView([40.7128, -74.0060], 16);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Initialize markers layer
    markersLayer = L.layerGroup().addTo(map);
    
    // Add click event to map
    map.on('click', handleMapClick);
    
    // Add a helpful marker at the center
    L.marker([40.7128, -74.0060]).addTo(map)
        .bindPopup('<b>Campus Center</b><br>Click anywhere to mark points of interest!')
        .openPopup();
}
```

### Handle Map Clicks

```javascript
async function handleMapClick(e) {
    const category = document.getElementById('categorySelect').value;
    const description = document.getElementById('descriptionInput').value;
    
    try {
        const response = await fetch('/api/markers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
                category,
                description
            })
        });
        
        if (response.ok) {
            document.getElementById('descriptionInput').value = '';
            loadMarkers(); // Reload markers and heatmap
        }
    } catch (error) {
        console.error('Error adding marker:', error);
    }
}
```

### Load and Display Markers

```javascript
async function loadMarkers() {
    try {
        const response = await fetch('/api/markers', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            markersLayer.clearLayers();
            
            // Add markers to map
            data.markers.forEach(marker => {
                L.circleMarker([marker.latitude, marker.longitude], {
                    radius: 6,
                    fillColor: getCategoryColor(marker.category),
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(markersLayer)
                  .bindPopup(`<h4>${getCategoryLabel(marker.category)}</h4>
                              <p>${marker.description || ''}</p>`);
            });
            
            updateHeatmap(data.markers);
        }
    } catch (error) {
        console.error('Error loading markers:', error);
    }
}
```

### Create Heatmap

```javascript
function updateHeatmap(markers) {
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }
    
    // Prepare heat data
    const heatData = markers.map(m => [m.latitude, m.longitude, 1]);
    
    // Create heatmap layer
    heatLayer = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
            0.0: 'blue',
            0.3: 'cyan',
            0.5: 'lime',
            0.7: 'yellow',
            1.0: 'red'
        }
    });
    
    if (showingHeatmap) {
        heatLayer.addTo(map);
    }
}
```

### Helper Functions

```javascript
function getCategoryLabel(category) {
    const labels = {
        'general': 'General Interest',
        'seating': 'Need Seating',
        'study': 'Study Space',
        'social': 'Social Area',
        'food': 'Food/Dining',
        'other': 'Other'
    };
    return labels[category] || category;
}

function getCategoryColor(category) {
    const colors = {
        'general': '#667eea',
        'seating': '#f093fb',
        'study': '#4facfe',
        'social': '#43e97b',
        'food': '#fa709a',
        'other': '#feca57'
    };
    return colors[category] || '#667eea';
}
```

## Part 4: Customization

### Change Campus Coordinates

In `app.js`, find `initMap()` and update:

```javascript
map = L.map('map').setView([YOUR_LATITUDE, YOUR_LONGITUDE], 16);
```

**How to find your campus coordinates**:
1. Go to Google Maps
2. Right-click on your campus
3. Click on the coordinates to copy them

### Change Color Scheme

In `style.css`, update the gradient:

```css
body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Add More Categories

In `index.html`, add options to the select:

```html
<option value="newcategory">New Category</option>
```

Then add the color in `app.js`:

```javascript
function getCategoryColor(category) {
    const colors = {
        // ... existing colors
        'newcategory': '#YOUR_COLOR'
    };
    return colors[category] || '#667eea';
}
```

## Testing Your Frontend

1. **Start the server**: `npm start`
2. **Open browser**: Go to `http://localhost:3000`
3. **Register an account**: Create a new user
4. **Mark some points**: Click on different areas of the map
5. **Toggle heatmap**: See the areas light up!
6. **View statistics**: Check the aggregated data

## Common Issues

**Issue**: Map doesn't load
**Solution**: Check console for errors, ensure Leaflet libraries are loaded

**Issue**: Markers not showing
**Solution**: Check that backend API is running and returning data

**Issue**: Heat map not displaying colors
**Solution**: Ensure you have multiple markers in close proximity

## Next Steps

✅ Your frontend is complete!

**Continue to**: `API_REFERENCE.md` for detailed API documentation and advanced features.
