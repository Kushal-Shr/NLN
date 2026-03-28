# Contributing to Sanctuary

Welcome to the team. This document is the single source of truth for how we write code, integrate frontend with backend, and ship features without breaking each other's work during the hackathon.

**Read this fully before your first commit. No exceptions.**

---

## Part 1 — Git Workflow

### 1.1 The Setup (Do This Once)

```bash
git clone https://github.com/Kushal-Shr/NLN.git
cd NLN
npm install
cp .env.example .env.local   # Fill in your keys
npx prisma generate
npm run dev
```

### 1.2 Creating a Feature Branch

Never code on `main` or `kushal` directly. Always create a new branch.

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

Use prefixes: `feat/`, `fix/`, `chore/`, `docs/`.

### 1.3 Committing

Make small, frequent commits. Atomic changes are easier to review and revert.

```bash
git add .
git commit -m "feat: added cultural persona selection logic"
```

### 1.4 The Sync Step (Before Every Push)

This pulls your teammates' latest work into your branch so you can resolve conflicts locally.

```bash
git fetch origin main
git merge origin/main
```

If there are conflicts, see Section 6.

### 1.5 Pushing & Pull Requests

```bash
# First push of a new branch:
git push -u origin feat/your-feature-name

# Every time after:
git push
```

Go to GitHub, open a Pull Request, tag a teammate to review, and use **Squash and Merge**.

### 1.6 The Secrets Rule

Never push `.env` or `.env.local` files.

If you add a new environment variable:
1. Add the key name to `.env.example` with a blank value.
2. Message the team immediately to update their local files.

---

## Part 2 — The Kushal Branch Workflow

The `kushal` branch is the current **UI integration hub**. It holds the assembled frontend with all features wired together.

### For Backend Developers

1. Branch off `main` for your feature.
2. Build, test, and PR into `main`.
3. Once merged to `main`, help integrate your changes into the `kushal` branch.

### For Frontend Developers

1. Branch off `kushal` for UI work.
2. PR back into `kushal`.
3. Periodically, `kushal` is synced into `main` once features stabilise.

**Never force-push to `kushal` or `main`. Ever.**

---

## Part 3 — Role-Based Folder Ownership

Stay within your assigned areas to reduce conflicts:

| Role | Primary Folders |
|------|-----------------|
| Lead Frontend (Architect) | `app/layout.tsx`, `components/shared/`, `app/globals.css` |
| Feature Frontend (Builder) | `app/onboarding/`, `app/board/`, `app/hub/`, `app/journal/`, `app/events/` |
| Backend & Auth (Plumber) | `prisma/`, `lib/db.ts`, `lib/actions/`, `lib/types/` |
| AI & Logic (Brain) | `app/api/`, `lib/gemini.ts`, `lib/ai.ts` |

---

## Part 4 — Type Safety (Non-Negotiable)

All shared data structures are defined in **one file**:

```
lib/types/index.ts
```

Every component, server action, API route, and mock dataset imports from `@/lib/types`. This is the contract between frontend and backend. If a type changes here, both sides update simultaneously.

### Current Interfaces

| Interface | Used By | Purpose |
|-----------|---------|---------|
| `OnboardingPayload` | Onboarding form → Server Action | `{ culture, primaryValue, language }` |
| `MessagePayload` | Chat input → Server Action | `{ senderId, conversationId, content, isEncrypted }` |
| `JournalPayload` | Journal editor → Server Action | `{ content, energyLevel, autoNuke }` |
| `ReframingEntry` | Gemini AI routes, mock data | `{ clinicalTerm, culturalMetaphor, icon, description }` |
| `Mentor` | Chat sidebar, mock data | `{ id, name, tier, role, wisdomAvatar, bio, languages, available }` |
| `CircleScheduleEntry` | Events page, mock data | `{ id, title, host, category, dayOfWeek, time, durationMinutes }` |
| `ApiResponse<T>` | All server actions / API routes | `{ success: true, data: T } \| { success: false, error: string }` |

### Rules

1. **Never define ad-hoc types in components.** Import from `@/lib/types`.
2. **Never use `any`.** If a type doesn't exist, add it to `lib/types/index.ts` and PR it.
3. **Every server action returns `ApiResponse<T>`.** No raw objects, no untyped responses.

---

## Part 5 — The Backend Blueprint

### 5.1 The Database Bridge (Prisma + Render)

We use Prisma ORM connected to a PostgreSQL instance hosted on Render.

**Connection setup:**

1. Get the `DATABASE_URL` from the team and add it to your `.env.local`.
2. Run `npx prisma generate` to create the Prisma client.
3. Run `npx prisma db push` to sync the schema to the remote database.

**Critical rules:**

- Any change to `prisma/schema.prisma` requires a **Full Team Sync** — message the group chat before and after pushing.
- After every `git pull`, run `npx prisma generate` to regenerate the client from any schema updates.
- Never run `npx prisma db push` without confirming with the team first — it writes directly to the shared database.

### 5.2 Server Actions (The "Handshake")

All database logic lives in `lib/actions/`. Server Actions are the bridge between frontend components and the database. No component should ever import Prisma directly.

