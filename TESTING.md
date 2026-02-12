# Testing Guide

This guide covers how to test all features of the Smart Bookmark App to ensure everything works correctly.

## Pre-Deployment Testing (Local)

### 1. Authentication Tests

#### Test: Google Login

1. Navigate to `http://localhost:3000`
2. Click "Sign in with Google"
3. **Expected**: Redirects to Google OAuth page
4. Select your Google account
5. **Expected**: Redirects back to `/dashboard`
6. **Expected**: Shows your email in the header

#### Test: Session Persistence

1. Log in successfully
2. Refresh the page
3. **Expected**: Still logged in, stays on dashboard
4. Close browser completely
5. Reopen browser and navigate to app
6. **Expected**: Still logged in (if session is recent)

#### Test: Protected Routes

1. Log out
2. Try to manually navigate to `/dashboard`
3. **Expected**: Automatically redirected to `/` (login page)

#### Test: Logout

1. Log in
2. Click "Logout" button
3. **Expected**: Redirected to login page
4. Try to go back to `/dashboard`
5. **Expected**: Redirected to login page

### 2. Bookmark Management Tests

#### Test: Add Bookmark (Valid)

1. Log in to dashboard
2. Fill in the form:
   - Title: "Google"
   - URL: "https://google.com"
3. Click "Add Bookmark"
4. **Expected**: 
   - Form clears
   - Bookmark appears in the list
   - Shows correct title and URL

#### Test: Add Bookmark (Invalid URL)

1. Fill in the form:
   - Title: "Test"
   - URL: "not-a-valid-url"
2. Click "Add Bookmark"
3. **Expected**: Error message "Please enter a valid URL"

#### Test: Add Bookmark (Empty Fields)

1. Leave title empty, add URL
2. Click "Add Bookmark"
3. **Expected**: Error "Title is required"
4. Leave URL empty, add title
5. Click "Add Bookmark"
6. **Expected**: Error "URL is required"

#### Test: View Bookmarks

1. Add 3-5 bookmarks
2. **Expected**:
   - All bookmarks display
   - Newest bookmark appears first
   - Each shows title, URL, and timestamp
   - Each has "Visit" and "Delete" buttons

#### Test: Visit Bookmark

1. Click "Visit" on any bookmark
2. **Expected**: Opens URL in new tab
3. **Expected**: Original tab stays on dashboard

#### Test: Delete Bookmark

1. Click "Delete" on a bookmark
2. **Expected**: 
   - Bookmark immediately disappears
   - No page refresh needed
   - Other bookmarks remain

### 3. Real-time Sync Tests

#### Test: Cross-Tab Insert

1. Open app in **Tab A** (logged in)
2. Open app in **Tab B** (same browser, same user)
3. In **Tab A**: Add a bookmark
4. **Expected**: Bookmark appears in **Tab B** instantly (within 1 second)
5. **Expected**: No page refresh needed in Tab B

#### Test: Cross-Tab Delete

1. Keep both tabs open
2. In **Tab A**: Delete a bookmark
3. **Expected**: Bookmark disappears in **Tab B** instantly
4. **Expected**: No page refresh needed

#### Test: Multiple Rapid Changes

1. Keep both tabs open
2. In **Tab A**: Rapidly add 5 bookmarks
3. **Expected**: All 5 appear in **Tab B** in real-time
4. **Expected**: Correct order maintained

### 4. Security Tests

#### Test: User Isolation

1. Log in as **User A**
2. Add some bookmarks
3. Log out
4. Log in as **User B** (different Google account)
5. **Expected**: User B sees no bookmarks
6. **Expected**: User B cannot see User A's bookmarks

#### Test: RLS Enforcement

This requires database access:

1. Log in and note your user_id
2. In Supabase SQL Editor, try:
   ```sql
   SELECT * FROM bookmarks WHERE user_id != '<your-user-id>';
   ```
3. **Expected**: Returns empty (you can only see your own)

### 5. Responsive Design Tests

#### Test: Mobile (320px - 767px)

1. Open Chrome DevTools
2. Toggle device toolbar
3. Select "iPhone SE" or similar
4. **Expected**:
   - Login page looks good
   - Dashboard is single column
   - Form is full width
   - Bookmarks stack vertically
   - Buttons are touch-friendly (min 44px height)

