# MarkMyCampus 🗺️

A dynamic campus map application that allows students to log in, mark points of interest on an interactive map, and visualize data through heat maps. This tool helps Student Government Associations (SGA) identify high-traffic areas and locations where students need improvements like benches, study spaces, or other amenities.

## 📋 Project Overview

This project enables your SGA to:
- Collect student input on campus locations of interest
- Visualize high-traffic areas with color-coded heat maps
- Make data-driven decisions about where to add benches, study spaces, etc.
- Categorize feedback by type (seating, study areas, social spaces, etc.)

## 🎯 Key Features

- **User Authentication**: Secure login and registration system
- **Interactive Campus Map**: Click anywhere on the map to mark points of interest
- **Category Selection**: Mark different types of needs (seating, study spaces, social areas, food/dining)
- **Heat Map Visualization**: Color-coded heat maps showing areas with the most student interest
- **Statistics Dashboard**: View aggregated data by category to inform decision-making
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

```
MarkMyCampus/
├── docs/
│   ├── SETUP_GUIDE.md         # Step-by-step setup instructions
│   ├── BACKEND_GUIDE.md       # Backend implementation guide
│   ├── FRONTEND_GUIDE.md      # Frontend implementation guide
│   └── API_REFERENCE.md       # API endpoint documentation
├── public/
│   ├── index.html             # Main HTML page (to be created)
│   ├── css/
│   │   └── style.css          # Styling (to be created)
│   └── js/
│       └── app.js             # Frontend logic (to be created)
├── server.js                   # Express server (to be created)
├── .gitignore                  # Git ignore file
├── package.json                # NPM dependencies (to be created)
└── README.md                   # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **SQLite3**: Lightweight database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-session**: Session management

### Frontend
- **HTML5/CSS3**: Structure and styling
- **JavaScript (Vanilla)**: Frontend logic
- **Leaflet.js**: Interactive map library
- **Leaflet.heat**: Heat map plugin

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Basic knowledge of JavaScript, HTML, and CSS
- A code editor (VS Code, Sublime Text, etc.)

### Quick Start

1. **Follow the Setup Guide**
   - Start with `docs/SETUP_GUIDE.md` for initial project setup
   
2. **Build the Backend**
   - Follow `docs/BACKEND_GUIDE.md` to create the server and API
   
3. **Build the Frontend**
   - Follow `docs/FRONTEND_GUIDE.md` to create the user interface
   
4. **Reference the API**
   - Use `docs/API_REFERENCE.md` for endpoint details

Each guide provides step-by-step instructions with code snippets and explanations.

## 📖 Documentation

All implementation guides are located in the `docs/` directory:

1. **SETUP_GUIDE.md** - Initial project setup, installing dependencies, and project structure
2. **BACKEND_GUIDE.md** - Building the Express server, database, and API endpoints
3. **FRONTEND_GUIDE.md** - Creating the HTML, CSS, and JavaScript for the user interface
4. **API_REFERENCE.md** - Complete API endpoint documentation with examples

## 💡 How It Works

1. **Students** log in and click on the campus map to mark locations of interest
2. **Each mark** is saved with a category (e.g., "Need Seating") and optional description
3. **The heat map** visualizes areas with many marks using color gradients (blue → yellow → red)
4. **SGA members** can view the heat map and statistics to make informed decisions

## 🎨 Customization

- Change campus map coordinates in the frontend
- Add custom categories for marking
- Modify color schemes and styling
- Add additional features like comments or voting

## 👤 Author

**Mastermou8** - Developer and creator of MarkMyCampus

## 📄 License

ISC

---

**Ready to explore?** Start with `docs/SETUP_GUIDE.md`!
