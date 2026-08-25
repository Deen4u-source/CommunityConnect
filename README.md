CommunityConnect is a mobile application that enables residents, students, volunteers, and local organizations to:


Discover nearby community events, volunteer opportunities, and help requests
Report local problems (such as waste, damaged infrastructure, or safety concerns) with photos and location
Offer or request help within their community
Join and create community events
View an interactive map of local activity
Build a personal Community Impact Score through positive contributions
Receive relevant local updates and opportunities

The app focuses on turning awareness into participation and participation into measurable community impact.

## Run locally

```bash
npm install
npm run start
```

The current UI runs in demo mode when Supabase environment variables are absent. The interactive demo supports the five bottom tabs, organization details and following, post creation and feed reactions, event details and joining, profile settings, and report/help/offer forms.

## Supabase setup

Copy `.env.example` to `.env` and fill in the public project URL and anon or publishable key:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-key
```

Never place a service-role or secret key in the Expo app. Apply `supabase/migrations/202608250001_communityconnect.sql` from the Supabase SQL editor or with the Supabase CLI. The migration enables RLS and grants only the client roles required by the policies. Authentication wiring and replacing demo state with Supabase queries are the next implementation slice.
