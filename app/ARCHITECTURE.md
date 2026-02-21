# Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  Solana Wallet ──┐                                               │
└──────────────────┼───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Next.js App Router                             │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  Server Comps    │  │  Client Comps     │  │  API Route     │  │
│  │  (RSC)           │  │  (hooks, state)   │  │  (auth cb)     │  │
│  └────────┬────────┘  └────────┬─────────┘  └────────────────┘  │
│           │                    │                                  │
│           ▼                    ▼                                  │
│  ┌─────────────────┐  ┌──────────────────┐                      │
│  │  CMS Client      │  │  Service Layer    │                      │
│  │  (Strapi REST)   │  │  (Supabase impl)  │                      │
│  └────────┬────────┘  └────────┬─────────┘                      │
└───────────┼────────────────────┼────────────────────────────────┘
            │                    │
            ▼                    ▼
┌────────────────────┐  ┌──────────────────┐
│   Strapi CMS       │  │   Supabase       │
│   (course content) │  │   (auth, data)   │
└────────────────────┘  └──────────────────┘
```

**Server Components** fetch course content from Strapi (or mock data) at request time with 60-second revalidation. **Client Components** read user-specific data (progress, XP, streaks) from Supabase via the service layer.

## App Router Structure

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | Landing | No | Marketing page with course highlights |
| `/auth/sign-in` | Sign In | No | Google + GitHub OAuth, wallet connect |
| `/courses` | Catalog | No | Filterable course grid (difficulty, track, search) |
| `/courses/[slug]` | Detail | No | Course overview, module list, enroll button |
| `/courses/[slug]/lessons/[lessonId]` | Lesson | Yes | Content viewer or code challenge with editor |
| `/dashboard` | Dashboard | Yes | Progress cards, XP, streaks, recent activity |
| `/profile` | My Profile | Yes | Public profile with stats and achievements |
| `/profile/[userId]` | User Profile | No | Public view of another user's profile |
| `/leaderboard` | Leaderboard | No | Top users by XP with podium display |
| `/settings` | Settings | Yes | Profile, account, preferences, danger zone |
| `/certificates` | Certificates | Yes | List of earned certificates |
| `/certificates/[id]` | Certificate | Yes | Individual certificate detail view |

All routes are nested under `[locale]/` for i18n support. Protected routes redirect unauthenticated users to `/auth/sign-in`.

## Component Architecture

```
components/
├── ui/                          # shadcn/ui primitives
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── progress.tsx
│   ├── resizable.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   └── tooltip.tsx
├── auth/                        # Authentication
│   ├── protected-route.tsx      # Auth guard (redirects to sign-in)
│   ├── sign-in-buttons.tsx      # OAuth provider buttons
│   ├── wallet-connect-button.tsx
│   └── user-menu.tsx            # Avatar dropdown with sign-out
├── courses/                     # Course-related
│   ├── course-card.tsx          # Course preview card
│   ├── course-card-skeleton.tsx # Loading skeleton
│   ├── course-empty-state.tsx   # "No courses found" state
│   ├── course-filters.tsx       # Difficulty/track/search filters
│   ├── course-grid.tsx          # Responsive course grid
│   └── enroll-button.tsx        # Enrollment action button
├── gamification/                # XP, streaks, achievements
│   ├── achievement-badge.tsx    # Single achievement icon
│   ├── achievement-card.tsx     # Achievement with description
│   ├── achievement-grid.tsx     # Grid of all achievements
│   ├── gamification-indicator.tsx # Navbar XP/streak summary
│   ├── streak-calendar.tsx      # Activity heatmap calendar
│   ├── streak-card.tsx          # Streak info card
│   ├── streak-counter.tsx       # Current streak display
│   ├── xp-event-feed.tsx        # Recent XP events list
│   ├── xp-level-badge.tsx       # Level indicator badge
│   └── xp-level-card.tsx        # XP progress card
├── app-shell.tsx                # Layout: navbar + sidebar + content
├── breadcrumbs.tsx              # Dynamic breadcrumb navigation
├── footer.tsx                   # Site footer
├── language-switcher.tsx        # Locale selector dropdown
├── motion.tsx                   # Framer Motion wrappers (dynamic import)
├── navbar.tsx                   # Top navigation bar
└── providers.tsx                # Provider composition root
```

## Service Interface Layer

The service layer abstracts data access behind typed interfaces, making it easy to swap implementations (e.g., from Supabase to on-chain).

### Interface

```typescript
interface LearningPlatformServices {
  progress: ProgressService;      // Course/lesson progress tracking
  xp: XPService;                  // XP totals, level, recent events
  streak: StreakService;           // Current/longest streak, activity dates
  leaderboard: LeaderboardService; // Rankings by XP
  credentials: CredentialService;  // Course completion certificates
  enrollment: EnrollmentService;   // Enroll/unenroll in courses
  achievements: AchievementService; // Achievement tracking
}
```

### Provider Pattern

```
Providers (providers.tsx)
├── ConnectionProvider (Solana RPC)
│   └── WalletProvider (wallet adapter)
│       └── WalletModalProvider
│           └── TooltipProvider
│               └── ServicesProvider (LearningPlatformServices)
│                   └── {children}
```

Components access services via hooks:

- `useServices()` — throws if called outside provider or on server
- `useServicesMaybe()` — returns `null` on server or before hydration

### Key Services

| Service | Methods | Data Source |
|---------|---------|-------------|
| `ProgressService` | `getProgress`, `getCourseProgress`, `getLessonProgress`, `completeLesson` | `enrollments`, `lesson_progress` |
| `XPService` | `getXP` | `users`, `xp_events` |
| `StreakService` | `getStreak`, `recordActivity`, `getActivityDates` | `streaks` |
| `LeaderboardService` | `getLeaderboard`, `getUserRank` | `users` (sorted by XP) |
| `CredentialService` | `getCredentials` | `enrollments` (completed) |
| `EnrollmentService` | `enroll`, `unenroll`, `isEnrolled` | `enrollments` |
| `AchievementService` | `getAchievements`, `claimAchievement` | `achievements` |

## Data Flow

### Course Content (Server-Side)

```
RSC page.tsx
  → getCourses() / getCourseBySlug()
    → USE_MOCK? return MOCK_COURSES
    → fetchStrapi("/courses", { populate... })
      → transform Strapi entities to flat types
      → revalidate: 60s cache
    → on error: fall back to MOCK_COURSES
  → pass courses as props to client components
