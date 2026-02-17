# PRD: Superteam Brazil Learning Management System dApp

## Introduction

Build a production-ready, open-source Learning Management System (LMS) for Solana developer education — "Codecademy meets Cyfrin Updraft" for the Solana ecosystem. The platform delivers interactive, project-based courses with gamified progression (XP, streaks, achievements), on-chain credentials (soulbound cNFTs), integrated code editing, and multi-language support. This is a bounty submission to [github.com/solanabr/superteam-academy](https://github.com/solanabr/superteam-academy) targeting 1st place ($4,000 USDG).

**Target repo:** `solanabr/superteam-academy` — PR creates `app/` at repo root (monorepo sibling to `superteam-academy/` Anchor workspace).

## Goals

- Deliver all 10 core pages fully functional with polished UI/UX (dark mode primary)
- Implement gamification system: XP (soulbound Token-2022), leveling, streaks, 256 achievements
- Integrate Solana Wallet Adapter + NextAuth (Google + GitHub) with account linking
- Embed Solana Playground (iframe) for interactive code challenges
- Set up Strapi CMS with course/module/lesson content schema and sample course
- Support i18n from day one: PT-BR, ES, EN with language switcher
- Hit Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 90+
- Provide clean service interfaces for future on-chain program integration
- Deploy live demo on Vercel with preview deployments
- Produce demo video (3–5 min), Twitter post tagging @SuperteamBR
- Implement bonus features: admin dashboard, E2E tests, community forum, PWA support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode, no `any`) |
| Styling | Tailwind CSS with custom design tokens |
| Components | shadcn/ui + Radix primitives |
| Auth | Solana Wallet Adapter + NextAuth.js (Google + GitHub providers) |
| Database | Supabase (Postgres + Auth + Realtime + Storage) |
| CMS | Strapi (self-hosted, open-source) |
| Code Editor | Solana Playground (iframe embed) |
| i18n | next-intl (PT-BR, ES, EN) |
| Analytics | GA4 + PostHog (heatmaps) + Sentry (errors) |
| On-chain | @solana/wallet-adapter-react, @solana/web3.js, @metaplex-foundation/js |
| Deployment | Vercel (frontend) + Railway/Render (Strapi) |
| Testing | Vitest (unit) + Playwright (E2E) |

## User Stories

---

### Phase 1: Project Scaffolding & Infrastructure

#### US-001: Initialize Next.js App in Monorepo
**Description:** As a developer, I need the Next.js project scaffolded in the correct monorepo location so all subsequent work builds on a proper foundation.

