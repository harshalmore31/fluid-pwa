# TeamSync - Architecture Documentation

## System Architecture

### Overview
TeamSync follows a modern full-stack architecture using Next.js 14+ with the App Router, Supabase as the backend, and a component-based UI architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Next.js React Components (TypeScript)              │  │
│  │   - UI Components (shadcn-style)                     │  │
│  │   - Page Components                                   │  │
│  │   - State Management (Zustand)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server (Vercel)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   API Routes (Serverless Functions)                  │  │
│  │   - /api/users, /api/hackathons, /api/teams         │  │
│  │   - Authentication Middleware                         │  │
│  │   - Request Validation (Zod)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓ REST API / Realtime
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   PostgreSQL Database (with RLS)                     │  │
│  │   - Users, Teams, Hackathons, etc.                   │  │
│  │   - Triggers & Functions                             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Supabase Auth                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Supabase Realtime (WebSocket)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Supabase Storage                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Deep Dive

### Frontend Layer

#### Next.js 14 (App Router)
- **Server Components**: Default for better performance
- **Client Components**: Used where interactivity is needed
- **API Routes**: Serverless functions for backend logic
- **Middleware**: Authentication and route protection

#### React & TypeScript
- **Type Safety**: Full TypeScript coverage
- **Component Patterns**: Functional components with hooks
- **Code Splitting**: Automatic with Next.js

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: shadcn/ui-inspired design
- **Responsive**: Mobile-first approach
- **Animations**: CSS transitions and keyframes

#### State Management
- **Zustand**: Lightweight global state
- **SWR**: Data fetching and caching
- **React Hooks**: Local component state

### Backend Layer

#### Supabase PostgreSQL
- **Database**: Robust relational database
- **Row-Level Security (RLS)**: Fine-grained access control
- **Triggers**: Automated score calculations
- **Indexes**: Optimized query performance

#### Supabase Auth
- **Magic Links**: Email-based authentication
- **Email Validation**: @vit.edu.in domain enforcement
- **Session Management**: Secure JWT tokens
- **Middleware Integration**: Seamless with Next.js

#### Supabase Realtime
- **WebSocket Connections**: Real-time updates
- **Presence**: Online status tracking
- **Broadcast**: Team chat functionality

---

## Data Flow Patterns

### 1. Authentication Flow

```
User
  → Enters email (@vit.edu.in)
    → Next.js validates domain
      → Supabase Auth sends magic link
        → User clicks link
          → Supabase Auth creates session
            → Middleware validates session
              → User redirected to dashboard
```

### 2. Team Formation Flow

```
User A (Looking for Team)
  → Browses hackathon participants
    → Views User B's profile
      → Clicks "Invite to Team"
        → API creates team_invite record
          → Notification sent to User B
            → User B accepts invite
              → API creates team_member record
                → Both users see updated team
```

### 3. Performance Score Calculation

```
Admin
  → Updates hackathon results
    → API updates user_hackathons table
      → Database trigger fires
        → calculate_performance_score() function runs
          → Calculates new score
            → Updates users table
              → User sees updated badge
```

### 4. Real-time Chat

```
User A (Team Member)
  → Types message in chat
    → Client sends to API
      → API inserts into team_chat_messages
        → Supabase Realtime broadcasts
          → All team members receive update
            → Chat UI updates in real-time
```

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────┐
│    USERS    │
│ (Profile)   │
└──────┬──────┘
       │
       ├───────────────────────┐
       │                       │
       ↓                       ↓
┌─────────────┐         ┌─────────────┐
│ USER_SKILLS │         │USER_HACKATHONS│
│ (M:M)       │         │ (Participation)│
└──────┬──────┘         └──────┬────────┘
       │                       │
       ↓                       ↓
┌─────────────┐         ┌─────────────┐
│   SKILLS    │         │ HACKATHONS  │
│ (Catalog)   │←────────┤ (Events)    │
└─────────────┘         └──────┬──────┘
                               │
                               ↓
                        ┌─────────────┐
                        │    TEAMS    │
                        │ (Groups)    │
                        └──────┬──────┘
                               │
                ┌──────────────┼──────────────┐
                ↓              ↓              ↓
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │TEAM_MEMBERS  │ │TEAM_INVITES  │ │TEAM_CHAT     │
        │ (M:M)        │ │ (Pending)    │ │ (Messages)   │
        └──────────────┘ └──────────────┘ └──────────────┘
```

### Key Design Decisions

#### 1. **User Skills (M:M with Endorsements)**
- Junction table with `endorsed_by` array
- Allows skill endorsements from teammates
- Efficient querying with indexes

#### 2. **Performance Scoring**
- Calculated field in users table
- Updated via database trigger
- Avoids recalculation on every query

#### 3. **Team Applications vs Invites**
- Separate tables for clarity
- Different workflows (apply vs invite)
- Both lead to team_members on acceptance

#### 4. **Connections (Self-referential)**
- Constraint: user1_id < user2_id
- Prevents duplicate connections
- Efficient bidirectional lookup

---

## API Architecture

### RESTful API Design

All API routes follow REST conventions:

```
/api/users
  GET    /           - List users (with filters)
  GET    /me         - Get current user
  GET    /:id        - Get user by ID
  PATCH  /me         - Update current user
  POST   /me/skills  - Add skill
  DELETE /me/skills/:id - Remove skill

/api/hackathons
  GET    /           - List hackathons (with filters)
  GET    /:id        - Get hackathon details
  POST   /           - Create hackathon (admin)
  PATCH  /:id        - Update hackathon (admin)
  DELETE /:id        - Delete hackathon (admin)
  POST   /:id/participate - Mark participation

