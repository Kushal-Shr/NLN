# Sanctuary 🌿

> Your space to breathe, reflect, and heal.

Sanctuary is a stealth mental health platform built for everyone — where privacy is not a feature but a foundation, and support feels human, not clinical.

It doesn't look like a health app. It doesn't feel like a health app. It feels like a wisdom library, a circle of trusted guides, and a private journal you fully own.

---

## The Problem

Mental health stigma affects millions of people around the world. Clinical language fails people who need support in a way that actually resonates with them. Seeking help leaves a trace. And most platforms make support feel cold, complicated, and out of reach.

Sanctuary is built differently.

---

## Features

### 1. Cultural Reframing Engine
Translates clinical mental health terms into culturally resonant language using Gemini 1.5 Flash AI.

| Clinical Term | Cultural Metaphor |
|---------------|------------------|
| Anxiety | Restless Spirit |
| Depression | Heavy Heart |
| Social Anxiety | Social Friction |
| PTSD | Echoing Wound |
| Burnout | Burning Edge |

No clinical labels are ever surfaced to the user. Every AI interaction is filtered through a culturally grounded system prompt.

### 2. The Inner Ledger
A privacy-first journaling space — no accounts, no cloud sync, no trace.

- **Daily Spark** — AI-generated culturally resonant writing prompts
- **Energy Tracker** — Inner Balance slider (0–100) instead of clinical mood scales
- **Auto-Nuke** — Entries self-destruct after 24 hours if toggled on
- **Wisdom Nuggets** — AI extracts one positive takeaway from each entry
- All entries encrypted and owned by the user

### 3. Sanctuary Circles
Anonymous group sessions over encrypted video — yoga, meditation, expert Q&As, and community talks.

- Category filters: Mindfulness, Expert Wisdom, Physical Flow, Community Talk
- **Join Anonymously** toggle — camera off, name replaced with a Wisdom Avatar
- 7-day recurring schedule
- **Quick Exit** button embedded in every video session
- Hosted with LiveKit encrypted real-time communication

### 4. Sacred Connections
Private 1-on-1 chat with a 4-tier mentor model:

| Tier | Role | Example |
|------|------|---------|
| Professional | Clinical Lead, Psychiatrist, Psychologist | Dr. Mira Patel |
| Peer | Peer Facilitator, Wellness Guide | Sage Echo |
| Interpreter | Cultural Interpreter | Guide Aris |
| Moderator | Circle, Mindfulness, Youth Moderator | Ember Drift |

- Dual-pane layout: sidebar with mentor list + full chat area
- Voice and video call with encrypted connection
- **Nuke Session** — instantly wipes all local chat state
- All mentor profiles use Wisdom Avatars, not real identities

### Stealth & Privacy

Sanctuary is built on the principle that seeking help should never leave a trail.

- **Quick Exit** — floating button always visible on every page. Press `Esc` or click to immediately redirect to a neutral external site (Google or BBC)
- **Anonymous Auth** — no real name, email, or phone number ever required
- **Auto-Nuke** — journal entries self-destruct after 24 hours if enabled
- **Nuke Session** — wipes sessionStorage, localStorage, and in-memory chat state instantly
- **Local-First Encryption** — sensitive data lives on-device wherever possible

---

## Roadmap

- [x] Cultural Reframing Engine (Gemini 1.5 Flash)
- [x] Inner Ledger — journaling with Auto-Nuke and Energy Tracker
- [x] Sanctuary Circles — anonymous encrypted group sessions
- [x] Sacred Connections — 4-tier mentor model with 1-on-1 chat
- [x] Quick Exit on every page
- [x] Voice and video call with Nuke Session
- [x] Stealth design system
- [x] Google Calendar integration and day analysis
- [x] Free time suggestions (busy / moderate / light day)
- [x] Upcoming dates tracker
- [x] 90-day milestone roadmap
- [x] Email notification preferences
- [ ] Full production Google OAuth
- [ ] Real email sending (Resend or SendGrid)
- [ ] Mood history graphs and pattern detection
- [ ] Weekly check-in that updates the roadmap
- [ ] Counsellor / institutional dashboard (B2B)
- [ ] Mobile app

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR, routing, server actions |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS | Utility-first design system |
| Animations | Framer Motion | Ink-bleed transitions, hover effects |
| Icons | Lucide React | Consistent icon set |
| AI | Gemini 1.5 Flash | Cultural reframing, wisdom generation |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL (Render) | Persistent storage |
| Video / Voice | LiveKit | Encrypted real-time communication |
| Deployment | Render / Vercel | Hosting and CI/CD |