**Acceptance Criteria:**
- [ ] `app/` directory created at repo root (sibling to `superteam-academy/`)
- [ ] Next.js 14+ with App Router, TypeScript strict mode
- [ ] Tailwind CSS configured with custom theme (Solana brand colors, dark mode primary)
- [ ] shadcn/ui initialized with base components
- [ ] ESLint + Prettier configured (matching repo's `.claude/rules/typescript.md`)
- [ ] `app/package.json` with all core dependencies
- [ ] `app/tsconfig.json` with strict: true, no `any` types
- [ ] Dev server starts with `npm run dev`
- [ ] Typecheck passes

#### US-002: Configure Supabase Schema & Client
**Description:** As a developer, I need the database schema and Supabase client configured so user data, progress, and gamification state can persist.

**Acceptance Criteria:**
- [ ] Supabase project setup with env vars documented
- [ ] Database schema: `users`, `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `achievements`, `streaks`, `xp_events` tables
- [ ] Row-Level Security (RLS) policies for all tables
- [ ] Supabase client singleton (`lib/supabase/client.ts` and `lib/supabase/server.ts`)
- [ ] Type generation from Supabase schema (`database.types.ts`)
- [ ] Migration files for reproducible setup
- [ ] Typecheck passes

#### US-003: Set Up Authentication (Wallet + NextAuth)
**Description:** As a user, I want to sign in with my Solana wallet, Google, or GitHub so I can access the platform with my preferred method.

**Acceptance Criteria:**
- [ ] NextAuth.js configured with Google and GitHub providers
- [ ] Solana Wallet Adapter integrated (Phantom, Solflare, Backpack, etc.)
- [ ] Account linking: users can sign up with any method and link additional methods later
- [ ] Wallet linking required for on-chain features (credentials, XP display)
- [ ] Auth state persisted in Supabase `users` table
- [ ] Protected routes redirect to sign-in
- [ ] Session management with JWT
- [ ] Sign-out flow clears all state
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-004: Configure i18n (PT-BR, ES, EN)
**Description:** As a user, I want to use the platform in my preferred language so I can learn without language barriers.

**Acceptance Criteria:**
- [ ] next-intl configured with PT-BR, ES, EN locales
- [ ] All UI strings externalized to JSON translation files
- [ ] Language switcher component in header
- [ ] Language preference persisted in user settings / localStorage
- [ ] URL-based locale routing (`/en/courses`, `/pt-br/courses`, `/es/courses`)
- [ ] Default locale detection from browser
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-005: Set Up Strapi CMS
**Description:** As a content manager, I need a CMS to create and manage course content with a structured schema.

**Acceptance Criteria:**
- [ ] Strapi instance configured with content types: Course, Module, Lesson, Challenge
- [ ] Course schema: title, slug, description, difficulty, duration, thumbnail, track, xp_reward, modules (relation)
- [ ] Module schema: title, order, lessons (relation)
- [ ] Lesson schema: title, type (content | challenge), content (rich text/markdown), order, xp_reward, challenge_config
- [ ] Challenge schema: prompt, starter_code, test_cases, expected_output, hints, solution
- [ ] Draft/publish workflow enabled
- [ ] Media library for thumbnails and assets
- [ ] REST API accessible from Next.js
- [ ] Sample "Solana Fundamentals" course imported with 3+ modules, 10+ lessons
- [ ] Typecheck passes

#### US-006: Create Service Interface Layer
**Description:** As a developer, I need clean service abstractions so we can swap local/Supabase implementations for on-chain calls later.

**Acceptance Criteria:**
- [ ] `LearningProgressService` interface implemented per bounty spec
- [ ] `getProgress()`, `completeLesson()`, `getXP()`, `getStreak()`, `getLeaderboard()`, `getCredentials()` methods
- [ ] Supabase-backed implementation as default
- [ ] Service provider pattern (React Context) for dependency injection
- [ ] Stub interfaces for: lesson completion, course enrollment, achievement claiming, streak tracking
- [ ] Clean separation: services can be swapped without touching UI components
- [ ] Typecheck passes

---

### Phase 2: Landing Page & Navigation

#### US-007: Build App Shell & Navigation
**Description:** As a user, I want consistent navigation so I can easily move between all sections of the platform.

**Acceptance Criteria:**
- [ ] Responsive header: logo, nav links (Courses, Leaderboard), language switcher, auth buttons / user menu
- [ ] Mobile hamburger menu with slide-out drawer
- [ ] Footer: links (About, Courses, Leaderboard, GitHub), social links, newsletter signup placeholder
- [ ] Dark mode as primary theme, light mode toggle
- [ ] Breadcrumb component for nested pages
- [ ] Active link highlighting
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-008: Build Landing Page (`/`)
**Description:** As a visitor, I want an engaging landing page that explains the platform's value so I'm motivated to sign up.

**Acceptance Criteria:**
- [ ] Hero section: headline, subheadline, primary CTAs (Sign Up, Explore Courses), animated illustration or Solana-themed graphic
- [ ] Learning path previews with progression indicators (3 featured paths)
- [ ] Platform feature highlights (gamification, on-chain credentials, code editor, community)
- [ ] Social proof section: testimonials (mock), partner logos (Solana, Superteam), completion stats (mock)
- [ ] "How It Works" section with 3-step flow
- [ ] Newsletter signup form in footer
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Animations: subtle scroll-triggered reveals (Framer Motion)
- [ ] Lighthouse Performance 90+, Accessibility 95+
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 3: Course Catalog & Detail

#### US-009: Build Course Catalog (`/courses`)
**Description:** As a learner, I want to browse and search courses so I can find the right learning path for my skill level.

**Acceptance Criteria:**
- [ ] Course grid layout with cards: thumbnail, title, description, difficulty badge, duration, progress %, XP reward
- [ ] Filter by: difficulty (Beginner, Intermediate, Advanced), topic/track, duration
- [ ] Full-text search with debounced input
- [ ] Curated learning paths section (e.g., "Solana Fundamentals", "DeFi Developer", "Full Stack Solana")
- [ ] Empty state when no courses match filters
- [ ] Loading skeletons during data fetch
- [ ] Courses fetched from Strapi CMS
- [ ] Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-010: Build Course Detail Page (`/courses/[slug]`)
**Description:** As a learner, I want to see full course details before enrolling so I can decide if it's right for me.

**Acceptance Criteria:**
- [ ] Course header: title, description, instructor info, difficulty, duration, XP to earn
- [ ] Expandable module/lesson list with completion status icons
- [ ] Progress bar showing overall completion %
- [ ] Enrollment CTA button (changes to "Continue" if enrolled)
- [ ] "What You'll Learn" section with bullet points
- [ ] Prerequisites section
- [ ] Reviews section (static mock data for MVP)
- [ ] Related courses recommendation
- [ ] SEO: dynamic meta tags, Open Graph
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-011: Implement Course Enrollment Flow
**Description:** As a learner, I want to enroll in a course so my progress is tracked.

**Acceptance Criteria:**
- [ ] "Enroll" button on course detail page
- [ ] Enrollment creates record in Supabase `enrollments` table
- [ ] Enrolled courses appear on user dashboard
- [ ] Enrollment state reflected in course catalog (progress badge on card)
- [ ] Unauthenticated users redirected to sign-in on enroll click
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 4: Lesson View & Code Challenges

#### US-012: Build Lesson View (`/courses/[slug]/lessons/[id]`)
**Description:** As a learner, I want to read lesson content in a clean layout with navigation so I can progress through the course.

**Acceptance Criteria:**
- [ ] Split layout: content (left) + sidebar/code editor (right), resizable via drag handle
- [ ] Markdown rendering with syntax highlighting (Rust, TypeScript, JSON)
- [ ] Previous/Next lesson navigation buttons
- [ ] Module overview sidebar (collapsible)
- [ ] Lesson completion tracking with auto-save to Supabase
- [ ] "Mark as Complete" button for content lessons
- [ ] Expandable hints section
- [ ] Progress indicator (lesson X of Y)
- [ ] Responsive: stacked layout on mobile
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-013: Integrate Solana Playground (Code Editor)
**Description:** As a learner, I want an embedded code editor for interactive challenges so I can practice Solana development in-browser.

**Acceptance Criteria:**
- [ ] Solana Playground embedded via iframe (`https://beta.solpg.io/`)
- [ ] Iframe loads with pre-populated starter code when available
- [ ] Communication layer between app and iframe (postMessage API if supported)
- [ ] Fallback: display challenge prompt + code snippet with "Open in Solana Playground" link
- [ ] Loading state while iframe initializes
- [ ] Responsive sizing
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-014: Build Code Challenge Interface
**Description:** As a learner, I want to complete coding challenges with clear objectives and feedback so I can test my understanding.

**Acceptance Criteria:**
- [ ] Challenge prompt with clear objectives and expected output
- [ ] Visible test cases with pass/fail indicators
- [ ] Pre-populated starter code in editor
- [ ] "Run" button with loading state and output display
- [ ] Real-time error messages displayed below editor
- [ ] Success celebration animation (confetti or similar)
- [ ] "Mark Complete" awards XP on successful completion
- [ ] Expandable hints (progressive reveal)
- [ ] Solution toggle (revealed after completion or 3 failed attempts)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 5: Gamification System

#### US-015: Implement XP & Leveling System
**Description:** As a learner, I want to earn XP and level up so I feel a sense of progression.

**Acceptance Criteria:**
- [ ] XP awarded on: lesson complete (10–50), challenge complete (25–100), course complete (500–2000), daily streak bonus (10), first completion of day (25)
- [ ] XP events logged in `xp_events` table
- [ ] Level derived: `Level = floor(sqrt(totalXP / 100))`
- [ ] Level progress bar showing XP to next level
- [ ] XP balance display component (reusable across dashboard, profile, leaderboard)
- [ ] On-chain XP display: read soulbound Token-2022 balance from connected wallet (Devnet)
- [ ] Toast notification on XP earned
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-016: Implement Streak System
**Description:** As a learner, I want my daily streak tracked so I'm motivated to learn consistently.

**Acceptance Criteria:**
- [ ] Streak incremented on any learning activity per UTC day
- [ ] Streak resets if a day is missed (grace period: activity before midnight UTC)
- [ ] Streak calendar visualization (heatmap-style, inspired by GitHub contributions)
- [ ] Current streak count displayed on dashboard
- [ ] Milestone rewards at 7, 30, 100 days (achievement unlock)
- [ ] Streak freeze feature (bonus): one free freeze per 30-day streak
- [ ] Streak data stored in Supabase `streaks` table
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-017: Implement Achievements/Badges System
**Description:** As a learner, I want to unlock achievements so I have goals beyond course completion.

**Acceptance Criteria:**
- [ ] Achievement definitions: Progress (First Steps, Course Completer, Speed Runner), Streaks (Week Warrior, Monthly Master, Consistency King), Skills (Rust Rookie, Anchor Expert, Full Stack Solana), Community (Helper, First Comment), Special (Early Adopter, Bug Hunter, Perfect Score)
- [ ] Up to 256 achievements supported (matching on-chain bitmap)
- [ ] Achievement unlock triggers: automatic on qualifying action
- [ ] Badge display component with icon, name, description, unlock date
- [ ] Locked vs unlocked visual state
- [ ] Toast notification on achievement unlock
- [ ] Achievement data stored in Supabase `achievements` table
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 6: User Dashboard & Profile

#### US-018: Build User Dashboard (`/dashboard`)
**Description:** As a learner, I want a personalized dashboard so I can see my progress and know what to do next.

**Acceptance Criteria:**
- [ ] Current courses with completion % and "Continue" button (links to next incomplete lesson)
- [ ] XP balance, level, level progress bar, global rank
- [ ] Current streak with calendar visualization
- [ ] Recent achievements (last 5) with "View All" link
- [ ] Recommended next courses (based on completed tracks)
- [ ] Recent activity feed (last 10 actions: lessons completed, XP earned, achievements unlocked)
- [ ] Quick stats: total courses completed, total lessons, total XP, longest streak
- [ ] Protected route (auth required)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-019: Build User Profile (`/profile`, `/profile/[username]`)
**Description:** As a learner, I want a public profile showcasing my achievements so I can share my learning journey.

**Acceptance Criteria:**
- [ ] Profile header: avatar, name, bio, social links, join date, level badge
- [ ] Skill radar chart (Rust, Anchor, Frontend, Security, DeFi, etc.) using recharts or chart.js
- [ ] Achievement badge showcase grid
- [ ] On-chain credential display: cNFTs with track name, level, mint address, Solana Explorer link
- [ ] Completed courses list with completion dates
- [ ] Public/private visibility toggle (in settings)
- [ ] Own profile editable, others' profiles read-only
- [ ] OG image generation for social sharing
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 7: Leaderboard, Settings & Certificates

#### US-020: Build Leaderboard (`/leaderboard`)
**Description:** As a learner, I want to see how I rank against others so I'm motivated by healthy competition.

**Acceptance Criteria:**
- [ ] Global rankings table sorted by XP
- [ ] Time filters: Weekly, Monthly, All-Time
- [ ] Course filter: filter by specific course
- [ ] User cards: rank number, avatar, name, XP, level badge, streak count
- [ ] Current user highlighted/pinned (always visible even if off-screen)
- [ ] Top 3 podium-style display
- [ ] Pagination or infinite scroll (50 per page)
- [ ] On-chain leaderboard: derive from Token-2022 XP balances (Devnet, via Helius DAS API or RPC)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-021: Build Settings Page (`/settings`)
**Description:** As a user, I want to manage my account settings so I can control my profile and preferences.

**Acceptance Criteria:**
- [ ] Profile editing: name, bio, avatar upload (Supabase Storage), social links
- [ ] Account management: email, connected wallets (add/remove), Google/GitHub connections
- [ ] Preferences: language (i18n switcher), theme (dark/light), notification preferences
- [ ] Privacy: profile visibility toggle (public/private), data export (JSON download)
- [ ] Danger zone: delete account with confirmation dialog
- [ ] Protected route (auth required)
- [ ] Form validation with error messages
- [ ] Success toast on save
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-022: Build Certificate/Credential View (`/certificates/[id]`)
**Description:** As a learner, I want to view and share my on-chain credentials so I can prove my skills.

**Acceptance Criteria:**
- [ ] Visual certificate: course name, completion date, recipient name, Superteam Brazil branding
- [ ] On-chain verification: Solana Explorer link to cNFT mint
- [ ] NFT details: mint address, metadata URI, ownership proof, collection
- [ ] Social sharing buttons (Twitter, LinkedIn, copy link)
- [ ] Downloadable certificate image (canvas-to-image or server-rendered)
- [ ] Read cNFT data from Devnet (Metaplex DAS API)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 8: Analytics, Performance & Documentation

#### US-023: Integrate Analytics & Error Monitoring
**Description:** As a platform operator, I want analytics and error monitoring so I can understand user behavior and fix issues quickly.

**Acceptance Criteria:**
- [ ] GA4 configured with custom events: page_view, course_enroll, lesson_complete, challenge_complete, sign_up, sign_in
- [ ] PostHog initialized for session recordings and heatmaps
- [ ] Sentry configured for error monitoring with source maps
- [ ] Analytics consent banner (GDPR-friendly)
- [ ] Environment-based initialization (disabled in dev)
- [ ] Typecheck passes

#### US-024: Performance Optimization
**Description:** As a user, I want the platform to load fast so my learning isn't interrupted by slow pages.

**Acceptance Criteria:**
- [ ] Lighthouse scores: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 90+
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Image optimization: next/image with WebP/AVIF, lazy loading
- [ ] Code splitting: dynamic imports for heavy components (code editor, charts)
- [ ] Static generation (SSG) for landing page, course catalog
- [ ] ISR for course detail pages
- [ ] Bundle analysis: no single chunk > 200KB
- [ ] Font optimization: next/font with display swap
- [ ] Typecheck passes

#### US-025: Write Documentation
**Description:** As a future developer, I need comprehensive documentation so I can understand, run, and extend the project.

**Acceptance Criteria:**
- [ ] `README.md`: overview, tech stack, local dev setup (step-by-step), env vars list, deployment instructions
- [ ] `ARCHITECTURE.md`: system architecture diagram, component structure, data flow, service interfaces, on-chain integration points
- [ ] `CMS_GUIDE.md`: how to create/edit courses in Strapi, content schema docs, publishing workflow
- [ ] `CUSTOMIZATION.md`: theme customization, adding languages, extending gamification, adding new achievement types
- [ ] Inline code comments for complex logic only
- [ ] API route documentation (JSDoc or similar)

---

### Phase 9: Bonus Features

#### US-026: Build Admin Dashboard (Bonus)
**Description:** As an admin, I want a dashboard to manage courses and view user analytics so I can operate the platform.

**Acceptance Criteria:**
- [ ] Admin role in Supabase (RLS-enforced)
- [ ] Overview: total users, active users (7d), total enrollments, completion rate
- [ ] User management: list, search, view details
- [ ] Course analytics: enrollment count, completion rate, average time
- [ ] Charts: user growth, daily active learners, popular courses (recharts)
- [ ] Protected admin route
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-027: Add E2E Tests (Bonus)
**Description:** As a developer, I want E2E tests covering critical flows so regressions are caught automatically.

**Acceptance Criteria:**
- [ ] Playwright configured in `app/e2e/`
- [ ] Tests: sign-in flow (wallet + Google mock), course catalog browse and filter, course enrollment, lesson navigation and completion, dashboard data display, leaderboard filtering
- [ ] CI-ready (GitHub Actions compatible)
- [ ] Minimum 80% coverage of critical user flows
- [ ] All tests pass

#### US-028: Add Community Forum Section (Bonus)
**Description:** As a learner, I want to discuss courses and ask questions so I can learn from the community.

**Acceptance Criteria:**
- [ ] Discussion threads per course and per lesson
- [ ] Create thread, reply, upvote
- [ ] Markdown support in posts
- [ ] Stored in Supabase with RLS
- [ ] "Community" achievement triggers
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

#### US-029: Add PWA Support (Bonus)
**Description:** As a learner, I want to install the app on my device so I can access courses offline.

**Acceptance Criteria:**
- [ ] `next-pwa` or `@ducanh2912/next-pwa` configured
- [ ] Service worker with cache-first strategy for static assets
- [ ] Manifest file with Superteam branding (icons, colors, display: standalone)
- [ ] Installable on mobile and desktop
- [ ] Offline fallback page
- [ ] Typecheck passes

---

### Phase 10: Submission

#### US-030: Prepare Submission Deliverables
**Description:** As a submitter, I need all deliverables ready so the bounty submission is complete.

**Acceptance Criteria:**
- [ ] PR to `solanabr/superteam-academy` from fork — `app/` directory with full frontend
- [ ] Live demo deployed on Vercel with working sign-up and Devnet wallet testing
- [ ] Demo video (3–5 min): feature walkthrough, architecture overview, key decisions
- [ ] Twitter post sharing submission, tagging @SuperteamBR
- [ ] Submit via Superteam Earn API with: PR link, live demo URL, demo video link, Twitter post link
- [ ] Eligibility answers: "Agent" for Q1, stack description for Q2

---

## Functional Requirements

- FR-01: Users can sign in via Solana wallet (Phantom, Solflare, Backpack), Google, or GitHub
- FR-02: Users can link multiple auth methods to a single account
- FR-03: Wallet connection required for on-chain features (credential display, XP token balance)
- FR-04: All UI strings externalized and available in PT-BR, ES, EN
- FR-05: Language switcher persists preference; URL reflects locale
- FR-06: Courses, modules, and lessons managed via Strapi CMS with draft/publish workflow
- FR-07: Course catalog supports filtering (difficulty, topic, duration) and full-text search
- FR-08: Users can enroll in courses; enrollment tracked in Supabase
- FR-09: Lesson view renders markdown with syntax highlighting in split layout
- FR-10: Code challenges use embedded Solana Playground iframe with starter code
- FR-11: Challenge completion validated by test case pass/fail
- FR-12: XP awarded automatically on lesson/challenge/course completion
- FR-13: Level derived as `floor(sqrt(totalXP / 100))`
- FR-14: Streaks tracked per UTC day; reset on missed day
- FR-15: Up to 256 achievements unlockable via qualifying actions
- FR-16: Dashboard shows enrolled courses, XP, level, streak, achievements, activity feed
- FR-17: Public user profiles display skills radar, badges, on-chain credentials
- FR-18: Leaderboard ranks users by XP with weekly/monthly/all-time filters
- FR-19: On-chain credentials (cNFTs) readable from Devnet and displayed with Explorer links
- FR-20: Certificates shareable via social media and downloadable as images
- FR-21: Settings page allows profile editing, auth management, language/theme preferences, privacy controls
- FR-22: GA4 custom events, PostHog heatmaps, and Sentry error monitoring integrated
- FR-23: All pages responsive (mobile-first) with dark mode as default

## Non-Goals (Out of Scope)

- Implementing the full on-chain Anchor program (it's a scaffold; we build UI with service interfaces)
- Backend-signed transactions for lesson completion (stubbed with clean interfaces)
- Real course content creation (mock/sample content provided)
- Payment processing or token swaps
- Mobile native app (PWA only)
- Real-time multiplayer/collaborative features
- AI-powered code review or tutoring
- Email notification system (preferences UI only)
- Custom domain setup

## Design Considerations

- **Theme:** Dark mode primary, inspired by Cyfrin Updraft + Codecademy aesthetics
- **Colors:** Solana brand palette (gradient purples/greens) + Superteam Brazil accents
- **Typography:** Inter (body) + JetBrains Mono (code) via next/font
- **Components:** shadcn/ui as base; extend with custom variants for course cards, achievement badges, XP indicators
- **Animations:** Framer Motion for page transitions, scroll reveals, celebration effects (confetti on achievement)
- **Responsive breakpoints:** Mobile-first — 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Design inspiration:** Cyfrin Updraft, Codecademy, Scrimba, LeetCode, Duolingo
- **Brand assets:** [Solana Brand Kit](https://solana.com/branding), [Superteam Brazil Brand Kit](https://drive.google.com/drive/folders/1SmR5-GT6xGx5kLZzUWTJmhpqNWnjlkti)

## Technical Considerations

- **Monorepo placement:** `app/` at repo root, not inside `superteam-academy/`
- **On-chain reads (Devnet):** XP token balance via `@solana/web3.js` getTokenAccountsByOwner; cNFT data via Metaplex DAS API or Helius
- **Service layer:** All on-chain interactions behind `LearningProgressService` interface; Supabase implementation now, on-chain swap later
- **Strapi hosting:** Railway or Render free tier for demo; document self-hosting for production
- **Auth complexity:** NextAuth handles Google/GitHub sessions; Wallet Adapter handles Solana. Account linking merges these into single Supabase user record
- **CMS data flow:** Strapi → Next.js via REST API at build time (SSG/ISR) + client-side for dynamic content
- **Code editor security:** Solana Playground iframe sandboxed; no direct code execution on our servers
- **Image optimization:** Course thumbnails stored in Supabase Storage, served via next/image
- **Bundle size:** Lazy load: code editor iframe, charts (recharts), Framer Motion animations
- **Competing PRs:** 11 open PRs exist. Differentiate via completeness, polish, and bonus features

## Success Metrics

- All 10 core pages functional and visually polished
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- i18n: all UI strings translated in 3 languages, language switcher works
- Auth: wallet + Google + GitHub sign-in all functional with account linking
- Gamification: XP, levels, streaks, achievements all tracking correctly
- CMS: sample course fully navigable from catalog → lessons
- On-chain: XP balance and credential cNFTs readable from Devnet
- Code editor: Solana Playground iframe loads and displays challenges
- Bonus features: admin dashboard, E2E tests, community forum, PWA all functional
- Clean PR: passes lint, typecheck, no `any` types, well-documented

## Open Questions

1. Should we fork the repo first and submit PR from fork, or request collaborator access?
2. What Devnet program ID should we use for on-chain reads (the scaffold at `3YchgRgR65gdRqgTZTM5qQXqtTZn5Kt2i6FPnZVu34Qb` or deploy our own)?
3. Should Strapi be included in the PR (as a `cms/` directory in monorepo) or documented as external?
4. Does the human operator have a Telegram handle for the agent submission requirement?
5. Is there a specific Supabase project to use, or should we create a new one for demo?