```

### User Data (Client-Side)

```
Client component
  → useServices() hook
    → ServicesProvider (React context)
      → SupabaseXPService.getXP(userId)
        → supabase.from("users").select("total_xp, level")
        → supabase.from("xp_events").select("*").order(...)
      → returns XPSummary
  → render with data
```

## Authentication Flow

1. User clicks "Sign in with Google" or "Sign in with GitHub"
2. Supabase Auth initiates PKCE OAuth flow → redirect to provider
3. Provider authenticates → redirect to `/auth/callback`
4. Callback route exchanges code for session → sets cookie
5. `useAuth()` hook reads session, fetches user profile from `users` table
6. `ProtectedRoute` component checks auth state, redirects if unauthenticated

Wallet connection is independent — the Solana Wallet Adapter connects to the user's browser wallet and stores the `wallet_address` in the user profile.

## Supabase Schema

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | `id`, `display_name`, `wallet_address`, `total_xp`, `level`, `locale` | User profiles |
| `courses` | `id`, `slug`, `title`, `difficulty`, `track`, `xp_reward`, `published` | Course metadata (mirrors CMS) |
| `modules` | `id`, `course_id`, `title`, `sort_order` | Course modules |
| `lessons` | `id`, `module_id`, `title`, `type`, `xp_reward`, `challenge_config` | Individual lessons |
| `enrollments` | `id`, `user_id`, `course_id`, `status`, `progress_pct` | User enrollment state |
| `lesson_progress` | `id`, `user_id`, `lesson_id`, `completed`, `completed_at` | Per-lesson completion |
| `achievements` | `id`, `user_id`, `achievement_key`, `unlocked_at` | Earned achievements |
| `streaks` | `id`, `user_id`, `current_streak`, `longest_streak`, `freeze_count` | Daily activity streaks |
| `xp_events` | `id`, `user_id`, `amount`, `source`, `reference_id` | XP transaction log |

### Enums

- `difficulty`: `beginner` | `intermediate` | `advanced`
- `lesson_type`: `content` | `challenge`
- `enrollment_status`: `active` | `completed` | `dropped`
- `xp_source`: `lesson_completion` | `course_completion` | `streak_bonus` | `achievement` | `referral`

## CMS Integration

Strapi provides course content via REST API. The CMS client (`lib/cms/client.ts`) handles:

- Fetching courses with deep population (`modules → lessons → challenge`)
- Transforming Strapi's nested entity format to flat frontend types
- Automatic fallback to mock data on fetch failure
- 60-second server-side cache via Next.js `revalidate`

See [CMS_GUIDE.md](./CMS_GUIDE.md) for Strapi setup and content schema details.

## i18n Architecture

- **Library**: next-intl v4
- **Locales**: `en` (default), `pt-br`, `es`
- **Message files**: `app/messages/{locale}.json`
- **Routing**: `localePrefix: "as-needed"` — default locale has no prefix, others use `/pt-br/...`, `/es/...`
- **Detection**: Automatic browser locale detection enabled
- **Usage**: `useTranslations()` hook in client components, `getTranslations()` in server components

## On-Chain Integration Points

The service interfaces are designed for future Solana program integration:

- `XPService` → will read from Token-2022 soulbound XP mint
- `CredentialService` → will read ZK-compressed credentials (Light Protocol)
- `StreakService` → will verify against on-chain streak data
- `EnrollmentService` → will call `enroll`/`unenroll` program instructions

The `LearningPlatformServices` interface allows swapping Supabase implementations for on-chain implementations without changing component code.
