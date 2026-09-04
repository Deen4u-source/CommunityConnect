# CommunityConnect

CommunityConnect is a mobile application that enables residents, students, volunteers, and local organizations to connect and collaborate on community initiatives. The app transforms awareness into participation by making it easy to discover local opportunities, organize events, report issues, and track community impact.

## Key Features

- **Discover**: Find nearby community events, volunteer opportunities, and help requests
- **Report**: Document local problems (waste, infrastructure damage, safety concerns) with photos and location
- **Connect**: Offer or request help within your community
- **Participate**: Join and create community events
- **Visualize**: View an interactive map of local activity
- **Impact**: Build a personal Community Impact Score through positive contributions
- **Updates**: Receive relevant local updates and opportunities

The app focuses on turning awareness into participation and participation into measurable community impact.

## Tabs Overview

### 🏠 Home Tab
- Personalized impact score and volunteer statistics
- Nearby activities and community projects at a glance
- Quick navigation to discover organizations and community stories

### 🗺️ Map Tab
- Interactive map showing community activity nearby
- Location-based discovery of events and organizations
- Visual indicators for different types of community activities

### 👥 Community Tab
- Browse verified organizations and volunteer groups
- Follow organizations to receive updates
- View community feed with posts, success stories, and opportunities
- Like, save, comment on, and share posts

### 📅 Events Tab
- Browse upcoming community events
- Filter by category (Environment, Education, Health, etc.)
- Join events and track your attendance
- View event details including time, location, and attendance count

### 👤 Profile Tab
- Manage your profile and community impact score
- View your volunteer history and achievements
- Track badges and recognition
- Access your posts and joined events

## Run Locally

### Prerequisites
- Node.js (v16+) and npm installed
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for testing on physical device)

### Installation

```bash
npm install
```

### Start the App

```bash
npm run start
```

Then select your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app for physical device

### Demo Mode

The app runs in demo mode when Supabase environment variables are absent. The interactive demo supports:
- All five bottom tabs with navigation
- Organization details and following functionality
- Post creation and feed reactions (likes, saves, comments)
- Event browsing and attendance management
- Profile editing and settings

## Supabase Setup

To connect to a real Supabase backend:

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-or-publishable-key
```

**Important:** Never place a service-role or secret key in the Expo app - always use the anonymous/publishable key.

### 2. Set Up Database Schema

Apply the database migration using the Supabase SQL editor or CLI:

```bash
supabase db push
```

Or manually run the migration SQL from `supabase/migrations/202608250001_communityconnect.sql`

### 3. Required Database Tables

The app requires the following tables in Supabase:

- `profiles` - User profile information (display_name, bio, area, avatar_url)
- `organizations` - Community organizations and groups (name, type, description, verified)
- `posts` - Community feed posts (body, post_type, author_id, created_at)
- `events` - Community events (title, description, starts_at, location_name, category)
- `post_reactions` - User reactions (likes) on posts (post_id, user_id)
- `post_saves` - Saved posts for users (post_id, user_id)
- `post_comments` - Comments on posts (post_id, author_id, body, created_at)
- `post_shares` - Share tracking for posts (post_id, user_id, shared_at)
- `organization_follows` - User follows on organizations (organization_id, user_id)
- `event_attendees` - Event attendance tracking (event_id, user_id, joined_at)
- `community_requests` - Reports, help requests, and help offers (author_id, body, request_type)

## Tech Stack

### Frontend
- **React Native** - Cross-platform mobile UI framework
- **Expo** - Managed React Native platform with built-in tools
- **Expo Router** - File-based routing similar to Next.js
- **TypeScript** - Type-safe JavaScript
- **React Hooks** - State management and side effects

### Backend & Services
- **Supabase** - PostgreSQL database + Authentication
- **Supabase Auth** - Email/password authentication
- **Supabase Realtime** - Real-time database subscriptions

### UI & Icons
- **React Native Paper** - Material Design components
- **Expo Vector Icons** - Icon library (Ionicons)
- **Expo Image Picker** - Image selection from device
- **Expo Location** - GPS location services

## Project Structure

```
.
├── App.tsx                          # Root component with auth wrapper
├── InteractiveApp.tsx               # Main app UI with all 5 tabs
├── index.js                         # Expo entry point
├── app/
│   └── index.tsx                    # Expo Router entry point
├── src/
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client initialization
│   │   ├── community.ts             # Community-related API calls
│   │   └── profile.ts               # Profile-related API calls
│   └── providers/
│       └── AuthGate.tsx             # Auth state management & login screen
├── supabase/
│   └── migrations/                  # Database migration files
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
├── app.json                         # Expo app configuration
└── README.md                        # This file
```

## Development Guide

### Type Checking

The project uses TypeScript with strict mode enabled. Run type checking:

```bash
npx tsc --noEmit
```

### Code Style

The project follows standard React and TypeScript conventions. Key guidelines:
- Use functional components with hooks
- Type all props and state explicitly
- Use proper error handling with try-catch blocks
- Add null checks before accessing object properties
- Use descriptive variable and function names

### API Functions

All Supabase API calls are located in `src/lib/`:

- `community.ts` - Posts, events, reactions, shares, comments
- `profile.ts` - User profile management
- `supabase.ts` - Client initialization and configuration

### State Management

The app uses React hooks for state management:
- `useState` - Local component state
- `useEffect` - Side effects and data fetching
- Context (via AuthGate) - Auth state sharing

## Error Handling

The app includes comprehensive error handling:
- User-friendly error messages via Alert dialogs
- Try-catch blocks for async operations
- Null checks before database operations
- Error logging to console for debugging
- Graceful fallbacks in demo mode

## Contributing

We welcome contributions! To contribute:

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly on iOS, Android, and web
4. Submit a pull request with a clear description

## License

ISC License - See LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide reproduction steps for bugs
- Include device/platform information
