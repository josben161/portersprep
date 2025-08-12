# Collaboration & School-specific Recs

## Overview
This update adds three major features:
1. **Updated Dashboard Sidebar** - Reflects the four-step applicant journey
2. **Collaborative Essay Editing** - Share links for anonymous collaboration
3. **School-specific Recommendations** - Contextual recommender management

## Share Links System

### How it Works
- **Owners** can create "anyone with the link can edit/view" URLs for a single answer
- **Anonymous collaborators** never hit Supabase directly; all operations go through `/api/answers/share/*`
- **Liveblocks** is authorized with `shareToken` for real-time editing
- **Security**: Server-enforced role validation and expiration

### Key Components
- `src/lib/share.ts` - Token generation and passcode hashing
- `src/app/api/answers/share/route.ts` - Create share links (owner only)
- `src/app/api/answers/share/[token]/route.ts` - Fetch/save through server
- `src/app/share/[token]/page.tsx` - Public editor interface
- `src/components/ide/ShareAnswerButton.tsx` - Share button for IDE

### Database Schema
```sql
-- Store Liveblocks room on answers
alter table if exists application_answers
  add column if not exists liveblocks_room_id text;

-- Shareable links table (server-enforced)
create table if not exists answer_share_links (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null references application_answers(id) on delete cascade,
  token text not null unique,
  role text not null default 'editor' check (role in ('viewer','editor')),
  expires_at timestamptz,
  passcode_hash text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
```

## Updated Dashboard Sidebar

### Navigation Structure
1. **Profile** - Resume & Story Bank
2. **Predict** - Fit by school
3. **Applications** - Essays & tasks
4. **Recommendations** - School-specific
5. **Coach** - Ask anything

### Implementation
- Updated `src/components/layout/SideNav.tsx` with new structure
- Added descriptions for each section
- Improved active state detection

## School-specific Recommendations

### Features
- **School Selection**: Choose application to view school-specific requirements
- **LOR Requirements**: Display letter count, format, and video assessment info
- **Recommender Assignment**: Assign recommenders to specific schools
- **Contextual Data**: Show school requirements from JSON data

### Components
- `src/app/dashboard/recommendations/page.tsx` - Main recommendations page
- `src/app/api/applications/[id]/school/route.ts` - Fetch school data for app
- School data integration with existing `src/lib/schools.ts`

## QA Checklist

### 1. Share Links Testing
- [ ] In IDE, click **Share** → **Create link**
- [ ] Open link in incognito window
- [ ] Verify anonymous user can edit (editor role)
- [ ] Verify anonymous user can view (viewer role)
- [ ] Test save functionality
- [ ] Verify changes persist in original answer

### 2. Dashboard Navigation
- [ ] Verify sidebar shows new four-step structure
- [ ] Test navigation between sections
- [ ] Verify active states work correctly
- [ ] Check responsive behavior

### 3. School-specific Recommendations
- [ ] Visit `/dashboard/recommendations`
- [ ] Select a school from dropdown
- [ ] Verify school LOR requirements display
- [ ] Assign a recommender to the school
- [ ] Test Prep Pack generation from dashboard
- [ ] Verify school-specific guidance

### 4. Integration Testing
- [ ] Run **Predict** and confirm fit badges show on application tiles
- [ ] Test **Requirements Panel** "Start Draft" creates answer and navigates to IDE
- [ ] Verify **Applications Grid** shows progress rings and fit badges
- [ ] Test **Recommenders** create, assign, and generate Prep Pack

## Environment Variables Required

```bash
# Liveblocks (for real-time collaboration)
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

# App URL (for share links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Migration

Run the following SQL in Supabase SQL editor:

```sql
-- 0a) Store Liveblocks room on answers
alter table if exists application_answers
  add column if not exists liveblocks_room_id text;

-- 0b) Shareable links table
create table if not exists answer_share_links (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid not null references application_answers(id) on delete cascade,
  token text not null unique,
  role text not null default 'editor' check (role in ('viewer','editor')),
  expires_at timestamptz,
  passcode_hash text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_answer_share_links_answer on answer_share_links(answer_id);

-- RLS policies
alter table answer_share_links enable row level security;
create policy asl_owner_select on answer_share_links
  for select using (created_by in (select id from profiles where clerk_user_id = auth_clerk_id()) or auth_role()='admin');
create policy asl_owner_insert on answer_share_links
  for insert with check (created_by in (select id from profiles where clerk_user_id = auth_clerk_id()) or auth_role()='admin');
create policy asl_owner_update on answer_share_links
  for update using (created_by in (select id from profiles where clerk_user_id = auth_clerk_id()) or auth_role()='admin');
create policy asl_owner_delete on answer_share_links
  for delete using (created_by in (select id from profiles where clerk_user_id = auth_clerk_id()) or auth_role()='admin');
```

## Future Enhancements

1. **Liveblocks Integration**: Replace textarea with full collaborative editor
2. **Passcode Protection**: Add optional passcode to share links
3. **Expiration Management**: Add UI for managing link expiration
4. **Activity Tracking**: Track who accessed shared links
5. **Advanced Permissions**: More granular role-based access control 