# TeamSync Demo

This folder contains a fully client-side demo of the TeamSync hackathon team formation platform. It showcases the primary flows, data structures, and UI surfaces requested in the MVP scope such as onboarding, dashboard, hackathon discovery, team management, matching, notifications, performance analytics, and the admin view.

> **Note:** The experience uses mock data and in-memory state to simulate Supabase-backed behaviour. It is designed for stakeholder walkthroughs and rapid iteration before hooking into production services.

## Getting started

```bash
cd demo
npm install
npm run dev
```

The app runs with Vite on [http://localhost:5173](http://localhost:5173).

## Key highlights

- Email-gated authentication mock and four-step onboarding
- Dashboard with upcoming hackathons, quick actions, activity feed, and recommendations
- Admin-posted hackathon catalogue with filters and detail tabs for overview, participants, and teams
- Team creation, applications, invites, and a realtime-inspired chat simulation
- Performance scoring insights, badge progression, and historical records
- Social discovery features including teammate board and smart suggestions
- Notification centre, profile management, and settings with privacy controls
- Admin panel for hackathon management and community stats

## Extending the demo

The UI and contexts were structured to ease future integration with Supabase:

- Replace the mock data providers in `src/data/mockData.ts` with real API calls
- Swap the auth context with Supabase Auth helpers
- Connect chat events to Supabase Realtime channels
- Map CRUD actions to the API routes outlined in the platform spec

With these changes the demo evolves into a production-ready foundation for the hackathon team formation platform.
