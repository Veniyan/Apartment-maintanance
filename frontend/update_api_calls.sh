#!/bin/bash

# Script to update frontend API calls to use JWT authentication
# This script updates UserDashboard.jsx and AdminDashboard.jsx

echo "🔧 Updating frontend components to use JWT authentication..."

FRONTEND_DIR="/home/claude/Apartment-maintanance/frontend/src/components"

# Function to update a dashboard file
update_dashboard() {
    local file=$1
    local backup="${file}.backup"
    
    echo "📝 Updating $file..."
    
    # Create backup
    cp "$file" "$backup"
    
    # Add import for api utility at the top (after existing imports)
    sed -i "/^import.*from 'react-router-dom';/a import { api, logout, isAuthenticated } from '../utils/api';" "$file"
    
    # Replace fetch calls with api utility calls
    # This is a simplified version - manual review recommended
    
    # Replace GET requests
    sed -i "s|fetch(\`http://localhost:8081/api\(.*\)\`)|api.get(\`\1\`)|g" "$file"
    sed -i "s|fetch('http://localhost:8081/api\(.*\)')|api.get('\1')|g" "$file"
    
    # Replace logout function
    sed -i '/const handleLogout = () => {/,/};/{
        s|localStorage.removeItem.*||
        s|navigate.*||
        s|const handleLogout = () => {|const handleLogout = () => {\n        logout();|
    }' "$file"
    
    echo "✅ Updated $file (backup saved as $backup)"
    echo "⚠️  Please manually review the changes and test thoroughly!"
}

# Check if utils/api.js exists
if [ ! -f "/home/claude/Apartment-maintanance/frontend/src/utils/api.js" ]; then
    echo "❌ Error: utils/api.js not found!"
    echo "Please ensure the API utility file exists first."
    exit 1
fi

# Update UserDashboard.jsx
if [ -f "$FRONTEND_DIR/UserDashboard.jsx" ]; then
    echo ""
    echo "⚠️  WARNING: This script makes basic replacements."
    echo "Manual review of the changes is REQUIRED!"
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        update_dashboard "$FRONTEND_DIR/UserDashboard.jsx"
    fi
else
    echo "❌ UserDashboard.jsx not found"
fi

# Update AdminDashboard.jsx
if [ -f "$FRONTEND_DIR/AdminDashboard.jsx" ]; then
    update_dashboard "$FRONTEND_DIR/AdminDashboard.jsx"
else
    echo "❌ AdminDashboard.jsx not found"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Review changes in the dashboard files"
echo "2. Manually update complex fetch() calls (POST, PUT, DELETE)"
echo "3. Test authentication flows"
echo "4. Check file upload functionality"
echo "5. Remove .backup files after confirming changes work"
echo ""
echo "📖 See MIGRATION_GUIDE.js for detailed examples"
