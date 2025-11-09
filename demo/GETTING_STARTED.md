# Getting Started with TeamSync

## Quick Start Guide

### 🚀 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## Full Setup Instructions

### Step 1: Prerequisites

Make sure you have:
- ✅ Node.js 18 or higher
- ✅ npm or yarn
- ✅ A code editor (VS Code recommended)
- ✅ Supabase account (free tier works!)

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name (e.g., "teamsync-dev")
4. Set a strong database password
5. Choose a region close to you
6. Wait for project to initialize (~2 minutes)

### Step 3: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `lib/database/schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl/Cmd + Enter`
7. Wait for execution to complete (should see "Success. No rows returned")

**What this does:**
- Creates 13 tables (users, teams, hackathons, etc.)
- Sets up Row-Level Security policies
- Creates database triggers for automatic score calculation
- Inserts 48 default skills (React, Python, ML, etc.)

### Step 4: Get API Credentials

1. In Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Find these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (for admin operations)

### Step 5: Configure Environment Variables

1. In the project root, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=vit.edu.in
   ```

### Step 6: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- And 15+ other packages

### Step 7: Run Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Step 8: Open the App

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the **TeamSync landing page** with:
   - Hero section
   - Bento grid features
   - Stats section
   - How it works
   - CTA section

---

## First-Time Usage

### Create Your First User

1. Click **"Sign in with VIT Email"** or **"Get Started"**
2. Enter an email ending with `@vit.edu.in`
   - Example: `john.doe2024@vit.edu.in`
3. Check your email for the magic link
4. Click the link to sign in

**Note:** For testing, you can temporarily disable email verification in Supabase:
- Go to **Authentication** → **Settings**
- Disable "Confirm email"
- Re-enable it before production!

### Make Yourself Admin

After creating your first account:

1. Go to Supabase **SQL Editor**
2. Run this query (replace with your email):
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'your@vit.edu.in';
   ```
3. Refresh the app
4. You should now see an **Admin** link in the navigation

### Create Your First Hackathon (Admin Only)

1. Click **Admin** in the navigation
2. Click **Add Hackathon**
3. Fill in:
   - Name: "Smart India Hackathon 2024"
   - Organizer: "Government of India"
   - Dates: Choose future dates
   - Team size: 2-4
   - Add required skills (React, Python, etc.)
4. Click **Create**

### Create Your Profile

1. Click on your profile icon
2. Fill in your details:
   - Name, Roll No, Branch, Year
   - Add a bio (optional)
   - Upload profile picture (optional)
   - Add your GitHub, LinkedIn, Portfolio links
3. **Add Skills:**
   - Click "Add Skills"
   - Select from the list (React, Python, ML, etc.)
   - Add as many as relevant
4. Click **Save**

---

## Testing the Features

### Test Team Formation

1. **Mark participation:**
   - Go to **Find Hackathons**
   - Click on a hackathon
   - Click **"Mark Participating"**

2. **Create a team:**
   - Click **"Create Team"**
   - Enter team name: "Code Warriors"
   - Add description
   - Select required skills
   - Set as "Open for applications"

3. **Invite someone:**
   - Browse participants
   - Click **"Invite to Team"**

### Test Smart Matching

1. Go to **Find Teammates**
2. See smart suggestions based on:
   - Complementary skills
   - Similar performance scores
   - Your connections
3. Click **"Invite"** on interesting profiles

### Test Performance Scoring

As an admin:

1. Go to **Admin** → **Hackathons**
2. Click on a completed hackathon
3. Click **"Update Results"**
4. Select teams and set:
   - Round reached (0-5)
   - Final rank (Winner, Runner-up, or None)
5. Save results
6. User's performance scores will auto-update!

### Test Real-time Chat

1. Join or create a team
2. Go to **My Teams**
3. Click **"Open Team Dashboard"**
4. Scroll to **Team Chat**
5. Send a message
6. Open the same team in another browser/tab
7. See messages appear in real-time!

---

## Development Tips

### Hot Reload

Next.js has hot reload enabled by default. Any changes to files will automatically refresh the browser.

### Database Changes

If you modify the database schema:

1. Update `lib/database/schema.sql`
2. Run the new SQL in Supabase SQL Editor
3. Update `types/database.types.ts` if needed

### Component Development

All reusable components are in `components/ui/`:
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `badge.tsx`
- `avatar.tsx`
- etc.

Use them in your pages:
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

<Card>
  <Button>Click me</Button>
</Card>
```

### API Routes

Create new API routes in `app/api/`:

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello!' })
}
```

Access at: `http://localhost:3000/api/hello`

---

## Common Issues & Solutions

### Issue: "Cannot connect to Supabase"

**Solution:**
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check your internet connection
4. Make sure you copied the full API keys (they're very long!)

### Issue: "Authentication not working"

**Solution:**
1. Check email domain in `.env.local` is `vit.edu.in`
2. In Supabase, go to **Authentication** → **URL Configuration**
3. Add `http://localhost:3000/**` to redirect URLs
4. Enable email confirmation (or disable for testing)

### Issue: "Performance score is 0"

**Solution:**
1. Make sure the database trigger was created
2. Check if user has any hackathon participations
3. Run manually in SQL Editor:
   ```sql
   SELECT calculate_performance_score('user-id-here');
   ```

### Issue: "Chat not working"

**Solution:**
1. Verify Supabase Realtime is enabled
2. Check browser console for errors
3. Make sure you're a team member
4. Check RLS policies for `team_chat_messages`

### Issue: "Images not uploading"

**Solution:**
1. In Supabase, go to **Storage**
2. Create a bucket named `avatars`
3. Set it to public
4. Update RLS policies to allow uploads

---

## Next Steps

### For Development

1. **Add more features:**
   - Implement onboarding flow
   - Build dashboard pages
   - Create profile pages
   - Add settings page

2. **Enhance UI:**
   - Add loading states
   - Improve error handling
   - Add more animations
   - Make it more responsive

3. **Improve functionality:**
   - Add email notifications
   - Implement push notifications
   - Add more filters
   - Enhance search

### For Production

1. **Set up Vercel:**
   - Connect your GitHub repo
   - Add environment variables
   - Deploy!

2. **Configure Supabase:**
   - Use production project
   - Set up proper RLS policies
   - Configure email templates
   - Set up backups

3. **Add monitoring:**
   - Vercel Analytics
   - Sentry for errors
   - Custom logging

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)

### Project Files
- `README.md` - Overview and features
- `ARCHITECTURE.md` - Technical details
- `lib/database/schema.sql` - Complete database schema

---

## Need Help?

If you're stuck:
1. Check the error message carefully
2. Look at browser console (F12)
3. Check Supabase logs
4. Review the documentation
5. Create an issue on GitHub

---

**Happy Hacking!** 🚀

Built with ❤️ for VIT Students
