/*
    MarkMyCampus - Frontend JavaScript
    
    This file will contain:
    1. Authentication logic (login/register)
    2. Map initialization with Leaflet.js
    3. Marker creation and management
    4. Heat map visualization
    5. Statistics display
    6. API communication functions
    
    Follow the FRONTEND_GUIDE.md in the docs/ folder for complete implementation.
*/

// Global variables
let map;
let heatLayer;
let markersLayer;
let currentUser = null;
let authToken = null;
let adminToken = null;
let isLoginMode = true;
let showingHeatmap = true;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // TODO: Check for existing session
    // Check if user is already logged in
    const token = sessionStorage.getItem('authToken');
    const admin = sessionStorage.getItem('adminToken');
    
    if (admin) {
        adminToken = admin;
        showAdminPanel();
    } else if (token) {
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
    document.getElementById('adminLink').addEventListener('click', showAdminLoginModal);
    document.getElementById('backToAuth').addEventListener('click', showAuthModal);
    document.getElementById('adminForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('adminPanelBtn').addEventListener('click', toggleAdminPanel);
    document.getElementById('closeAdminBtn').addEventListener('click', closeAdminPanel);
    document.getElementById('adminLogoutBtn').addEventListener('click', handleAdminLogout);
    document.getElementById('downloadStatsBtn').addEventListener('click', downloadDetailedReportAsExcel);
    document.getElementById('viewAllMarkersBtn').addEventListener('click', viewAllMarkersAdmin);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllMarkers);
    document.getElementById('toggleHeatmap').addEventListener('click', toggleHeatmap);
    document.getElementById('viewStats').addEventListener('click', toggleStats);
});
    // TODO: Initialize map function
function initMap() {
    // Initialize map - change coordinates to your campus!
    map = L.map('map').setView([28.148911, -81.848442], 16);
    
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
    L.marker([28.148911, -81.848442]).addTo(map)
        .bindPopup('<b>Campus Center</b><br>Click anywhere to mark points of interest!')
        .openPopup();
}

// TODO: Add authentication functions
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

// TODO: Add marker handling functions
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
// TODO: Add heat map functions
function updateHeatmap(markers) {
    if (heatLayer) {
        map.removeLayer(heatLayer);
    }
    
    // Only create heatmap if there are markers
    if (markers.length === 0) {
        return; // No markers yet, skip heatmap
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
``
// TODO: Add statistics functions
async function toggleStats() {
    const statsPanel = document.getElementById('statsPanel');
    const statsContent = document.getElementById('statsContent');
    
    if (statsPanel.classList.contains('hidden')) {
        try {
            const response = await fetch('/api/stats', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                let html = '<ul>';
                data.stats.forEach(stat => {
                    html += `<li><strong>${getCategoryLabel(stat.category)}:</strong> ${stat.count} marks</li>`;
                });
                html += '</ul>';
                statsContent.innerHTML = html;
                statsPanel.classList.remove('hidden');
            }
        } catch (error) {
            showError('Error loading statistics');
        }
    } else {
        statsPanel.classList.add('hidden');
    }
}

function toggleHeatmap() {
    showingHeatmap = !showingHeatmap;
    if (showingHeatmap && heatLayer) {
        map.addLayer(heatLayer);
    } else if (heatLayer) {
        map.removeLayer(heatLayer);
    }
}

function showApp() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('welcomeUser').textContent = `Welcome, ${currentUser.username}!`;
    initMap();
    loadMarkers();
}

function showAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
    isLoginMode = true;
    updateAuthForm();
}

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateAuthForm();
}

function updateAuthForm() {
    const title = document.getElementById('authTitle');
    const submit = document.getElementById('authSubmit');
    const toggleText = document.getElementById('toggleAuthText');
    
    if (isLoginMode) {
        title.textContent = 'Login to MarkMyCampus';
        submit.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
    } else {
        title.textContent = 'Register for MarkMyCampus';
        submit.textContent = 'Register';
        toggleText.textContent = 'Already have an account?';
    }
    
    document.getElementById('authForm').reset();
    document.getElementById('authError').textContent = '';
}

