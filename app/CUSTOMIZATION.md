# Customization Guide

## Theme

### Custom Colors

The app uses Tailwind CSS 4 with Solana brand colors defined in the global CSS:

| Token | Hex | Usage |
|-------|-----|-------|
| `solana-purple` | `#9945ff` | Primary accent, CTAs |
| `solana-green` | `#14f195` | Success states, XP indicators |
| `solana-blue` | `#00d1ff` | Links, info badges |
| `solana-pink` | `#f946ff` | Highlights, gradients |
| `superteam` | `#6366f1` | Brand accent |

Plus a full `neutral-50` through `neutral-950` scale for backgrounds and text.

### Dark Mode

Dark mode is the primary theme. The app uses `next-themes` for theme management. Colors are defined using CSS custom properties that adapt to the theme. To modify the dark mode palette, edit the CSS variables in `src/app/globals.css`.

### Modifying Colors

1. Edit `src/app/globals.css` — update the `@theme` block or CSS custom properties
2. For Solana brand colors, update the values in the theme configuration
3. shadcn/ui components inherit from CSS custom properties (`--background`, `--foreground`, `--primary`, etc.)

### Fonts

- **Body**: Inter (variable, loaded via `next/font`)
- **Code**: JetBrains Mono (loaded via `next/font`)

To change fonts, update the font imports in `src/app/[locale]/layout.tsx`.

## Adding Languages

The app supports English, Portuguese (Brazil), and Spanish via next-intl.

### Steps to Add a New Locale

1. **Add the locale to routing config** (`src/i18n/routing.ts`):

```typescript
export const routing = defineRouting({
  locales: ["en", "pt-br", "es", "fr"], // add "fr"
  defaultLocale: "en",
  localeDetection: true,
  localePrefix: "as-needed",
});
```

2. **Create a message file** (`messages/fr.json`):

Copy `messages/en.json` and translate all values. Keep the same key structure.

3. **Add the locale to the middleware matcher** if using middleware for locale detection.

4. **Add to language switcher** — the `LanguageSwitcher` component (`src/components/language-switcher.tsx`) reads available locales from the routing config and displays them automatically.

## Extending Gamification

### XP Formula

XP required to reach level `n`:

```
xpForLevel(n) = 100 * n * (n + 1) / 2
```

| Level | Total XP Required |
|-------|------------------|
| 1 | 100 |
| 2 | 300 |
| 3 | 600 |
| 5 | 1,500 |
| 10 | 5,500 |

To modify the progression curve, edit `src/lib/gamification.ts`.

### XP Sources

XP is awarded from these sources (defined in the `xp_source` enum):

- `lesson_completion` — completing a lesson
- `course_completion` — finishing all lessons in a course
- `streak_bonus` — daily activity streak milestones
- `achievement` — unlocking achievements
- `referral` — referring new users

### Adding Achievement Keys

Achievements are identified by string keys stored in the `achievements` table. To add a new achievement:

1. Define the achievement key (e.g., `"first_challenge_completed"`)
2. Add display metadata (name, description, icon) in the achievement components
3. Trigger the achievement via `AchievementService.claimAchievement(userId, key)`

### Streak System

Streaks track consecutive days of activity. The `streaks` table stores:
- `current_streak` — current consecutive days
- `longest_streak` — all-time best
- `last_activity_date` — last recorded activity (UTC)
- `freeze_count` — available streak freeze uses

## Adding New Pages

Follow the App Router conventions:

### File Structure

```
src/app/[locale]/your-page/
├── page.tsx           # Page component (required)
├── loading.tsx        # Loading skeleton (optional)
└── _components/       # Page-specific components (optional)
    └── your-widget.tsx
```

### Protected Routes

Wrap protected pages with the `ProtectedRoute` component:

```typescript
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function YourPage() {
  return (
    <ProtectedRoute>
      <div>{/* page content */}</div>
    </ProtectedRoute>
  );
}
```

### Layout

Pages inside `[locale]/` automatically inherit the root layout with the `AppShell` (navbar + sidebar). The `AppShell` component handles responsive navigation with a collapsible sidebar on desktop and a sheet on mobile.

## shadcn/ui Components

### Adding New Components

Use the shadcn CLI to add components:

```bash
cd app
npx shadcn@latest add dialog
npx shadcn@latest add table
```

Components are installed to `src/components/ui/` and can be customized directly.

### Configuration

The `components.json` file configures shadcn/ui:

- **Style**: `new-york`
- **Base color**: `neutral`
- **CSS variables**: enabled
- **Path aliases**: `@/components`, `@/lib/utils`, `@/hooks`

### Available Components

The project includes: accordion, alert-dialog, avatar, badge, breadcrumb, button, card, dropdown-menu, input, progress, resizable, select, separator, sheet, skeleton, sonner (toasts), switch, tabs, textarea, and tooltip.
