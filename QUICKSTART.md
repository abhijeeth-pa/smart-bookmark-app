# Quick Start Guide

Get the Smart Bookmark App running in 10 minutes.

## 1. Clone & Install (2 min)

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

## 2. Setup Supabase (5 min)

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for provisioning (~2 min)

### Run This SQL
Go to SQL Editor and run:

```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE USING (auth.uid() = user_id);
```

### Enable Realtime
Database → Replication → Enable `bookmarks` table

### Get API Keys
Settings → API → Copy:
- Project URL
- anon public key

## 3. Setup Google OAuth (3 min)

### Google Cloud Console
1. [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth Client ID (Web application)
3. Add redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Copy Client ID & Secret

### Configure Supabase
1. Authentication → Providers → Google
2. Paste Client ID & Secret
3. Save

## 4. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test

1. Click "Sign in with Google"
2. Add a bookmark
3. Open in second tab
4. Watch it sync! ✨

## Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy
vercel
```

Add environment variables in Vercel dashboard, then redeploy.

## Troubleshooting

**OAuth fails**: Check redirect URI matches exactly  
**Real-time not working**: Enable replication in Supabase  
**Can't add bookmarks**: Check RLS policies are created

## Full Docs

- [README.md](README.md) - Complete overview
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Detailed Supabase guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [TESTING.md](TESTING.md) - Testing guide

Done! 🎉
