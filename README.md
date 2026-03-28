# Sanctuary

**Resilience through Cultural Wisdom.**

Sanctuary is a stealth mental health platform built for South Asian, MENA, and African communities — where clinical language is replaced with cultural resonance, and privacy is not a feature but a foundation.

It doesn't look like a health app. It doesn't feel like a health app. It feels like a wisdom library, a circle of trusted guides, and a private journal you fully own.

---

## The 4 Pillars

### 1. Cultural Reframing Engine

Clinical terms fail communities that think in proverbs, duties, and spiritual metaphors. The Reframing Engine uses **Gemini 1.5 Flash** to translate medical jargon into language that actually lands:

| Clinical Term | Cultural Metaphor | Icon |
|---------------|-------------------|------|
| Anxiety | Restless Spirit | Wind |
| Depression | Heavy Heart | CloudRain |
| Social Anxiety | Social Friction | Users |
| PTSD | Echoing Wound | Repeat |
| Burnout | Burning Edge | Flame |

The full 24-entry **Reframing Dictionary** lives in `lib/mockData.ts` and is referenced by all AI routes.

Every Gemini interaction is filtered through a system prompt that enforces non-clinical, culturally grounded language. No clinical labels are ever surfaced to the user.

**Route:** `/hub` — The Information Hub & Vibe Check

### 2. The Inner Ledger

A privacy-first journaling space for safe reflection — no accounts, no cloud sync, no trace.

- **Daily Spark** — AI-generated culturally resonant writing prompts
- **Energy Tracker** — "Inner Balance" slider (0–100) instead of clinical mood scales
- **Auto-Nuke** — Entries self-destruct after 24 hours if toggled on
- **Wisdom Nuggets** — AI extracts a single positive takeaway from each entry
- **Encryption Notice** — *"Your words are encrypted and owned by you."*

**Route:** `/journal`

### 3. Sanctuary Circles

Anonymous group sessions — yoga, meditation, expert Q&As, and open community talks — hosted over encrypted video with LiveKit.

- Category filters: Mindfulness, Expert Wisdom, Physical Flow, Community Talk
- **Join Anonymously** toggle — camera off, name replaced with a Wisdom Avatar
- Live events open a full-screen video room; future events register with a reminder toast
- Quick Exit button embedded directly in the video UI
- A full **7-day recurring schedule** is seeded in `lib/mockData.ts`

**Route:** `/events`

### 4. Sacred Connections

Private 1-on-1 chat with a **4-tier mentor model**:

| Tier | Role | Count | Example |
|------|------|-------|---------|
| Professional | Clinical Lead / Psychiatrist / Psychologist | 3 | Dr. Mira Patel |
| Peer | Peer Facilitator / Supporter / Wellness Guide | 3 | Sage Echo |
| Interpreter | Cultural Interpreter | 2 | Guide Aris |
| Moderator | Circle / Mindfulness / Youth Moderator | 3 | Ember Drift |

The full **11-mentor roster** with bios, languages, and Wisdom Avatars lives in `lib/mockData.ts`.

- Dual-pane layout: sidebar with pinned mentor + peer list, full chat area with message history
- Voice & Video call overlay with encrypted connection animation
- **Nuke Session** — instantly wipes local chat state

