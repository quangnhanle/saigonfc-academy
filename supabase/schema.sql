-- =====================================================================
-- Saigon FC Skill Hub - Supabase schema
-- Chạy toàn bộ file này trong Supabase SQL Editor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. students
-- ---------------------------------------------------------------------
create table if not exists public.students (
  id              text primary key,
  full_name       text not null,
  birth_year      int  not null,
  position        text not null,
  preferred_foot  text not null check (preferred_foot in ('left','right','both')),
  avatar_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. club_standards (nhóm kỹ năng cấp cao)
-- ---------------------------------------------------------------------
create table if not exists public.club_standards (
  id              text primary key,
  standard_name   text not null,
  standard_score  numeric not null default 100,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. skill_tests (bài test thuộc một nhóm kỹ năng)
-- ---------------------------------------------------------------------
create table if not exists public.skill_tests (
  id                 text primary key,
  club_standard_id   text not null references public.club_standards(id) on delete cascade,
  test_name          text not null,
  description        text,
  record_type        text not null check (record_type in ('time_seconds','success_attempt')),
  higher_is_better   boolean not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists idx_skill_tests_club_standard
  on public.skill_tests(club_standard_id);

-- ---------------------------------------------------------------------
-- 4. sub_skill_tests (biến thể chi tiết của một bài test, ví dụ "chân trái")
-- ---------------------------------------------------------------------
create table if not exists public.sub_skill_tests (
  id                   text primary key,
  skill_test_id        text not null references public.skill_tests(id) on delete cascade,
  sub_skill_test_name  text not null,
  standard_score       numeric not null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_sub_skill_tests_skill_test
  on public.sub_skill_tests(skill_test_id);

-- ---------------------------------------------------------------------
-- 5. test_results
-- ---------------------------------------------------------------------
create table if not exists public.test_results (
  id                 text primary key,
  student_id         text not null references public.students(id) on delete cascade,
  sub_skill_test_id  text not null references public.sub_skill_tests(id) on delete cascade,
  value_numeric      numeric,
  success_count      int,
  attempt_count      int,
  score_percent      numeric not null default 0,
  note               text,
  tested_at          date not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists idx_test_results_student
  on public.test_results(student_id);
create index if not exists idx_test_results_sub_skill
  on public.test_results(sub_skill_test_id);

-- ---------------------------------------------------------------------
-- Trigger tự cập nhật updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'students',
    'club_standards',
    'skill_tests',
    'sub_skill_tests',
    'test_results'
  ] loop
    execute format('drop trigger if exists trg_set_updated_at on public.%I;', t);
    execute format(
      'create trigger trg_set_updated_at
         before update on public.%I
         for each row execute function public.set_updated_at();',
      t
    );
  end loop;
end$$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
-- LƯU Ý: App hiện đang dùng anon key cho cả read & write (chưa có Supabase Auth).
-- Vì vậy mở quyền read+write cho role anon. Khi nâng cấp lên Supabase Auth,
-- nên thay các policy bên dưới bằng policy theo auth.uid().

alter table public.students        enable row level security;
alter table public.club_standards  enable row level security;
alter table public.skill_tests     enable row level security;
alter table public.sub_skill_tests enable row level security;
alter table public.test_results    enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'students',
    'club_standards',
    'skill_tests',
    'sub_skill_tests',
    'test_results'
  ] loop
    execute format('drop policy if exists "anon_all_%s" on public.%I;', t, t);
    execute format(
      'create policy "anon_all_%s" on public.%I
         for all to anon
         using (true) with check (true);',
      t, t
    );
  end loop;
end$$;
