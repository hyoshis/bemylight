create extension if not exists pgcrypto;

create type public.profile_status as enum ('active', 'suspended', 'deleted');
create type public.user_role as enum ('member', 'moderator', 'admin');
create type public.content_status as enum ('active', 'hidden', 'removed');
create type public.connection_request_status as enum ('pending', 'accepted', 'declined', 'cancelled');
create type public.connection_status as enum ('active', 'ended');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.encouragement_type as enum ('secular', 'spiritual');
create type public.task_category as enum ('care', 'appointment', 'paperwork', 'household', 'self-care');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  avatar_path text,
  bio text check (char_length(bio) <= 280),
  time_zone text not null default 'UTC',
  encouragement_preference public.encouragement_type not null default 'secular',
  role public.user_role not null default 'member',
  status public.profile_status not null default 'active',
  guidelines_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table public.profile_topics (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.care_topics(id) on delete cascade,
  is_public boolean not null default true,
  primary key (profile_id, topic_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  notes text check (char_length(notes) <= 2000),
  category public.task_category not null default 'care',
  completed_at timestamptz,
  archived_at timestamptz,
  is_daily_focus boolean not null default false,
  focus_position smallint check (focus_position between 1 and 3),
  due_at timestamptz,
  remind_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint focus_position_requires_focus check (
    (is_daily_focus and focus_position is not null)
    or (not is_daily_focus and focus_position is null)
  )
);

create unique index tasks_owner_focus_position_idx
  on public.tasks(owner_id, focus_position)
  where is_daily_focus and completed_at is null and archived_at is null;
create index tasks_owner_active_idx
  on public.tasks(owner_id, created_at desc)
  where archived_at is null;

create table public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'focused', 'unfocused', 'completed', 'restored', 'postponed', 'archived')),
  created_at timestamptz not null default now()
);

create table public.community_topics (
  id uuid primary key default gen_random_uuid(),
  care_topic_id uuid references public.care_topics(id) on delete set null,
  slug text not null unique,
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.community_topics(id),
  body text not null check (char_length(body) between 1 and 1000),
  status public.content_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_topic_created_idx on public.posts(topic_id, created_at desc);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  status public.content_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index comments_post_created_idx on public.comments(post_id, created_at);

create table public.reactions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  reaction_type text not null default 'support' check (reaction_type = 'support'),
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table public.saved_posts (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status public.connection_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> recipient_id)
);
create unique index connection_requests_open_pair_idx
  on public.connection_requests(least(requester_id, recipient_id), greatest(requester_id, recipient_id))
  where status = 'pending';

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  member_one_id uuid not null references public.profiles(id) on delete cascade,
  member_two_id uuid not null references public.profiles(id) on delete cascade,
  status public.connection_status not null default 'active',
  created_at timestamptz not null default now(),
  ended_at timestamptz,
  check (member_one_id < member_two_id),
  unique (member_one_id, member_two_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null unique references public.connections(id) on delete cascade,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  archived_at timestamptz,
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  status public.content_status not null default 'active',
  created_at timestamptz not null default now()
);
create index messages_conversation_created_idx
  on public.messages(conversation_id, created_at);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'post', 'comment', 'message')),
  target_id uuid not null,
  reason text not null check (reason in ('harassment', 'privacy', 'medical-advice', 'self-harm', 'spam', 'other')),
  details text check (char_length(details) <= 1000),
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reports_status_created_idx on public.reports(status, created_at);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  moderator_id uuid not null references public.profiles(id),
  action text not null check (action in ('dismiss', 'hide-content', 'remove-content', 'warn-user', 'suspend-user', 'restore-content')),
  rationale text not null check (char_length(rationale) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.encouragements (
  id uuid primary key default gen_random_uuid(),
  content_type public.encouragement_type not null,
  body text not null check (char_length(body) between 1 and 500),
  reflection_prompt text check (char_length(reflection_prompt) <= 300),
  attribution text,
  source_url text,
  is_reviewed boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reminder_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  email_enabled boolean not null default false,
  task_reminders_enabled boolean not null default true,
  daily_prompt_enabled boolean not null default true,
  local_delivery_time time not null default '08:30',
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null check (notification_type in ('connection-request', 'connection-accepted', 'comment', 'message', 'task-reminder', 'daily-prompt', 'moderation')),
  title text not null,
  body text not null,
  target_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_recipient_created_idx
  on public.notifications(recipient_id, created_at desc);

create table public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  notification_id uuid references public.notifications(id) on delete set null,
  idempotency_key text not null unique,
  provider_message_id text,
  status text not null check (status in ('pending', 'sent', 'failed', 'skipped')),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('moderator', 'admin')
      and status = 'active'
  );
$$;

create or replace function public.is_blocked_pair(other_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.blocks
    where (blocker_id = auth.uid() and blocked_id = other_user_id)
       or (blocker_id = other_user_id and blocked_id = auth.uid())
  );
$$;

create or replace function public.is_conversation_member(target_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversation_members
    where conversation_id = target_conversation_id
      and profile_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.care_topics enable row level security;
alter table public.profile_topics enable row level security;
alter table public.tasks enable row level security;
alter table public.task_events enable row level security;
alter table public.community_topics enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.saved_posts enable row level security;
alter table public.blocks enable row level security;
alter table public.connection_requests enable row level security;
alter table public.connections enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.encouragements enable row level security;
alter table public.reminder_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.email_deliveries enable row level security;

create policy "active profiles are visible to members"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or (
      status = 'active'
      and not public.is_blocked_pair(id)
    )
    or public.is_moderator()
  );
create policy "members update their profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'member');

create policy "topics are visible to members"
  on public.care_topics for select to authenticated using (is_active);
create policy "community topics are visible to members"
  on public.community_topics for select to authenticated using (is_active);

create policy "members manage their topic selections"
  on public.profile_topics for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
create policy "public topic selections are visible"
  on public.profile_topics for select to authenticated
  using (is_public and not public.is_blocked_pair(profile_id));

create policy "members manage their tasks"
  on public.tasks for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy "members view their task history"
  on public.task_events for select to authenticated
  using (owner_id = auth.uid());
create policy "members add their task history"
  on public.task_events for insert to authenticated
  with check (owner_id = auth.uid());

create policy "active posts are visible"
  on public.posts for select to authenticated
  using (
    (status = 'active' and not public.is_blocked_pair(author_id))
    or author_id = auth.uid()
    or public.is_moderator()
  );
create policy "members create their posts"
  on public.posts for insert to authenticated
  with check (author_id = auth.uid());
create policy "authors update their posts"
  on public.posts for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "active comments are visible"
  on public.comments for select to authenticated
  using (
    (status = 'active' and not public.is_blocked_pair(author_id))
    or author_id = auth.uid()
    or public.is_moderator()
  );
create policy "members create their comments"
  on public.comments for insert to authenticated
  with check (author_id = auth.uid());
create policy "authors update their comments"
  on public.comments for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

create policy "members manage their reactions"
  on public.reactions for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy "reaction counts are visible"
  on public.reactions for select to authenticated using (true);
create policy "members manage saved posts"
  on public.saved_posts for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "members manage blocks they create"
  on public.blocks for all to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());