/api/teams
  GET    /           - List teams
  GET    /:id        - Get team details
  POST   /           - Create team
  PATCH  /:id        - Update team (leader)
  DELETE /:id        - Delete team (leader)
  POST   /:id/apply  - Apply to team
  POST   /:id/invite - Invite user (leader)
  POST   /:id/applications/:appId/accept
  POST   /:id/applications/:appId/reject
  POST   /:id/leave  - Leave team
  DELETE /:id/members/:userId - Remove member

/api/notifications
  GET    /           - List notifications
  PATCH  /:id/read   - Mark as read

/api/performance
  GET    /me         - Get my performance

/api/recommendations
  GET    /teammates  - Get teammate suggestions
```

### Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

---

## Security Architecture

### Defense in Depth

#### Layer 1: Network (Vercel/Supabase)
- HTTPS only
- CORS configuration
- Rate limiting

#### Layer 2: Application (Next.js)
- Middleware authentication check
- Input validation (Zod schemas)
- CSRF protection

#### Layer 3: Database (Supabase RLS)
- Row-level security policies
- User-based access control
- Admin privilege checks

### RLS Policy Examples

**Users Table:**
```sql
-- Anyone can view profiles
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

**Teams Table:**
```sql
-- Anyone can view teams
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT USING (true);

-- Only team leader can update
CREATE POLICY "Team leaders can update teams" ON teams
  FOR UPDATE USING (auth.uid()::text = leader_id::text);
```

### Authentication Flow Security

1. **Email Validation**: Server-side check for @vit.edu.in
2. **Magic Link**: Time-limited, single-use tokens
3. **Session Management**: Secure HTTP-only cookies
4. **Token Refresh**: Automatic session renewal

---

## Performance Optimization

### Database Optimization

#### Indexes
- **users**: `email`, `roll_no`, `performance_score DESC`
- **teams**: `hackathon_id`, `leader_id`, `is_open`
- **team_chat_messages**: `(team_id, created_at DESC)`
- **notifications**: `user_id`, `is_read`, `created_at DESC`

#### Query Optimization
- **Pagination**: 20 items per page
- **Selective Fetching**: Only needed columns
- **Join Optimization**: Proper foreign key relationships

### Frontend Optimization

#### Next.js Features
- **Automatic Code Splitting**: Per-route bundles
- **Image Optimization**: next/image component
- **Font Optimization**: next/font

#### Caching Strategy
- **SWR**: Client-side cache with revalidation
- **Static Generation**: Landing page
- **Server Components**: Reduced client JS

### Real-time Optimization

#### Supabase Realtime
- **Selective Subscriptions**: Only active team chats
- **Cleanup**: Unsubscribe on unmount
- **Throttling**: Message rate limiting

---

## Scalability Considerations

### Horizontal Scaling

#### Stateless Architecture
- No server-side session storage
- All state in database or client
- Easy to add more servers

#### Database Scaling
- **Read Replicas**: For read-heavy queries
- **Connection Pooling**: Supabase handles this
- **Caching Layer**: Can add Redis later

### Vertical Scaling

#### Database
- Upgrade Supabase plan
- More CPU/RAM for complex queries
- Larger storage capacity

#### Serverless Functions
- Automatically scale with Vercel
- Cold start optimization
- Edge function deployment

---

## Monitoring & Logging

### Application Monitoring

#### Metrics to Track
- API response times
- Error rates
- User authentication success/failure
- Database query performance

#### Tools
- **Vercel Analytics**: Page views, performance
- **Supabase Dashboard**: Database metrics
- **Sentry** (future): Error tracking

### Logging Strategy

#### Structured Logging
```typescript
{
  timestamp: ISO8601,
  level: 'info' | 'warn' | 'error',
  message: string,
  context: {
    userId: string,
    action: string,
    ...
  }
}
```

---

## Testing Strategy

### Unit Tests
- **Utilities**: Pure functions
- **Components**: React Testing Library
- **API Routes**: Mock Supabase client

### Integration Tests
- **Auth Flow**: End-to-end
- **Team Formation**: Complete workflow
- **Performance Calculation**: Database triggers

### E2E Tests (Future)
- **Playwright**: Full user journeys
- **Critical Paths**: Signup → Team → Chat

---

## Deployment Architecture

### Development
```
Local Machine
  → Next.js Dev Server (port 3000)
    → Supabase Cloud (dev project)
```

### Production
```
GitHub
  → Vercel (CI/CD)
    → Next.js Production Build
      → Deployed to Edge Network
        → Supabase Cloud (prod project)
```

### Environment Variables
- **Development**: `.env.local`
- **Production**: Vercel Environment Variables
- **Staging**: Separate Supabase project

---

## Future Architecture Enhancements

### Phase 2
- **Redis Cache**: For frequently accessed data
- **CDN**: For static assets
- **Email Service**: Custom email notifications
- **Analytics**: User behavior tracking

### Phase 3
- **Microservices**: Separate matching algorithm
- **Message Queue**: Async job processing
- **ML Model**: Advanced teammate matching
- **GraphQL**: Efficient data fetching

---

## Conclusion

TeamSync's architecture is designed for:
- **Scalability**: Handle growing user base
- **Security**: Multiple layers of protection
- **Performance**: Fast and responsive
- **Maintainability**: Clean, modular code
- **Extensibility**: Easy to add features

The combination of Next.js and Supabase provides a solid foundation for a production-ready hackathon team formation platform.
