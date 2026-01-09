# Setup Guide 🚀

This guide will walk you through setting up the MarkMyCampus project from scratch.

## Step 1: Prerequisites

Before you begin, make sure you have:

1. **Node.js** installed (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **A code editor** (recommended: VS Code)
   - Download from: https://code.visualstudio.com/

4. **Git** (for version control)
   - Download from: https://git-scm.com/

## Step 2: Project Initialization

1. **Navigate to the project directory**:
   ```bash
   cd MarkMyCampus
   ```

2. **Initialize npm** (if not already done):
   ```bash
   npm init -y
   ```
   
   This creates a `package.json` file with default settings.

3. **Update package.json**:
   Edit the `package.json` file and modify the `scripts` section:
   ```json
   {
     "name": "markmycampus",
     "version": "1.0.0",
     "description": "A dynamic campus map for marking points of interest",
     "main": "server.js",
     "scripts": {
       "start": "node server.js",
       "dev": "node server.js"
     },
     "keywords": ["campus", "map", "heatmap", "sga"],
     "author": "Your Name",
     "license": "ISC"
   }
   ```

## Step 3: Install Dependencies

Install all required npm packages:

```bash
npm install express sqlite3 bcryptjs jsonwebtoken express-session body-parser cors
```

### What each package does:

- **express**: Web application framework for Node.js
- **sqlite3**: Lightweight database (no separate database server needed)
- **bcryptjs**: Hash passwords securely
- **jsonwebtoken**: Create and verify JWT tokens for authentication
- **express-session**: Manage user sessions
- **body-parser**: Parse incoming request bodies
- **cors**: Enable Cross-Origin Resource Sharing (if needed)

## Step 4: Verify Directory Structure

Make sure your project has this structure:

```
MarkMyCampus/
├── docs/                    # Documentation files (current folder)
├── public/                  # Frontend files (HTML, CSS, JS)
│   ├── css/                # Stylesheets
│   └── js/                 # JavaScript files
├── .gitignore              # Files to ignore in git
├── package.json            # Project dependencies
└── README.md               # Project overview
```

The `node_modules/` folder will be created automatically when you install packages.

## Step 5: Create Missing Directories

If any directories are missing, create them:

```bash
mkdir -p public/css public/js
```

## Step 6: Verify Installation

Check that everything is installed correctly:

```bash
npm list --depth=0
```

You should see all the packages listed.

## Step 7: Environment Setup (Optional but Recommended)

For better security, create a `.env` file in the root directory:

```bash
touch .env
```

Add the following content:
```
PORT=3000
SECRET_KEY=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

To use environment variables, install the `dotenv` package:
```bash
npm install dotenv
```

## Common Issues and Solutions

### Issue: npm install fails
**Solution**: Try clearing the npm cache:
```bash
npm cache clean --force
npm install
```

### Issue: Permission errors on Linux/Mac
**Solution**: Don't use sudo with npm. Fix permissions:
```bash
sudo chown -R $USER ~/.npm
```

### Issue: Node version too old
**Solution**: Update Node.js to the latest LTS version from nodejs.org

## Next Steps

Now that your project is set up:

1. ✅ You've installed all dependencies
2. ✅ Your directory structure is ready
3. ✅ You're ready to build!

**Continue to**: `BACKEND_GUIDE.md` to create the server and database.
