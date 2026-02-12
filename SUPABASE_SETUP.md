# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Smart Bookmark App.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - Project name: `smart-bookmark-app`
   - Database password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for the database to be provisioned

## Step 2: Create the Database Schema

### Option 1: Using SQL Editor (Recommended)

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert only their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **Run** or press `Ctrl/Cmd + Enter`
5. You should see "Success. No rows returned"

### Option 2: Using Table Editor

If you prefer a GUI approach:

1. Go to **Table Editor**
2. Click **New Table**
3. Name it `bookmarks`
4. Add columns:
   - `id`: uuid, primary key, default: gen_random_uuid()
   - `user_id`: uuid, foreign key to auth.users(id), not null
   - `title`: text, not null
   - `url`: text, not null
   - `created_at`: timestamptz, default: now()
5. Enable RLS
6. Then go to SQL Editor and run just the policies and indexes

## Step 3: Enable Realtime

1. Go to **Database** → **Replication**
2. Scroll down to "Source" section
3. Find the `bookmarks` table
4. Toggle the switch to enable replication
5. Click **Save**

> ⚠️ **Important**: Realtime must be enabled for the cross-tab synchronization to work!

## Step 4: Configure Google OAuth

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click and enable it
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmark App
   - Support email: Your email
   - Authorized domains: (leave empty for now)
7. Application type: **Web application**
8. Name: `Smart Bookmark App`
9. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
10. Authorized redirect URIs:
    - `https://<your-project-ref>.supabase.co/auth/v1/callback`
    
    To find your project ref:
    - Go to Supabase Dashboard → Settings → API
    - Look at the URL: `https://your-project-ref.supabase.co`
    
11. Click **Create**
12. Copy the **Client ID** and **Client Secret**

### Configure in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Enable the Google provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

## Step 5: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

These will be used in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

## Step 6: Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://your-app.vercel.app/**` (after deployment)
4. Click **Save**

## Step 7: Verify Setup

### Test the Database

1. Go to **SQL Editor**
2. Run this query:

```sql
SELECT * FROM bookmarks;
```

You should see an empty result (no rows) but no errors.

### Test RLS Policies

1. Run this query:

```sql
SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
```

You should see 3 policies listed.

### Test Realtime

1. Go to **Database** → **Replication**
2. Verify `bookmarks` table shows as replicated

## Troubleshooting

### Error: "relation 'bookmarks' does not exist"

- You didn't create the table. Run the CREATE TABLE SQL again.

### Error: "permission denied for table bookmarks"

- RLS is enabled but policies aren't created. Run the CREATE POLICY SQL.

### Realtime not working

- Check that replication is enabled for the bookmarks table
- Restart your app after enabling replication

### Google OAuth not working

- Verify redirect URI matches exactly: `https://<project-ref>.supabase.co/auth/v1/callback`
- Make sure Google+ API is enabled in Google Cloud Console
- Check that Client ID and Secret are correctly pasted in Supabase

## Production Deployment Notes

When deploying to production:

1. Update Google OAuth redirect URIs to include your production domain
2. Update Supabase Auth settings with production URL
3. Ensure environment variables are set in Vercel
4. Test the full authentication flow in production

## Security Checklist

- ✅ Row Level Security is enabled
- ✅ Policies prevent users from seeing others' data
- ✅ Foreign key constraint on user_id
- ✅ Indexes created for performance
- ✅ Realtime enabled for live updates
- ✅ Google OAuth properly configured
- ✅ Environment variables not committed to git

## Next Steps

After completing this setup:

1. Copy the API keys to your `.env.local` file
2. Run `npm run dev` to start the development server
3. Test the login flow
4. Add a bookmark and verify it appears
5. Open a second tab and verify real-time sync works

Your Supabase backend is now ready! 🎉