---

## Design

Sanctuary uses a **Stealth** aesthetic — it should never look like a medical or therapy app.

| Token | Hex | Usage |
|-------|-----|-------|
| `stealth-bg` | `#0f1720` | Page background |
| `stealth-card` | `#1b2a35` | Card / surface |
| `stealth-accent` | `#0d9488` | Primary accent (deep teal) |
| `stealth-text` | `#dce4ea` | Body text |
| `stealth-muted` | `#93a4b2` | Secondary text |

---

## Project Structure

```
app/
├── page.tsx                  # Home — landing page
├── onboarding/               # Onboarding flow
├── hub/                      # Information Hub — Vibe Check, AI wisdom
├── journal/                  # Private journaling — Daily Spark, Auto-Nuke
├── chat/                     # Sacred Connections inbox
│   └── [id]/                 # Active 1-on-1 conversation
├── events/                   # Sanctuary Circles — event dashboard
├── board/                    # Community board
└── api/
    ├── hub-generate/         # POST — Gemini wisdom generation
    ├── journal-spark/        # GET  — Daily writing prompt
    ├── journal-insight/      # POST — Wisdom Nugget extraction
    └── reframe/              # POST — Clinical-to-cultural reframing

components/
├── shared/                   # Global UI (QuickExit, PageContainer)
└── features/
    ├── hub/                  # VibeCheck, SearchBar, WisdomOutput
    ├── journal/              # EntryEditor, EnergyTracker, WisdomNugget
    ├── chat/                 # ChatSidebar, MessageList, CallOverlay
    └── events/               # FilterBar, EventCard, VideoOverlay

lib/
├── types/index.ts            # Shared TypeScript interfaces (source of truth)
├── mockData.ts               # Reframing Dictionary, Mentor Roster, Circles Schedule
├── gemini.ts                 # Gemini AI helpers
├── db.ts                     # Database client
└── actions/                  # Server Actions (database mutations)
```

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — landing page |
| `/onboarding` | Onboarding flow |
| `/hub` | Information Hub — Vibe Check, AI wisdom search |
| `/journal` | Private journaling — Daily Spark, Auto-Nuke |
| `/chat` | Sacred Connections inbox |
| `/chat/[id]` | Active 1-on-1 conversation |
| `/events` | Sanctuary Circles event dashboard |
| `/board` | Community board |

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hub-generate` | POST | Gemini wisdom generation from feelings + query |
| `/api/journal-spark` | GET | Daily culturally resonant writing prompt |
| `/api/journal-insight` | POST | Wisdom Nugget extraction from journal entry |
| `/api/reframe` | POST | Clinical-to-cultural term reframing |

---

## Installation

```bash
git clone https://github.com/Kushal-Shr/NLN.git
cd NLN
npm install
```

## Environment Variables

Create a `.env.local` file in the root:

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

## Database Setup

```bash
npx prisma generate
npx prisma db push
```

## Usage

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Branch Strategy

```
main                              # Stable production code
├── feature/backend               # Database, auth, Prisma, API routes
└── feature/sanctuary-frontend    # Platform UI and components
```

To contribute:

```bash
git checkout feature/backend
git pull origin feature/backend
git checkout -b feature/your-feature-name
# make your changes
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub — base: `feature/backend`, compare: your branch.

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

Read [Contributing.md](Contributing.md) for guidelines.

---

## Crisis Resources

If you're struggling right now:

| Country | Service | Contact |
|---------|---------|---------|
| USA | 988 Suicide & Crisis Lifeline | Call or text **988** |
| UK | Samaritans | Call **116 123** — free, 24/7 |
| Anywhere | Find A Helpline | [findahelpline.com](https://findahelpline.com) |

---

## License

ISC License — see [LICENSE](LICENSE) for details.

---

*Sanctuary provides structured guidance and peer resources — not clinical diagnosis or medical treatment. If you are in a mental health emergency, contact emergency services or a crisis line immediately.*