create policy "request participants can view requests"
  on public.connection_requests for select to authenticated
  using (auth.uid() in (requester_id, recipient_id));
create policy "members create safe requests"
  on public.connection_requests for insert to authenticated
  with check (
    requester_id = auth.uid()
    and not public.is_blocked_pair(recipient_id)
  );
create policy "request participants update requests"
  on public.connection_requests for update to authenticated
  using (auth.uid() in (requester_id, recipient_id))
  with check (auth.uid() in (requester_id, recipient_id));

create policy "connection members view connections"
  on public.connections for select to authenticated
  using (auth.uid() in (member_one_id, member_two_id));
create policy "connection members update connections"
  on public.connections for update to authenticated
  using (auth.uid() in (member_one_id, member_two_id));

create policy "conversation members view conversations"
  on public.conversations for select to authenticated
  using (public.is_conversation_member(id));
create policy "members view their memberships"
  on public.conversation_members for select to authenticated
  using (profile_id = auth.uid());
create policy "members update their memberships"
  on public.conversation_members for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "conversation members view messages"
  on public.messages for select to authenticated
  using (public.is_conversation_member(conversation_id));
create policy "conversation members send messages"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_conversation_member(conversation_id)
  );

create policy "members create reports"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());
create policy "members view their reports"
  on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_moderator());
create policy "moderators update reports"
  on public.reports for update to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy "moderators manage actions"
  on public.moderation_actions for all to authenticated
  using (public.is_moderator())
  with check (public.is_moderator() and moderator_id = auth.uid());

create policy "reviewed encouragement is visible"
  on public.encouragements for select to authenticated
  using ((is_reviewed and is_active) or public.is_moderator());
create policy "moderators manage encouragement"
  on public.encouragements for all to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy "members manage reminder preferences"
  on public.reminder_preferences for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
create policy "members view notifications"
  on public.notifications for select to authenticated
  using (recipient_id = auth.uid());
create policy "members mark notifications read"
  on public.notifications for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());
create policy "members view email delivery status"
  on public.email_deliveries for select to authenticated
  using (recipient_id = auth.uid());

insert into public.care_topics (slug, name, sort_order) values
  ('aging-parents', 'Aging parents', 10),
  ('dementia-care', 'Dementia care', 20),
  ('long-distance-caregiving', 'Long-distance caregiving', 30),
  ('new-to-caregiving', 'New to caregiving', 40),
  ('balancing-work-and-care', 'Balancing work and care', 50),
  ('caregiver-wellbeing', 'Caregiver wellbeing', 60);

insert into public.community_topics (care_topic_id, slug, name)
select id, slug, name from public.care_topics;

insert into public.encouragements
  (content_type, body, reflection_prompt, is_reviewed, is_active)
values
  ('secular', 'You are allowed to take this one gentle step at a time.', 'What is one thing you can make easier for yourself today?', true, true),
  ('secular', 'Rest is not a reward for finishing everything. It is part of how you keep going.', 'Choose one small pause and protect it.', true, true),
  ('spiritual', 'May you feel held by something larger than this difficult moment.', 'Take one slow breath and notice what gives you steadiness.', true, true);