**File naming:** One file per feature domain.

```
lib/actions/
  onboarding.ts    # createUserProfile, updateUserProfile
  journal.ts       # createJournalEntry, deleteExpiredEntries
  chat.ts          # sendMessage, getConversation, nukeConversation
  events.ts        # registerForEvent, getSchedule
```

**Template — createJournalEntry:**

```typescript
// lib/actions/journal.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { JournalPayload, JournalEntry, ApiResponse } from "@/lib/types";

export async function createJournalEntry(
  data: JournalPayload
): Promise<ApiResponse<JournalEntry>> {
  try {
    const entry = await prisma.journalEntry.create({
      data: {
        title: "",
        content: data.content,
        energyLevel: data.energyLevel,
        autoNuke: data.autoNuke,
        expiresAt: data.autoNuke
          ? new Date(Date.now() + 86400000).toISOString()
          : null,
      },
    });

    revalidatePath("/journal");
    return { success: true, data: entry as JournalEntry };
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return { success: false, error: "Could not save entry." };
  }
}
```

**Rules:**

- Always mark the file with `"use server"` at the top.
- Always type the input with the corresponding `Payload` interface from `@/lib/types`.
- Always return `ApiResponse<T>` — the frontend depends on the `success` boolean.
- Always call `revalidatePath()` after mutations.
- Always wrap database calls in `try/catch`. Never let unhandled errors reach the client.

### 5.3 Gemini AI Integration

AI routes live in `app/api/`. Every route must include the **sacred system prompt** that prevents clinical language from surfacing.

**Route structure:**

```
app/api/
  hub-generate/route.ts       # Vibe Check → wisdom generation
  journal-spark/route.ts      # Daily culturally resonant writing prompt
  journal-insight/route.ts    # Wisdom Nugget extraction from journal text
  reframe/route.ts            # Clinical → cultural term reframing
```

**The system prompt (mandatory in every Gemini call):**

```typescript
const SYSTEM_INSTRUCTION = `
You are a culturally-aware wisdom guide for South Asian, MENA, and African communities.

NEVER use clinical or medical terminology in your responses. Instead, use metaphors rooted in:
- Nature: monsoons, rivers, seasons, lanterns, tides, roots
- Duty and family: heritage, ancestors, home, the kitchen table
- Spiritual resilience: inner compass, grounding, balance, the flame

Your tone is warm, poetic, and empowering — never diagnostic, never clinical.

Reference the Reframing Dictionary when mapping terms:
- "Anxiety" → "Restless Spirit"
- "Depression" → "Heavy Heart"
- "PTSD" → "Echoing Wound"
(Full dictionary available in lib/mockData.ts)
`;
```

**Rules:**

- Never return raw clinical labels (anxiety, depression, PTSD) in any AI response.
- Always validate input before sending to Gemini — empty prompts waste API quota.
- Keep AI helpers in `lib/gemini.ts`; keep HTTP handling in the `route.ts` files.
- Reference the Reframing Dictionary (`lib/mockData.ts`) when building prompts.

---

## Part 6 — Dataset Creation Requirements

The backend team is responsible for seeding three mandatory datasets. Mock versions are already provided in `lib/mockData.ts`. The backend must replicate this structure in the database.

### Dataset 1: The Reframing Dictionary

A mapping of **24 clinical terms to cultural metaphors** used by the AI engine.

**Location:** `lib/mockData.ts` → `REFRAMING_DICTIONARY`

**Schema per entry:**

```typescript
interface ReframingEntry {
  clinicalTerm: string;      // e.g. "Anxiety"
  culturalMetaphor: string;  // e.g. "Restless Spirit"
  icon: string;              // Lucide icon name, e.g. "Wind"
  description: string;       // e.g. "When the mind won't settle"
}
```

**Requirements:**
- Minimum 20 entries (24 currently seeded).
- Every entry must avoid stigmatising language.
- Icon names must match valid Lucide React component names.

### Dataset 2: The Mentor Roster

**11 mentor profiles** across 4 tiers, each with a Wisdom Avatar.

**Location:** `lib/mockData.ts` → `MENTOR_ROSTER`

**Schema per entry:**

```typescript
interface Mentor {
  id: string;
  name: string;
  tier: "professional" | "peer" | "interpreter" | "moderator";
  role: string;
  wisdomAvatar: string;       // Lucide icon name used as avatar
  bio: string;
  languages: string[];
  available: boolean;
}
```

**Tier distribution requirements:**

| Tier | Minimum Count | Examples |
|------|--------------|---------|
| Professional | 3 | Clinical Lead, Psychiatrist, Psychologist |
| Peer | 3 | Peer Facilitator, Peer Supporter, Wellness Guide |
| Interpreter | 2 | Cultural Interpreter (multilingual) |
| Moderator | 3 | Circle Moderator, Mindfulness Moderator, Youth Moderator |

### Dataset 3: Sacred Circles Schedule

A **7-day recurring schedule** of group sessions across 4 categories.

**Location:** `lib/mockData.ts` → `CIRCLES_SCHEDULE`

**Schema per entry:**

