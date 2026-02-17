-- Superteam Academy — Initial Schema
-- Tables: users, courses, modules, lessons, enrollments, lesson_progress,
--         achievements, streaks, xp_events

-- ============================================================
-- ENUMS
-- ============================================================

create type difficulty as enum ('beginner', 'intermediate', 'advanced');
create type lesson_type as enum ('content', 'challenge');
create type enrollment_status as enum ('active', 'completed', 'dropped');
create type xp_source as enum (
  'lesson_completion',
  'course_completion',
  'streak_bonus',
  'achievement',
  'referral'
);

-- ============================================================
-- USERS
-- ============================================================

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  wallet_address text unique,
  locale text not null default 'en' check (locale in ('en', 'pt-br', 'es')),
  total_xp bigint not null default 0,
  level int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_users_wallet on users (wallet_address) where wallet_address is not null;
create index idx_users_total_xp on users (total_xp desc);

-- ============================================================
-- COURSES
-- ============================================================

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  difficulty difficulty not null default 'beginner',
  duration_minutes int not null default 0,
  thumbnail_url text,
  track text,
  xp_reward int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_courses_slug on courses (slug);
create index idx_courses_published on courses (published) where published = true;

-- ============================================================
-- MODULES
-- ============================================================

create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_modules_course on modules (course_id, sort_order);

-- ============================================================
-- LESSONS
-- ============================================================

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  type lesson_type not null default 'content',
  content text,
  sort_order int not null default 0,
  xp_reward int not null default 10,
  challenge_config jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_lessons_module on lessons (module_id, sort_order);

-- ============================================================
-- ENROLLMENTS
-- ============================================================

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  status enrollment_status not null default 'active',
  progress_pct smallint not null default 0 check (progress_pct between 0 and 100),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);

create index idx_enrollments_user on enrollments (user_id);
create index idx_enrollments_course on enrollments (course_id);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================

create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create index idx_lesson_progress_user on lesson_progress (user_id);
create index idx_lesson_progress_lesson on lesson_progress (lesson_id);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

create index idx_achievements_user on achievements (user_id);

-- ============================================================
-- STREAKS
-- ============================================================

create table streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade unique,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date,
  freeze_count int not null default 0,
  updated_at timestamptz not null default now()
);

create index idx_streaks_user on streaks (user_id);

-- ============================================================
-- XP EVENTS
-- ============================================================

create table xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  amount int not null check (amount > 0),
  source xp_source not null,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create index idx_xp_events_user on xp_events (user_id);
create index idx_xp_events_created on xp_events (created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();
create trigger trg_courses_updated_at before update on courses
  for each row execute function set_updated_at();
create trigger trg_modules_updated_at before update on modules
  for each row execute function set_updated_at();
create trigger trg_lessons_updated_at before update on lessons
  for each row execute function set_updated_at();
create trigger trg_streaks_updated_at before update on streaks
  for each row execute function set_updated_at();

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

alter table users enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table achievements enable row level security;
alter table streaks enable row level security;
alter table xp_events enable row level security;

-- Users: read own, update own. Public profiles visible for leaderboard.
create policy "users_select_own"
  on users for select using (auth.uid() = id);
create policy "users_select_public"
  on users for select using (true);
create policy "users_insert_own"
  on users for insert with check (auth.uid() = id);
create policy "users_update_own"
  on users for update using (auth.uid() = id);

-- Courses: publicly readable when published.
create policy "courses_select_published"
  on courses for select using (published = true);

-- Modules: publicly readable (join through published course enforced at app level).
create policy "modules_select_all"
  on modules for select using (true);

-- Lessons: publicly readable.
create policy "lessons_select_all"
  on lessons for select using (true);

-- Enrollments: owner only.
create policy "enrollments_select_own"
  on enrollments for select using (auth.uid() = user_id);
create policy "enrollments_insert_own"
  on enrollments for insert with check (auth.uid() = user_id);
create policy "enrollments_update_own"
  on enrollments for update using (auth.uid() = user_id);

-- Lesson progress: owner only.
create policy "lesson_progress_select_own"
  on lesson_progress for select using (auth.uid() = user_id);
create policy "lesson_progress_insert_own"
  on lesson_progress for insert with check (auth.uid() = user_id);
create policy "lesson_progress_update_own"
  on lesson_progress for update using (auth.uid() = user_id);

-- Achievements: owner can read, insert.
create policy "achievements_select_own"
  on achievements for select using (auth.uid() = user_id);
create policy "achievements_insert_own"
  on achievements for insert with check (auth.uid() = user_id);

-- Streaks: owner only.
create policy "streaks_select_own"
  on streaks for select using (auth.uid() = user_id);
create policy "streaks_insert_own"
  on streaks for insert with check (auth.uid() = user_id);
create policy "streaks_update_own"
  on streaks for update using (auth.uid() = user_id);

-- XP events: owner can read. Insert via server/service role only.
create policy "xp_events_select_own"
  on xp_events for select using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
