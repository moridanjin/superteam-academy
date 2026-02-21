# Superteam Academy

A decentralized learning platform built on Solana with gamified progression, streak tracking, achievements, and verifiable credentials. Learn blockchain development through interactive courses with code challenges.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (new-york) |
| Auth | Supabase Auth (Google + GitHub OAuth, PKCE) |
| Database | Supabase (Postgres + RLS) |
| CMS | Strapi 5 (headless, REST API) |
| Wallet | Solana Wallet Adapter |
| i18n | next-intl (EN, PT-BR, ES) |
| Animations | Framer Motion |
| Testing | Vitest + Testing Library |

## Prerequisites

- Node.js 20+
- npm
- A Supabase project (or use placeholder credentials for local dev)
- Strapi instance (optional — mock data fallback available)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/superteam-academy.git
cd superteam-academy

# 2. Install frontend dependencies
cd app
npm install

# 3. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Strapi credentials

# 4. (Optional) Start Strapi CMS
cd ../cms
cp .env.example .env
npm install
npm run develop
# Create an admin user at http://localhost:1337/admin

# 5. Start the dev server
cd ../app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run without Supabase or Strapi, set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`. The app will use built-in mock courses and skip auth.

## Environment Variables

### Frontend (`app/.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | No (defaults to devnet) |
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (`devnet` / `mainnet-beta`) | No (defaults to `devnet`) |
| `STRAPI_URL` | Strapi server URL (server-side only) | No (defaults to `http://localhost:1337`) |
| `STRAPI_API_TOKEN` | Strapi API token (server-side only) | No |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Use mock courses instead of Strapi (`true`/`false`) | No (defaults to `false`) |

### CMS (`cms/.env`)

| Variable | Description |
|----------|-------------|
| `HOST` | Server host |
| `PORT` | Server port (default: 1337) |
| `APP_KEYS` | Application keys (comma-separated) |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | JWT secret for admin panel |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens |
| `JWT_SECRET` | JWT secret |
| `ENCRYPTION_KEY` | Data encryption key |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
app/
├── messages/                    # i18n translation files
│   ├── en.json                  # English
│   ├── es.json                  # Spanish
│   └── pt-br.json               # Portuguese (Brazil)
├── src/
│   ├── app/[locale]/            # App Router pages (locale-prefixed)
│   │   ├── page.tsx             # Landing page
│   │   ├── auth/sign-in/        # Sign-in page
│   │   ├── courses/             # Course catalog + detail + lessons
│   │   ├── dashboard/           # User dashboard
│   │   ├── profile/             # User profile
│   │   ├── leaderboard/         # XP leaderboard
│   │   ├── settings/            # User settings
│   │   └── certificates/        # Certificate listing + detail
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (button, card, etc.)
│   │   ├── auth/                # Auth components (sign-in, wallet, user menu)
│   │   ├── courses/             # Course cards, filters, enrollment
│   │   ├── gamification/        # XP, streaks, achievements
│   │   ├── app-shell.tsx        # Layout wrapper with navbar + sidebar
│   │   ├── navbar.tsx           # Top navigation bar
│   │   ├── footer.tsx           # Site footer
│   │   └── providers.tsx        # Provider composition (Solana, services)
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Authentication state
│   │   ├── use-xp.ts            # XP & leveling
│   │   ├── use-streak.ts        # Streak tracking
│   │   ├── use-achievements.ts  # Achievements
│   │   ├── use-course-progress.ts
│   │   ├── use-credentials.ts
│   │   ├── use-leaderboard.ts
│   │   └── use-user-rank.ts
│   ├── lib/
│   │   ├── cms/                 # Strapi CMS client + mock data
│   │   │   ├── client.ts        # REST client with mock fallback
│   │   │   ├── types.ts         # CMS + frontend types
│   │   │   └── mock-data.ts     # Built-in mock courses
│   │   ├── services/            # Service interface layer
│   │   │   ├── types.ts         # Service interfaces
│   │   │   ├── provider.tsx     # React context provider
│   │   │   └── supabase-services.ts  # Supabase implementations
│   │   ├── supabase/            # Supabase client + types
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── database.types.ts
│   │   ├── gamification.ts      # XP formula + level calculations
│   │   └── utils.ts             # Tailwind merge + clsx
│   └── i18n/
│       └── routing.ts           # Locale configuration
├── components.json              # shadcn/ui config
└── tailwind.config.ts
```

## Deployment

### Frontend (Vercel)

1. Connect your repository to [Vercel](https://vercel.com)
2. Set the root directory to `app/`
3. Add all environment variables from the table above
4. Deploy

### CMS (Strapi)

Deploy Strapi to any Node.js hosting provider (Railway, Render, DigitalOcean, etc.). Set the `cms/.env` variables and ensure the `STRAPI_URL` in the frontend points to your deployed instance.

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System architecture, component structure, data flow
- [CMS_GUIDE.md](./CMS_GUIDE.md) — Strapi setup, content schemas, mock data
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) — Theme, i18n, gamification, extending the app
