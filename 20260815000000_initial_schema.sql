-- Initial normalized schema for the Persian AI Fitness & Nutrition Coach MVP.
-- Supabase CLI is not installed in this workspace, so this file is checked in
-- manually and should be validated with `supabase db advisors` before deploy.

create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'admin');
create type public.goal_type as enum ('fat_loss', 'muscle_gain', 'recomposition', 'strength', 'general_fitness', 'maintenance');
create type public.experience_level as enum ('never', 'beginner', 'intermediate', 'advanced');
create type public.reminder_type as enum ('workout', 'meal', 'water', 'supplement', 'weigh_in', 'check_in');
create type public.review_status as enum ('draft', 'pending_review', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.user_role not null default 'user',
  age int check (age between 18 and 90),
  biological_sex text check (biological_sex in ('male', 'female')),
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  waist_cm numeric(5,2),
  goal public.goal_type,
  target_weight_kg numeric(5,2),
  experience public.experience_level,
  training_months int not null default 0,
  days_per_week int check (days_per_week between 1 and 7),
  session_minutes int,
  activity_level text,
  sleep_hours numeric(3,1),
  dietary_style text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_at timestamptz not null default now(),
  weight_kg numeric(5,2),
  waist_cm numeric(5,2),
  neck_cm numeric(5,2),
  hip_cm numeric(5,2),
  chest_cm numeric(5,2),
  arm_cm numeric(5,2),
  thigh_cm numeric(5,2),
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table public.health_screenings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  injuries text[] not null default '{}',
  medical_flags text[] not null default '{}',
  physician_restrictions text,
  high_risk boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.training_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  preferred_days text[] not null default '{}',
  preferred_time time,
  location text,
  equipment text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.nutrition_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  allergies text[] not null default '{}',
  intolerances text[] not null default '{}',
  disliked_foods text[] not null default '{}',
  favorite_foods text[] not null default '{}',
  meals_per_day int not null default 4,
  cooking_time_minutes int,
  budget text,
  supplements text[] not null default '{}',
  typical_pattern text,
  created_at timestamptz not null default now()
);

create table public.coach_methodologies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  coach_name text not null,
  title text not null,
  audience text not null,
  raw_method text not null,
  ai_review_requested boolean not null default false,
  ai_review_status text not null default 'not_requested',
  ai_review_summary text,
  review_findings text[] not null default '{}',
  normalized_rules jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_fa text not null,
  name_en text not null,
  primary_muscles text[] not null,
  secondary_muscles text[] not null default '{}',
  movement_pattern text not null,
  equipment text[] not null,
  difficulty text[] not null,
  compound_or_isolation text not null,
  recommended_rep_range int4range not null,
  fatigue_cost int not null check (fatigue_cost between 1 and 5),
  skill_requirement int not null check (skill_requirement between 1 and 5),
  contraindications text[] not null default '{}',
  substitutions text[] not null default '{}',
  instructions text[] not null default '{}',
  common_mistakes text[] not null default '{}',
  video_url text,
  image_url text,
  evidence_notes text,
  source_references jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  coach_methodology_id uuid references public.coach_methodologies(id) on delete set null,
  active_version_id uuid,
  goal public.goal_type not null,
  created_at timestamptz not null default now()
);

create table public.program_versions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.training_programs(id) on delete cascade,
  version_number int not null,
  split text not null,
  rationale text[] not null default '{}',
  change_reason text,
  created_at timestamptz not null default now(),
  unique (program_id, version_number)
);

alter table public.training_programs
  add constraint training_programs_active_version_id_fkey
  foreign key (active_version_id) references public.program_versions(id);

create table public.training_days (
  id uuid primary key default gen_random_uuid(),
  program_version_id uuid not null references public.program_versions(id) on delete cascade,
  title text not null,
  weekday text,
  focus text,
  warmup text,
  day_order int not null
);

create table public.exercise_prescriptions (
  id uuid primary key default gen_random_uuid(),
  training_day_id uuid not null references public.training_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  sets int not null check (sets between 1 and 8),
  rep_min int not null,
  rep_max int not null,
  rir_target numeric(3,1),
  rest_seconds int,
  tempo text,
  prescription_order int not null,
  notes text
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  training_day_id uuid references public.training_days(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  notes text
);

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_prescription_id uuid references public.exercise_prescriptions(id),
  set_number int not null,
  weight_kg numeric(6,2),
  reps int,
  rir numeric(3,1),
  completed boolean not null default false,
  skipped boolean not null default false,
  notes text
);

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  name_fa text not null,
  name_en text not null,
  serving_size text not null,
  calories numeric(8,2) not null,
  protein numeric(8,2) not null,
  carbohydrate numeric(8,2) not null,
  fat numeric(8,2) not null,
  fiber numeric(8,2) not null default 0,
  category text not null,
  common_iranian_portion text,
  alternative_foods text[] not null default '{}',
  source text,
  verified boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  valid_from date not null default current_date,
  calories int not null,
  protein_g int not null,
  carbs_g int not null,
  fat_g int not null,
  bmr int,
  tdee int,
  formula text not null default 'mifflin_st_jeor',
  created_at timestamptz not null default now()
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nutrition_target_id uuid references public.nutrition_targets(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade,
  title text not null,
  meal_order int not null
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id uuid not null references public.foods(id),
  servings numeric(6,2) not null
);

