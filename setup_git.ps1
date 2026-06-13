git init
git branch -M main

# Commit 1
git add README.md .gitignore
git commit -m "docs: Initial commit and README setup"

# Commit 2
git add backend/package.json backend/package-lock.json
git commit -m "chore: Initialize backend dependencies"

# Commit 3
git add backend/server.js
git commit -m "feat: Setup express server and MongoDB connection"

# Commit 4
git add backend/models/User.js
git commit -m "feat: Create User schema and model"

# Commit 5
git add backend/models/Flight.js
git commit -m "feat: Create Flight schema and model"

# Commit 6
git add backend/models/Message.js
git commit -m "feat: Create Message schema and model"

# Commit 7
git add backend/middleware/authMiddleware.js
git commit -m "feat: Implement JWT authentication middleware"

# Commit 8
git add backend/routes/auth.js backend/routes/user.js
git commit -m "feat: Add authentication and user profile routes"

# Commit 9
git add backend/routes/flight.js backend/routes/message.js
git commit -m "feat: Add flight management and messaging routes"

# Commit 10
git add frontend/package.json frontend/package-lock.json frontend/index.html frontend/vite.config.js frontend/eslint.config.js frontend/public/
git commit -m "chore: Initialize frontend React/Vite project"

# Commit 11
git add frontend/src/index.css frontend/src/main.jsx frontend/src/assets/
git commit -m "style: Setup global styles and glassmorphism theme"

# Commit 12
git add frontend/src/api/axios.js frontend/src/context/AuthContext.jsx
git commit -m "feat: Configure axios and AuthContext for state management"

# Commit 13
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx
git commit -m "feat: Build Login and Registration forms"

# Commit 14
git add frontend/src/components/ProtectedRoute.jsx frontend/src/components/layout/Navbar.jsx frontend/src/components/Profile.jsx frontend/src/components/Messages.jsx
git commit -m "feat: Add protected routes, navbar, profile, and messaging components"

# Commit 15
git add frontend/src/pages/company/ frontend/src/pages/passenger/ frontend/src/App.jsx
git commit -m "feat: Finalize company and passenger portals and routing"

# Add anything remaining
git add .
git commit -m "fix: Remaining miscellaneous files"

# Create public repo and push
gh repo create flight-booking-system --public --push --source=.