#### Test: Tablet (768px - 1023px)

1. Select "iPad" in DevTools
2. **Expected**:
   - Bookmarks in 2-column grid
   - Form looks balanced
   - All elements properly sized

#### Test: Desktop (1024px+)

1. Select "Desktop" or full screen
2. **Expected**:
   - Bookmarks in 3-4 column grid
   - Maximum width constraint
   - Content centered

### 6. Performance Tests

#### Test: Load Time

1. Clear cache
2. Navigate to app
3. Check Network tab in DevTools
4. **Expected**: 
   - Page loads in < 2 seconds
   - No large bundle sizes
   - Assets properly optimized

#### Test: Lighthouse Score

1. Open app in production
2. Open DevTools → Lighthouse
3. Run audit
4. **Expected**:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

### 7. Error Handling Tests

#### Test: Network Interruption

1. Log in
2. Open DevTools → Network tab
3. Set to "Offline"
4. Try to add a bookmark
5. **Expected**: Graceful error (doesn't crash)
6. Reconnect
7. **Expected**: App recovers

#### Test: Session Expiration

1. Log in
2. In Supabase, invalidate session
3. Try to add bookmark
4. **Expected**: Redirects to login or shows auth error

## Post-Deployment Testing (Production)

### 1. Production Authentication

1. Visit production URL
2. Test Google OAuth flow
3. **Expected**: Same as local, but with production domain

### 2. Production Real-time

1. Open production app in 2 different browsers
2. Log in with same account in both
3. Add bookmark in Browser A
4. **Expected**: Appears in Browser B
5. Test from different devices (phone, tablet)

### 3. Production Performance

1. Test from different locations (VPN)
2. Test on 3G/4G network
3. Run Lighthouse audit
4. **Expected**: Same or better than local

### 4. SSL/HTTPS

1. Check URL shows padlock
2. Click padlock
3. **Expected**: Valid SSL certificate
4. **Expected**: Vercel certificate (or your custom domain cert)

## Automated Testing Checklist

Use this checklist for each deployment:

### Authentication
- [ ] Google login works
- [ ] User session persists after refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login
- [ ] Already logged-in users redirect to dashboard

### Bookmarks
- [ ] Add bookmark with valid data works
- [ ] Add bookmark with invalid URL shows error
- [ ] Empty fields show appropriate errors
- [ ] Bookmarks display in correct order
- [ ] Delete bookmark works

### Real-time
- [ ] Open two tabs
- [ ] Add in Tab A → appears in Tab B
- [ ] Delete in Tab A → disappears in Tab B
- [ ] Multiple rapid changes sync correctly

### Security
- [ ] Users only see their own bookmarks
- [ ] Cannot access other users' data
- [ ] RLS policies enforced

### Responsive
- [ ] Mobile view works (< 768px)
- [ ] Tablet view works (768px - 1023px)
- [ ] Desktop view works (1024px+)

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Lighthouse score 90+
- [ ] No console errors

### Production
- [ ] SSL certificate valid
- [ ] Google OAuth works in production
- [ ] Real-time works across devices
- [ ] Environment variables configured

## Regression Testing

After any code changes, test:

1. ✅ Authentication still works
2. ✅ Real-time sync still works
3. ✅ No new console errors
4. ✅ Mobile view still responsive
5. ✅ Lighthouse score hasn't dropped

## Known Limitations

- Real-time updates require active connection
- If Supabase Realtime is down, updates require refresh
- Google OAuth requires internet connection
- Session expires after Supabase timeout (default 1 hour)

## Reporting Issues

If you find a bug:

1. Check browser console for errors
2. Note steps to reproduce
3. Include browser/device info
4. Check if same issue in incognito mode
5. Open GitHub issue with details

## Performance Benchmarks

Expected metrics:

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Largest Contentful Paint**: < 2.5s
- **Total Blocking Time**: < 300ms
- **Cumulative Layout Shift**: < 0.1

## Success Criteria

The app is production-ready when:

✅ All authentication tests pass
✅ All bookmark tests pass  
✅ Real-time sync works reliably
✅ Security tests confirm isolation
✅ Responsive on all devices
✅ Lighthouse score 90+
✅ No console errors
✅ Works in production environment

Happy testing! 🧪