```typescript
interface CircleScheduleEntry {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  category: "meditation" | "yoga" | "expert-talk" | "community";
  dayOfWeek: string;
  time: string;
  durationMinutes: number;
  recurring: boolean;
}
```

**Requirements:**
- Every day of the week must have at least 1 session.
- All 4 categories must appear in the weekly schedule.
- Hosts should reference mentors from the Mentor Roster.
- 14 sessions currently seeded (2 per day).

---

## Part 7 — The Frontend-Backend Payload Contracts

These are the exact payloads the backend **must** accept from the frontend. The types are defined in `lib/types/index.ts`.

### OnboardingPayload

Sent when a user completes the onboarding flow.

```typescript
{
  culture: "south-asian",        // Selected cultural context
  primaryValue: "family-duty",   // Core value from persona selection
  language: "en"                 // Preferred language code
}
```

**Backend action:** `lib/actions/onboarding.ts` → `createUserProfile(data: OnboardingPayload)`

### MessagePayload

Sent when a user sends a chat message in Sacred Connections.

```typescript
{
  senderId: "user-abc123",       // Anonymous user ID
  conversationId: "conv-xyz",    // Active conversation ID
  content: "How do I ground myself?",
  isEncrypted: true              // Client-side encryption flag
}
```

**Backend action:** `lib/actions/chat.ts` → `sendMessage(data: MessagePayload)`

### JournalPayload

Sent when a user saves or auto-saves a journal entry.

```typescript
{
  content: "Watched the river carry leaves...",
  energyLevel: 65,              // 0-100 Inner Energy slider
  autoNuke: true                // Self-destruct after 24 hours
}
```

**Backend action:** `lib/actions/journal.ts` → `createJournalEntry(data: JournalPayload)`

---

## Part 8 — Mocking Strategy

**Mandatory rule:** All frontend development uses `lib/mockData.ts` until the Render PostgreSQL connection is 100% verified and announced by the backend team.

| Dataset | Mock Source | Used By |
|---------|------------|---------|
| Reframing Dictionary | `REFRAMING_DICTIONARY` | Hub AI routes, Vibe Check |
| Mentor Roster | `MENTOR_ROSTER` | Chat sidebar, mentor cards |
| Circles Schedule | `CIRCLES_SCHEDULE` | Events page, event cards |
| Chat Messages | `components/features/chat/types.ts` | Chat message list |
| Journal Entries | `components/features/journal/types.ts` | Journal sidebar |
| Hub Feelings | `components/features/hub/VibeCheck.tsx` | Vibe Check grid |

**When the database goes live:**
1. Backend announces in the group chat.
2. Server actions in `lib/actions/` replace mock imports with Prisma queries.
3. Component interfaces stay identical — only the data source changes.

Do not remove `lib/mockData.ts` after database integration. Keep it as a fallback and for local development without database access.

---

## Part 9 — Integration Rules

These are non-negotiable during the hackathon.

1. **Database changes require a Full Team Sync.** Any modification to `prisma/schema.prisma` must be announced in the group chat before pushing. After pushing, every team member must run `npx prisma generate`.

2. **All database logic lives in `lib/actions/` as Server Actions.** No component should import Prisma directly. No `fetch()` calls to internal API routes for database mutations — use Server Actions.

3. **All shared types live in `lib/types/index.ts`.** No ad-hoc interfaces in components. If a type doesn't exist, add it and PR it.

4. **All API responses use the `ApiResponse<T>` envelope.** The frontend checks `success` before accessing `data`. This prevents runtime crashes from untyped responses.

5. **The `kushal` branch is the UI integration hub.** Backend merges to `main` first, then helps integrate into `kushal`. Frontend branches off `kushal` directly.

6. **Mock data is mandatory until database verification.** Do not hardcode test data in components. Import from `lib/mockData.ts`.

7. **The system prompt is sacred.** Every Gemini AI call must include the non-clinical language instruction. No exceptions.

---

## Part 10 — Resolving Merge Conflicts

Conflicts happen when two people edit the same line. Don't panic.

1. Git will tell you which file is "Both Modified."
2. Open the file — you'll see markers:

```
<<<<<<< HEAD (Your local changes)
"Welcome to Sanctuary"
=======
"Welcome to the Resilience Hub" (The change from main)
>>>>>>> main
```

3. Choose the correct version (or combine them). Delete the markers.
4. Save and finish:

```bash
git add [FILENAME]
git commit -m "chore: resolved merge conflict in [FILENAME]"
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Lint | `npm run lint` |
| Generate Prisma client | `npx prisma generate` |
| Push schema to DB | `npx prisma db push` |
| Open Prisma Studio | `npx prisma studio` |
| Create a branch | `git checkout -b feat/name` |
| Sync with main | `git fetch origin main && git merge origin/main` |
| Push branch | `git push -u origin feat/name` |

---

## Safety-First Mindset

- Test locally before pushing.
- Never commit `.env` files, API keys, or database credentials.
- Run `npx prisma generate` after every pull.
- Message the team before changing `schema.prisma`.
- Use `lib/mockData.ts` for UI work until the database is confirmed live.
- Import all types from `@/lib/types` — never define ad-hoc interfaces.
- When in doubt, ask before merging.