create table public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  food_id uuid references public.foods(id),
  meal text,
  servings numeric(6,2) not null,
  calories numeric(8,2),
  protein numeric(8,2),
  carbohydrate numeric(8,2),
  fat numeric(8,2),
  logged_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.reminder_type not null,
  title text not null,
  weekday text not null,
  reminder_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  weight_kg numeric(5,2),
  waist_cm numeric(5,2),
  average_sleep numeric(3,1),
  hunger int check (hunger between 1 and 5),
  energy int check (energy between 1 and 5),
  training_performance int check (training_performance between 1 and 5),
  program_difficulty int check (program_difficulty between 1 and 5),
  diet_adherence int check (diet_adherence between 1 and 5),
  readiness_score int,
  coaching_summary text
);

create table public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null,
  source_url text,
  rights_status text not null,
  raw_content text,
  normalized_knowledge jsonb not null default '{}'::jsonb,
  review_status public.review_status not null default 'draft',
  imported_at timestamptz not null default now()
);

create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.knowledge_sources(id),
  topic text not null,
  claim text not null,
  summary text not null,
  practical_implication text not null,
  source text not null,
  source_url text,
  publication_year int,
  evidence_level text not null,
  date_reviewed date,
  tags text[] not null default '{}',
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.program_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  value jsonb not null,
  description text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.ai_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null,
  prompt_summary text not null,
  response_summary text,
  model text,
  created_at timestamptz not null default now()
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reminder_id uuid references public.reminders(id) on delete set null,
  channel text not null,
  status text not null,
  sent_at timestamptz not null default now()
);

create index body_measurements_user_time_idx on public.body_measurements(user_id, measured_at desc);
create index workout_sessions_user_time_idx on public.workout_sessions(user_id, started_at desc);
create index food_logs_user_time_idx on public.food_logs(user_id, logged_at desc);
create index reminders_user_active_idx on public.reminders(user_id, active);
create index knowledge_items_topic_idx on public.knowledge_items(topic);

alter table public.profiles enable row level security;
alter table public.body_measurements enable row level security;
alter table public.health_screenings enable row level security;
alter table public.training_preferences enable row level security;
alter table public.nutrition_preferences enable row level security;
alter table public.coach_methodologies enable row level security;
alter table public.training_programs enable row level security;
alter table public.program_versions enable row level security;
alter table public.training_days enable row level security;
alter table public.exercise_prescriptions enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.meal_plans enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.food_logs enable row level security;
alter table public.reminders enable row level security;
alter table public.weekly_checkins enable row level security;
alter table public.ai_interactions enable row level security;
alter table public.notification_logs enable row level security;
alter table public.exercises enable row level security;
alter table public.foods enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.program_rules enable row level security;

create policy "profiles own select" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles own update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles own insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);

create policy "public exercise read" on public.exercises for select to authenticated using (active = true);
create policy "public food read" on public.foods for select to authenticated using (active = true);
create policy "public knowledge read" on public.knowledge_items for select to authenticated using (active = true);

create policy "admin exercises all" on public.exercises for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "admin foods all" on public.foods for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "admin knowledge all" on public.knowledge_items for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "admin sources all" on public.knowledge_sources for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "admin rules all" on public.program_rules for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "approved methodology read" on public.coach_methodologies for select to authenticated
using (approved = true and active = true);

create policy "admin methodology all" on public.coach_methodologies for all to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- User-owned table policy pattern. Child tables that do not store user_id
-- are checked through their parent row.
create policy "body own all" on public.body_measurements for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "health own all" on public.health_screenings for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "training pref own all" on public.training_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "nutrition pref own all" on public.nutrition_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "program own all" on public.training_programs for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "workout own all" on public.workout_sessions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "target own all" on public.nutrition_targets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "mealplan own all" on public.meal_plans for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "foodlog own all" on public.food_logs for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "reminder own all" on public.reminders for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "checkin own all" on public.weekly_checkins for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "ai own all" on public.ai_interactions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notification own all" on public.notification_logs for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "version through own program" on public.program_versions for all to authenticated
using (exists (select 1 from public.training_programs p where p.id = program_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.training_programs p where p.id = program_id and p.user_id = (select auth.uid())));

create policy "day through own version" on public.training_days for all to authenticated
using (exists (select 1 from public.program_versions v join public.training_programs p on p.id = v.program_id where v.id = program_version_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.program_versions v join public.training_programs p on p.id = v.program_id where v.id = program_version_id and p.user_id = (select auth.uid())));

create policy "prescription through own day" on public.exercise_prescriptions for all to authenticated
using (exists (select 1 from public.training_days d join public.program_versions v on v.id = d.program_version_id join public.training_programs p on p.id = v.program_id where d.id = training_day_id and p.user_id = (select auth.uid())))
with check (exists (select 1 from public.training_days d join public.program_versions v on v.id = d.program_version_id join public.training_programs p on p.id = v.program_id where d.id = training_day_id and p.user_id = (select auth.uid())));

create policy "set through own workout" on public.workout_sets for all to authenticated
using (exists (select 1 from public.workout_sessions s where s.id = workout_session_id and s.user_id = (select auth.uid())))
with check (exists (select 1 from public.workout_sessions s where s.id = workout_session_id and s.user_id = (select auth.uid())));

create policy "meal through own plan" on public.meals for all to authenticated
using (exists (select 1 from public.meal_plans mp where mp.id = meal_plan_id and mp.user_id = (select auth.uid())))
with check (exists (select 1 from public.meal_plans mp where mp.id = meal_plan_id and mp.user_id = (select auth.uid())));

create policy "meal item through own meal" on public.meal_items for all to authenticated
using (exists (select 1 from public.meals m join public.meal_plans mp on mp.id = m.meal_plan_id where m.id = meal_id and mp.user_id = (select auth.uid())))
with check (exists (select 1 from public.meals m join public.meal_plans mp on mp.id = m.meal_plan_id where m.id = meal_id and mp.user_id = (select auth.uid())));