**Route:** `/chat` and `/chat/[id]`

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 (App Router) | SSR, routing, server actions |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS | Utility-first design system |
| Animations | Framer Motion | Ink-bleed transitions, hover effects |
| Icons | Lucide React | Consistent icon set |
| AI | Gemini 1.5 Flash API | Cultural reframing, wisdom generation |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL (Render) | Persistent storage |
| Video/Voice | LiveKit | Encrypted real-time communication |
| Deployment | Render / Vercel | Hosting and CI/CD |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Kushal-Shr/NLN.git
cd NLN
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Database (Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# LiveKit (Video/Voice)
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-host
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — landing page with navigation |
| `/onboarding` | Onboarding flow |
| `/board` | Community board |
| `/hub` | Information Hub — Vibe Check, search, AI wisdom |
| `/journal` | Private journaling with Daily Spark & auto-nuke |
| `/chat` | Sacred Connections inbox |
| `/chat/[id]` | Active 1-on-1 conversation |
| `/events` | Community Circles event dashboard |

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hub-generate` | POST | Gemini wisdom generation from feelings + query |
| `/api/journal-spark` | GET | Daily culturally resonant writing prompt |
| `/api/journal-insight` | POST | Wisdom Nugget extraction from journal entry |
| `/api/reframe` | POST | Clinical-to-cultural term reframing |

---

## Folder Structure

```text
app/
  layout.tsx                  # Root layout with global QuickExit
  page.tsx                    # Home page
  hub/                        # Information Hub
  journal/                    # Private journaling
  chat/                       # Sacred Connections (layout + pages)
  events/                     # Community Circles
  onboarding/                 # Onboarding flow
  board/                      # Community board
  api/
    hub-generate/             # POST — Gemini wisdom generation
    journal-spark/            # GET  — Daily writing prompt
    journal-insight/          # POST — Wisdom Nugget extraction

components/
  shared/                     # Global UI (QuickExit, PageContainer)
  features/
    hub/                      # VibeCheck, SearchBar, ResourceCards, WisdomOutput
    journal/                  # JournalSidebar, EntryEditor, EnergyTracker, WisdomNugget
    chat/                     # ChatSidebar, MessageList, ChatInput, CallOverlay, etc.
    events/                   # FilterBar, EventCard, VideoOverlay, Toast

lib/
  types/index.ts              # Shared TypeScript interfaces (THE source of truth)
  mockData.ts                 # Reframing Dictionary, Mentor Roster, Circles Schedule
  gemini.ts                   # Gemini AI helpers (hub, journal spark, insight)
  db.ts                       # Database client placeholder
  ai.ts                       # Generic AI utility placeholder
  actions/                    # Server Actions (database mutations)
```

---

## The Frontend-Backend Handshake

The frontend and backend communicate through **typed payloads** defined in `lib/types/index.ts`. Every component, server action, and API route imports from this single source.

### Payload Contracts

```typescript
// What the Onboarding form sends to the backend
interface OnboardingPayload {
  culture: string;
  primaryValue: string;
  language: string;
}

// What the Chat input sends to the backend
interface MessagePayload {
  senderId: string;
  conversationId: string;
  content: string;
  isEncrypted: boolean;
}

// What the Journal editor sends to the backend
interface JournalPayload {
  content: string;
  energyLevel: number;
  autoNuke: boolean;
}
```

### Response Envelope

All server actions and API routes return a standard envelope:

```typescript
interface ApiSuccess<T> { success: true; data: T; }
interface ApiError       { success: false; error: string; }
type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

See `CONTRIBUTING.md` for the full backend integration guide.

---

## Stealth & Privacy

Sanctuary is built on the principle that seeking help should never leave a trail.

### Quick Exit

A floating red button is always visible in the bottom-right corner of every page. Pressing `Esc` on the keyboard or clicking the button immediately redirects to a neutral external website (Google or BBC). In video calls, a dedicated Quick Exit button is embedded in the call header. This is a non-negotiable feature — it ships in every layout.

### Anonymous Authentication

Users are never required to provide a real name, email, or phone number. Chat pseudonyms (Wisdom Avatars) replace identity. The "Join Anonymously" toggle in Community Circles disables the camera and replaces the display name. All mentor profiles use culturally resonant names, not real identities.

### Auto-Nuke

Journal entries can be set to self-destruct after 24 hours. The Nuke Session button in Sacred Connections wipes local chat state instantly — `sessionStorage`, `localStorage`, and in-memory state are all cleared. No server-side message retention by default.

### Local-First Encryption

Journal entries carry the notice: *"Your words are encrypted and owned by you."* The platform is designed so that sensitive data lives on-device whenever possible. Server-stored data uses encrypted fields in the Prisma schema.

---

## Theme

Sanctuary uses a **Stealth** aesthetic — it should never look like a medical or therapy app.

| Token | Hex | Usage |
|-------|-----|-------|
| `stealth-bg` | `#0f1720` | Page background |
| `stealth-card` | `#1b2a35` | Card / surface |
| `stealth-accent` | `#0d9488` | Primary accent (deep teal) |
| `stealth-text` | `#dce4ea` | Body text |
| `stealth-muted` | `#93a4b2` | Secondary text |

---

## License

ISC