function handleLogout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    authToken = null;
    currentUser = null;
    showAuthModal();
}

function showError(message) {
    document.getElementById('authError').textContent = message;
}

// ===== ADMIN FUNCTIONS =====
function showAdminLoginModal(e) {
    if (e) e.preventDefault();
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('adminModal').classList.remove('hidden');
    document.getElementById('adminError').textContent = '';
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            adminToken = data.token;
            sessionStorage.setItem('adminToken', adminToken);
            showAdminPanel();
        } else {
            document.getElementById('adminError').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        document.getElementById('adminError').textContent = 'Server error. Please try again.';
    }
}

function showAdminPanel() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('adminModal').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
}

function toggleAdminPanel(e) {
    e.preventDefault();
    document.getElementById('adminPanel').classList.remove('hidden');
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminMarkersPanel').classList.add('hidden');
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    
    // Show appropriate view
    if (authToken && currentUser) {
        // Go back to user app
        document.getElementById('app').classList.remove('hidden');
    } else {
        // Go back to auth modal
        document.getElementById('authModal').classList.remove('hidden');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('adminToken');
    adminToken = null;
    showAuthModal();
}

async function downloadStatsAsExcel() {
    try {
        const response = await fetch('/api/admin/download-stats', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `campus-stats-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('Stats downloaded successfully!');
        } else {
            alert('Error downloading stats');
        }
    } catch (error) {
        alert('Error downloading stats: ' + error.message);
    }
}async function downloadDetailedReportAsExcel() {
    try {
        const response = await fetch('/api/admin/markers', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Create CSV content
            let csv = 'Username,Category,Description,Latitude,Longitude,Date Created\n';
            
            data.markers.forEach(marker => {
                const username = marker.username || 'Unknown';
                const category = getCategoryLabel(marker.category);
                const description = (marker.description || '').replace(/"/g, '""'); // Escape quotes
                const lat = marker.latitude;
                const lng = marker.longitude;
                const date = new Date(marker.created_at).toLocaleString();
                
                csv += `"${username}","${category}","${description}",${lat},${lng},"${date}"\n`;
            });
            
            // Download as CSV (Excel can open this)
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `campus-detailed-report-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('Detailed report downloaded successfully!');
        } else {
            alert('Error downloading report');
        }
    } catch (error) {
        alert('Error downloading report: ' + error.message);
    }
}

async function viewAllMarkers() {
    try {
        const response = await fetch('/api/admin/markers', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const markersPanel = document.getElementById('adminMarkersPanel');
            const markersList = document.getElementById('adminMarkersList');
            
            let html = '<table style="width:100%; border-collapse: collapse;">';
            html += '<tr style="background:#667eea; color:white;"><th style="padding:8px; text-align:left;">Username</th><th style="padding:8px;">Category</th><th style="padding:8px;">Description</th><th style="padding:8px;">Action</th></tr>';
            
            data.markers.forEach(marker => {
                html += `<tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding:8px;">${marker.username || 'Unknown'}</td>
                    <td style="padding:8px;">${getCategoryLabel(marker.category)}</td>
                    <td style="padding:8px;">${marker.description || '-'}</td>
                    <td style="padding:8px;"><button onclick="deleteMarker(${marker.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Delete</button></td>
                </tr>`;
            });
            
            html += '</table>';
            markersList.innerHTML = html;
            markersPanel.classList.remove('hidden');
        }
    } catch (error) {
        alert('Error fetching markers: ' + error.message);
    }
}

async function viewAllMarkersAdmin() {
    try {
        const response = await fetch('/api/admin/markers', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show map container
            const mapDiv = document.getElementById('adminMap');
            mapDiv.style.display = 'block';
            
            // Show markers panel
            const markersPanel = document.getElementById('adminMarkersPanel');
            markersPanel.classList.remove('hidden');
            
            // Check if map already exists
            if (window.adminMapInstance) {
                // Clear existing markers
                window.adminMapInstance.eachLayer(layer => {
                    if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
                        window.adminMapInstance.removeLayer(layer);
                    }
                });
            } else {
                // Create new map
                window.adminMapInstance = L.map('adminMap').setView([28.148911, -81.848442], 15);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(window.adminMapInstance);
            }
            
            const adminMap = window.adminMapInstance;
            const markerBounds = [];
            
            // Add all markers to the map
            data.markers.forEach(marker => {
                markerBounds.push([marker.latitude, marker.longitude]);
                
                const circle = L.circleMarker([marker.latitude, marker.longitude], {
                    radius: 8,
                    fillColor: getCategoryColor(marker.category),
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(adminMap);
                
                // Add popup with all information
                const popupContent = `
                    <div style="width: 250px;">
                        <h4 style="margin: 5px 0; color: #667eea;">${getCategoryLabel(marker.category)}</h4>
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${marker.username || 'Unknown'}</p>
                        <p style="margin: 5px 0;"><strong>Description:</strong> ${marker.description || 'No description'}</p>
                        <p style="margin: 5px 0;"><strong>Location:</strong> ${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(marker.created_at).toLocaleString()}</p>
                        <button onclick="deleteMarker(${marker.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px; margin-top: 5px; width: 100%;">Delete Marker</button>
                    </div>
                `;
                
                circle.bindPopup(popupContent);
            });
            
            // Fit map to show all markers
            if (markerBounds.length > 0) {
                const bounds = L.latLngBounds(markerBounds);
                adminMap.fitBounds(bounds, { padding: [50, 50] });
            } else {
                // If no markers, just show the campus
                adminMap.setView([28.148911, -81.848442], 15);
            }
            
            // Display markers list below map
            const markersList = document.getElementById('adminMarkersList');
            
            let html = '<table style="width:100%; border-collapse: collapse;">';
            html += '<tr style="background:#667eea; color:white;"><th style="padding:10px; text-align:left; border: 1px solid #ddd;">Username</th><th style="padding:10px; border: 1px solid #ddd;">Category</th><th style="padding:10px; border: 1px solid #ddd;">Description</th><th style="padding:10px; border: 1px solid #ddd;">Location</th><th style="padding:10px; border: 1px solid #ddd;">Date</th><th style="padding:10px; border: 1px solid #ddd;">Action</th></tr>';
            
            data.markers.forEach(marker => {
                const date = new Date(marker.created_at).toLocaleString();
                html += `<tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding:10px; border: 1px solid #ddd;">${marker.username || 'Unknown'}</td>
                    <td style="padding:10px; border: 1px solid #ddd;">${getCategoryLabel(marker.category)}</td>
                    <td style="padding:10px; border: 1px solid #ddd;">${marker.description || '-'}</td>
                    <td style="padding:10px; border: 1px solid #ddd;">${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)}</td>
                    <td style="padding:10px; border: 1px solid #ddd;">${date}</td>
                    <td style="padding:10px; border: 1px solid #ddd;"><button onclick="deleteMarker(${marker.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Delete</button></td>
                </tr>`;
            });
            
            html += '</table>';
            if (data.markers.length === 0) {
                html = '<p style="text-align: center; color: #666;">No markers yet</p>';
            }
            markersList.innerHTML = html;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching markers: ' + error.message);
    }
}

async function deleteMarker(markerId) {
    if (!confirm('Are you sure you want to delete this marker?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/markers/${markerId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        if (response.ok) {
            alert('Marker deleted successfully!');
            // Refresh the map to show updated markers
            viewAllMarkersAdmin();
        } else {
            alert('Error deleting marker');
        }
    } catch (error) {
        alert('Error deleting marker: ' + error.message);
    }
}

async function clearAllMarkers() {
    if (!confirm('Are you SURE you want to delete ALL markers? This cannot be undone!')) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/clear-all-markers', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`${data.deletedCount} markers deleted successfully!`);
            // Refresh the map to show updated markers
            viewAllMarkersAdmin();
        } else {
            alert('Error clearing markers');
        }
    } catch (error) {
        alert('Error clearing markers: ' + error.message);
    }
}

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