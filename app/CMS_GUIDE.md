# CMS Guide

## Overview

Superteam Academy uses [Strapi 5](https://strapi.io/) as a headless CMS for managing course content. Strapi provides an admin panel for content editors and a REST API consumed by the Next.js frontend.

## Setup

```bash
cd cms

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env — generate unique values for APP_KEYS, secrets, and salts

# Start Strapi in development mode
npm run develop
```

Open [http://localhost:1337/admin](http://localhost:1337/admin) and create your first admin user.

### Generating API Tokens

1. Go to **Settings > API Tokens** in the Strapi admin
2. Click **Create new API Token**
3. Name: `frontend`, Token type: **Read-only**
4. Save and copy the token to your frontend's `STRAPI_API_TOKEN` env var

## Content Types

### Course

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Course title |
| `slug` | UID (from title) | Yes | URL-friendly identifier |
| `description` | Text | Yes | Course description |
| `difficulty` | Enum (`beginner`, `intermediate`, `advanced`) | Yes | Difficulty level |
| `duration` | Integer | No | Estimated hours to complete |
| `thumbnail` | Media (image) | No | Course thumbnail image |
| `track` | String | No | Learning track name (e.g., "Solana Fundamentals") |
| `xp_reward` | Integer | No | XP awarded on completion |
| `modules` | Relation (one-to-many → Module) | — | Ordered modules |

Draft/publish is **enabled** — courses must be published to appear in the frontend.

### Module

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Module title |
| `order` | Integer | Yes | Sort position within the course |
| `course` | Relation (many-to-one → Course) | — | Parent course |
| `lessons` | Relation (one-to-many → Lesson) | — | Ordered lessons |

### Lesson

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Lesson title |
| `type` | Enum (`content`, `challenge`) | Yes | Content lesson or code challenge |
| `content` | Rich text | No | Markdown lesson content |
| `order` | Integer | Yes | Sort position within the module |
| `xp_reward` | Integer | No | XP awarded on completion (default: 10) |
| `module` | Relation (many-to-one → Module) | — | Parent module |
| `challenge` | Relation (one-to-one → Challenge) | — | Associated code challenge |

### Challenge

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | Text | Yes | Challenge instructions |
| `starter_code` | Text | Yes | Initial code template |
| `test_cases` | Text | Yes | Test case descriptions |
| `expected_output` | Text | Yes | Expected result description |
| `hints` | Text | No | Optional hints |
| `solution` | Text | Yes | Reference solution |

## Content Relationships

```
Course (1) ──→ (N) Module (1) ──→ (N) Lesson (1) ──→ (0..1) Challenge
```

- A **Course** contains multiple **Modules** (ordered)
- A **Module** contains multiple **Lessons** (ordered)
- A **Lesson** of type `challenge` has one associated **Challenge**
- A **Lesson** of type `content` has no challenge (only `content` field)

## Creating a Course

1. **Create Challenges first** (if any lessons have code challenges)
   - Go to **Content Manager > Challenge** and create entries with prompt, starter code, test cases, expected output, and solution

2. **Create Lessons**
   - Go to **Content Manager > Lesson**
   - Set `type` to `content` or `challenge`
   - For content lessons: write Markdown in the `content` field
   - For challenge lessons: link the Challenge relation
   - Set `order` starting from 1

3. **Create Modules**
   - Go to **Content Manager > Module**
   - Link the lessons created above
   - Set `order` starting from 1

4. **Create the Course**
   - Go to **Content Manager > Course**
   - Fill in title, description, difficulty, duration, track, xp_reward
   - Link the modules created above
   - Upload a thumbnail image (optional)
   - **Publish** the course when ready

## Mock Data Fallback

When Strapi is unavailable or for local development without a CMS, set:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
```

The CMS client (`src/lib/cms/client.ts`) checks this flag and returns built-in mock courses from `src/lib/cms/mock-data.ts`. The mock data includes 6 courses covering Solana fundamentals, Anchor, DeFi, full-stack development, security, and NFTs.

The fallback also activates automatically when Strapi API calls fail, so the frontend always has content to display.

### Mock data location

```
src/lib/cms/mock-data.ts    # MOCK_COURSES array
src/lib/cms/types.ts        # Course, Module, Lesson, Challenge types
```

## Publishing Workflow

Strapi 5 supports draft/publish for Courses:

- **Draft** — visible only in the admin panel, not returned by the API
- **Published** — visible to the frontend via the REST API

Modules, Lessons, and Challenges do not use draft/publish — they are always available once created. Control visibility through the parent Course's publish state.

The frontend queries with `publicationState: "live"` to fetch only published courses.
