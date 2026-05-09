-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null default '',
  job_title text default '',
  organization text default '',
  bio text default '',
  avatar_url text default '',
  phone text default '',
  email text default '',
  website text default '',
  location text default '',
  role text not null default 'free' check (role in ('admin', 'pro', 'free')),
  theme text not null default 'minimal-light',
  custom_color text default '#3b82f6',
  profile_views integer default 0,
  contact_saves integer default 0,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Public can read all profiles (for public profile pages)
create policy "profiles_public_read" on public.profiles for select using (true);
-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
-- Users can update their own profile
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
-- Users can delete their own profile
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create social_links table
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null default 'custom',
  label text not null default 'New Link',
  url text not null default '',
  icon text not null default 'Link',
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

alter table public.social_links enable row level security;

-- Public can read all links (for public profile pages)
create policy "links_public_read" on public.social_links for select using (true);
-- Users can manage their own links
create policy "links_insert_own" on public.social_links for insert with check (
  auth.uid() = profile_id
);
create policy "links_update_own" on public.social_links for update using (
  auth.uid() = profile_id
);
create policy "links_delete_own" on public.social_links for delete using (
  auth.uid() = profile_id
);

-- Create reserved_keywords table
create table if not exists public.reserved_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text unique not null,
  created_at timestamptz default now()
);

alter table public.reserved_keywords enable row level security;

-- Anyone can read reserved keywords
create policy "keywords_public_read" on public.reserved_keywords for select using (true);

-- Insert default reserved keywords
insert into public.reserved_keywords (keyword) values
  ('admin'), ('settings'), ('help'), ('dashboard'), ('login'),
  ('signup'), ('api'), ('profile'), ('about'), ('auth')
on conflict (keyword) do nothing;
