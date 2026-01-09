# Quick Start Checklist ✅

Follow this checklist to build MarkMyCampus step by step.

## Phase 1: Setup (30 minutes)

- [ ] Install Node.js from https://nodejs.org/
- [ ] Open terminal/command prompt
- [ ] Navigate to project directory: `cd MarkMyCampus`
- [ ] Run `npm init -y` (if package.json doesn't exist)
- [ ] Install dependencies: `npm install express sqlite3 bcryptjs jsonwebtoken express-session body-parser cors`
- [ ] Read `docs/SETUP_GUIDE.md` for detailed setup instructions

## Phase 2: Backend Development (2-3 hours)

- [ ] Open `server.js` in your code editor
- [ ] Follow `docs/BACKEND_GUIDE.md` step by step
- [ ] Implement database initialization
- [ ] Create authentication routes (register, login, logout)
- [ ] Create marker management routes
- [ ] Create statistics routes
- [ ] Test the server: `npm start`
- [ ] Test API endpoints with curl or Postman

**Checkpoint**: Server should start without errors and respond to API requests

## Phase 3: Frontend Development (3-4 hours)

### HTML Structure
- [ ] Open `public/index.html`
- [ ] Follow `docs/FRONTEND_GUIDE.md` - Part 1
- [ ] Create login/register modal
- [ ] Create main application interface
- [ ] Add map container
- [ ] Add controls and statistics panel

### CSS Styling
- [ ] Open `public/css/style.css`
- [ ] Follow `docs/FRONTEND_GUIDE.md` - Part 2
- [ ] Add base styles
- [ ] Style the modal
- [ ] Style forms and buttons
- [ ] Style the map and controls
- [ ] Add responsive design

### JavaScript Functionality
- [ ] Open `public/js/app.js`
- [ ] Follow `docs/FRONTEND_GUIDE.md` - Part 3
- [ ] Implement authentication logic
- [ ] Initialize Leaflet map
- [ ] Handle map clicks for marking
- [ ] Create heat map visualization
- [ ] Load and display markers
- [ ] Implement statistics display

**Checkpoint**: Login, mark locations, see heat map, view statistics

## Phase 4: Customization (1 hour)

- [ ] Update campus coordinates in `app.js` initMap() function
  - Find your campus on Google Maps
  - Right-click and copy coordinates
  - Replace default coordinates [40.7128, -74.0060]
- [ ] Customize color scheme in `style.css`
- [ ] Adjust category options in `index.html` and `app.js`
- [ ] Update app title and branding

## Phase 5: Testing (1 hour)

- [ ] Start the server: `npm start`
- [ ] Open browser: http://localhost:3000
- [ ] Test user registration
- [ ] Test user login
- [ ] Test marking multiple locations
- [ ] Test different categories
- [ ] Test heat map toggle
- [ ] Test statistics view
- [ ] Test on mobile device (responsive)
- [ ] Test logout functionality

## Phase 6: Documentation & Deployment (Optional)

- [ ] Document any customizations you made
- [ ] Set up environment variables for production
- [ ] Deploy to a hosting service (Heroku, Render, Railway, etc.)
- [ ] Set up proper domain (if needed)
- [ ] Configure HTTPS
- [ ] Share with your SGA team!

## Common Issues & Solutions

### Server won't start
- Check if port 3000 is already in use
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in server.js

### Map doesn't display
- Check browser console for errors (F12)
- Verify Leaflet libraries are loading
- Check network tab for failed requests

### Can't add markers
- Check if you're logged in
- Open browser console and look for errors
- Verify backend is running
- Check authentication token is being sent

### Heat map not showing
- Add multiple markers close together
- Check if heat map layer is toggled on
- Verify Leaflet.heat plugin is loaded

## Resources

- **Documentation**: `/docs` folder
- **Setup Guide**: `docs/SETUP_GUIDE.md`
- **Backend Guide**: `docs/BACKEND_GUIDE.md`
- **Frontend Guide**: `docs/FRONTEND_GUIDE.md`
- **API Reference**: `docs/API_REFERENCE.md`

## Tips for Success

1. **Work incrementally**: Complete one section before moving to the next
2. **Test frequently**: Test each feature as you build it
3. **Read error messages**: They often tell you exactly what's wrong
4. **Use console.log()**: Debug by logging values to the console
5. **Commit often**: Use git to save your progress
6. **Ask for help**: Use the GitHub issues if you get stuck

## Estimated Time

- **Total Time**: 7-9 hours
- **Beginner**: 10-12 hours
- **Experienced**: 5-7 hours

## Success Criteria

Your application is complete when:
- ✅ Users can register and log in
- ✅ Users can click on the map to mark locations
- ✅ Different categories can be selected
- ✅ Heat map shows areas with many marks
- ✅ Statistics display counts by category
- ✅ Application works on mobile devices

---

**Ready to start?** Begin with `docs/SETUP_GUIDE.md`

**Questions?** Check the documentation in the `/docs` folder

**Good luck building MarkMyCampus!** 🗺️🎓
