#!/bin/bash

# Smart Bookmark App Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Smart Bookmark App Setup"
echo "============================"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: You need to add your Supabase credentials to .env.local"
    echo ""
    echo "Please update the following in .env.local:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "Get these from: Supabase Dashboard → Settings → API"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
else
    echo "✅ .env.local found"
fi

echo ""

# Verify environment variables
source .env.local 2>/dev/null || true

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "your_supabase_url" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL is not set properly"
    echo "Please update .env.local with your Supabase credentials"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_supabase_anon_key" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY is not set properly"
    echo "Please update .env.local with your Supabase credentials"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Setup checklist
echo "📋 Setup Checklist:"
echo ""
echo "Have you completed the following?"
echo ""
echo "1. Created a Supabase project"
read -p "   [y/n]: " supabase_created

if [ "$supabase_created" != "y" ]; then
    echo ""
    echo "Please create a Supabase project first:"
    echo "1. Go to https://supabase.com"
    echo "2. Create new project"
    echo "3. Wait for provisioning"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "2. Created the bookmarks table and RLS policies"
read -p "   [y/n]: " db_created

if [ "$db_created" != "y" ]; then
    echo ""
    echo "Please run the SQL from SUPABASE_SETUP.md"
    echo "See: SUPABASE_SETUP.md → Step 2"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "3. Enabled Realtime for bookmarks table"
read -p "   [y/n]: " realtime_enabled

if [ "$realtime_enabled" != "y" ]; then
    echo ""
    echo "Please enable Realtime:"
    echo "Database → Replication → Enable 'bookmarks' table"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "4. Set up Google OAuth in Supabase"
read -p "   [y/n]: " oauth_setup

if [ "$oauth_setup" != "y" ]; then
    echo ""
    echo "Please set up Google OAuth:"
    echo "See: SUPABASE_SETUP.md → Step 4"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "✅ All prerequisites completed!"
echo ""

# Build test
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Test the login flow with Google"
echo "4. Add a bookmark and test real-time sync"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - TESTING.md - Testing guide"
echo ""
echo "Happy coding! 🚀"
