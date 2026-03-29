// ─────────────────────────────────────────────
// Shared interfaces for the Frontend-Backend Handshake.
// All payloads, entities, and API contracts live here.
// Import from "@/lib/types" everywhere.
// ─────────────────────────────────────────────

// ── Onboarding ──────────────────────────────

export interface OnboardingPayload {
  culture: string;
  primaryValue: string;
  language: string;
}

export interface UserProfile {
  id: string;
  pseudonym: string;
  culture: string;
  primaryValue: string;
  language: string;
  createdAt: string;
}

// ── Chat / Sacred Connections ───────────────

export interface MessagePayload {
  senderId: string;
  conversationId: string;
  content: string;
  isEncrypted: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  isEncrypted: boolean;
  createdAt: string;
}

// ── Journal / Inner Ledger ──────────────────

export interface JournalPayload {
  content: string;
  energyLevel: number;
  autoNuke: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  energyLevel: number;
  autoNuke: boolean;
  createdAt: string;
  expiresAt: string | null;
}

// ── Reframing Dictionary ────────────────────

export interface ReframingEntry {
  clinicalTerm: string;
  culturalMetaphor: string;
  icon: string;
  description: string;
}

// ── Mentor Roster ───────────────────────────

export type MentorTier =
  | "professional"
  | "peer"
  | "interpreter"
  | "moderator";

export interface Mentor {
  id: string;
  name: string;
  tier: MentorTier;
  role: string;
  wisdomAvatar: string;
  bio: string;
  languages: string[];
  available: boolean;
}

// ── Sacred Circles / Events ─────────────────

export type CircleCategory =
  | "meditation"
  | "yoga"
  | "expert-talk"
  | "community";

export interface CircleScheduleEntry {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  category: CircleCategory;
  dayOfWeek: string;
  time: string;
  durationMinutes: number;
  recurring: boolean;
}

// ── AI Reframing ────────────────────────────

export type PersonaTone = "spiritual" | "nature" | "practical" | "community";

export interface ReframePayload {
  rawInput: string;
  persona: PersonaTone;
  userId?: string;
}

export interface ReframeResult {
  insight: string;
  practice: string;
  metaphor: string;
}

// ── AI Mentor Matching ──────────────────────

export interface MatchPayload {
  userInput: string;
  userId?: string;
}

export interface MatchResult {
  recommendedTier: MentorTier;
  matchCertainty: number;
  culturallySpecificReason: string;
}

// ── Resilience Timeline (Firestore) ─────────

export interface InsightRecord {
  type: "reframe" | "match";
  input: string;
  result: ReframeResult | MatchResult;
  createdAt: string;
}

// ── AI Library ──────────────────────────────

export interface LibraryCitation {
  sourceName: string;
  url: string;
}

export interface LibraryResult {
  title: string;
  description: string;
  guidance: string[];
  citations: LibraryCitation[];
}

export interface SavedResource {
  query: string;
  result: LibraryResult;
  savedAt: string;
}

// ── Discovery Card (Hub Feed) ──────────────

export interface DiscoveryCard {
  id: string;
  title: string;
  teaser: string;
  query: string;
  image: string;
  persona: PersonaTone | "all";
}

// ── API Response Envelope ───────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
