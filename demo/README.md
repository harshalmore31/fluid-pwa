# TeamSync - VIT Hackathon Team Formation Platform

**TeamSync** is a comprehensive hackathon team formation platform designed exclusively for VIT students. It features skill-based matching, performance tracking, real-time collaboration, and seamless team management capabilities.

---

## 🚀 Features

### Core Features

#### 1. **Authentication & Profile Management**
- Email-gated registration (@vit.edu.in only)
- Comprehensive profiles with skills, performance scores, and social links
- Profile visibility settings and editing capabilities

#### 2. **Hackathon Management**
- Admin dashboard for posting and managing hackathons
- Team size limits, required skills, registration deadlines
- Status tracking: Upcoming/Active/Completed
- Students can mark participation interest

#### 3. **Team Formation**
- Browse participants by hackathon filter
- Advanced search & filters (skills, performance, branch, year)
- Team creation with "Open for applications" or "Invite-only" modes
- Application workflow with accept/reject functionality
- Direct invite system for specific users

#### 4. **Performance Scoring System** ⭐
**The key differentiator!**

**Points System:**
- Participation: +10 points
- Round 1 cleared: +20 points
- Round 2 cleared: +30 points
- Finals reached: +50 points
- Won hackathon: +100 points
- Runner-up: +75 points

**Formula:**
```
Performance Score = (Total Points / Total Hackathons) + (Total Hackathons × 2)
```

**Badge System:**
- Beginner: 0-50
- Intermediate: 50-100
- Advanced: 100-200
- Expert: 200+

#### 5. **Smart Matching Algorithm**
AI-powered teammate recommendations based on:
- Complementary skills
- Similar performance scores (±20 range)
- Previous connections
- Branch/year preferences

#### 6. **Real-time Team Chat**
- Powered by Supabase Realtime
- Text-based collaboration
- Team-only access

#### 7. **Notifications**
- Team invites, application status
- Team member changes
- Hackathon deadlines
- Performance updates

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase PostgreSQL
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Data Fetching**: SWR

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   - Open the Supabase SQL Editor
   - Copy and execute `lib/database/schema.sql`

3. Get your credentials from Project Settings → API

### Step 3: Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN=vit.edu.in
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Create Admin User

After signing up, run in Supabase SQL Editor:
```sql
UPDATE users SET is_admin = true WHERE email = 'your-admin@vit.edu.in';
```

---

## 📁 Project Structure

```
demo/
├── app/                    # Next.js app directory
│   ├── (authenticated)/    # Protected routes
│   │   ├── dashboard/
│   │   ├── hackathons/
│   │   ├── teams/
│   │   ├── profile/
│   │   ├── browse/
│   │   └── admin/
│   ├── api/               # API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── shared/
│   ├── dashboard/
│   ├── hackathons/
│   ├── teams/
│   └── admin/
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── database/
│   │   └── schema.sql    # Database schema
│   ├── utils/
│   └── constants.ts
├── types/
│   └── database.types.ts
└── middleware.ts
```

---

## 🔐 Security

- Row-Level Security (RLS) on all tables
- Email domain validation (@vit.edu.in)
- Input sanitization with Zod
- Rate limiting via middleware
- SQL injection prevention

---

## 🤖 Smart Matching Algorithm

```
For user U in hackathon H:

1. Get skills S_u and performance P_u
2. Find participants looking for team
3. For each candidate C:
   - Skill complementarity: SC = (complementary skills) × 10
   - Performance alignment: PC = 100 - |P_u - P_c|
   - Social score: SS = 50 if connected, else 0
   - Total Score = SC + (PC × 0.5) + SS
4. Return top 10 matches
```

---

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Post-deployment:
- Update `NEXT_PUBLIC_APP_URL`
- Configure Supabase Auth redirect URLs

---

## 🐛 Troubleshooting

**Supabase Connection Error**
- Verify `.env.local` credentials
- Check Supabase project status
- Ensure RLS policies are set

**Email Auth Not Working**
- Verify domain validation
- Check Supabase Auth settings
- Configure redirect URLs

**Real-time Chat Issues**
- Enable Supabase Realtime
- Verify RLS policies
- Check browser console

**Performance Score Not Updating**
- Verify database trigger
- Check user_hackathons data
- Run `calculate_performance_score` manually

---

## 🎯 Roadmap

### Current MVP (Phase 1)
- ✅ Authentication & Profiles
- ✅ Hackathon Listing
- ✅ Team Formation
- ✅ Performance Tracking
- ✅ Smart Matching
- ✅ Real-time Chat

### Future (Phase 2)
- Email notifications
- Push notifications
- Mobile app
- Analytics dashboard
- Leaderboards
- Skill verification

### Advanced (Phase 3)
- AI-powered suggestions
- Video chat
- Resume builder
- Multi-university support
- Certification system

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- VIT Student Community
- Supabase
- Next.js Team
- All contributors

---

**Made with ❤️ for VIT's hacking community** 🚀
