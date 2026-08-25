create type public.post_type as enum ('announcement', 'success_story', 'activity', 'request', 'opportunity', 'helpful_information');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text check (bio is null or char_length(bio) <= 500),
  area text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  organization_type text not null,
  description text not null default '',
  contact_email text,
  website_url text,
  area text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.organization_follows (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  post_type public.post_type not null,
  body text not null check (char_length(body) between 1 and 5000),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.post_reactions (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_saves (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  category text not null,
  starts_at timestamptz not null,
  location_name text not null,
  area text,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now()
);

create table public.event_attendees (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table public.community_requests (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in ('report', 'help', 'offer')),
  body text not null check (char_length(body) between 1 and 3000),
  area text,
  created_at timestamptz not null default now()
);

create index posts_created_at_idx on public.posts (created_at desc);
create index posts_author_id_idx on public.posts (author_id);
create index comments_post_id_idx on public.post_comments (post_id, created_at);
create index events_starts_at_idx on public.events (starts_at);
create index event_attendees_user_id_idx on public.event_attendees (user_id);
create index follows_user_id_idx on public.organization_follows (user_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_follows enable row level security;
alter table public.posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.post_saves enable row level security;
alter table public.post_shares enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.community_requests enable row level security;

grant select on public.profiles, public.organizations, public.posts, public.post_comments, public.post_reactions, public.post_saves, public.post_shares, public.events, public.event_attendees to anon, authenticated;
grant insert, update, delete on public.profiles, public.organization_follows, public.posts, public.post_comments, public.post_reactions, public.post_saves, public.post_shares, public.event_attendees, public.community_requests to authenticated;
grant select, insert, update, delete on public.organization_follows, public.community_requests to authenticated;

create policy "public profiles are readable" on public.profiles for select to anon, authenticated using (true);
create policy "users manage their profile" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "verified organizations are readable" on public.organizations for select to anon, authenticated using (verified = true);
create policy "users read follows" on public.organization_follows for select to authenticated using ((select auth.uid()) = user_id);
create policy "users create follows" on public.organization_follows for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users remove follows" on public.organization_follows for delete to authenticated using ((select auth.uid()) = user_id);
create policy "published posts are readable" on public.posts for select to anon, authenticated using (true);
create policy "users create posts" on public.posts for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "authors update posts" on public.posts for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "authors delete posts" on public.posts for delete to authenticated using ((select auth.uid()) = author_id);
create policy "comments are readable" on public.post_comments for select to anon, authenticated using (true);
create policy "users create comments" on public.post_comments for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "authors delete comments" on public.post_comments for delete to authenticated using ((select auth.uid()) = author_id);
create policy "reactions are readable" on public.post_reactions for select to anon, authenticated using (true);
create policy "users manage reactions" on public.post_reactions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saves are private" on public.post_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy "users manage saves" on public.post_saves for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "shares are readable" on public.post_shares for select to authenticated using (true);
create policy "users create shares" on public.post_shares for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "upcoming events are readable" on public.events for select to anon, authenticated using (starts_at >= now());
create policy "attendees are readable" on public.event_attendees for select to authenticated using (true);
create policy "users manage attendance" on public.event_attendees for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users read community requests" on public.community_requests for select to authenticated using ((select auth.uid()) = author_id);
create policy "users create community requests" on public.community_requests for insert to authenticated with check ((select auth.uid()) = author_id);
