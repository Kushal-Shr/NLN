import type {
  ReframingEntry,
  Mentor,
  CircleScheduleEntry,
} from "@/lib/types";

// ─────────────────────────────────────────────
// DATASET 1 — The Reframing Dictionary
// 20+ clinical-to-cultural mappings for the
// Cultural Reframing Engine (Gemini AI).
// ─────────────────────────────────────────────

export const REFRAMING_DICTIONARY: ReframingEntry[] = [
  { clinicalTerm: "Anxiety", culturalMetaphor: "Restless Spirit", icon: "Wind", description: "When the mind won't settle" },
  { clinicalTerm: "Depression", culturalMetaphor: "Heavy Heart", icon: "CloudRain", description: "Carrying a weight you can't name" },
  { clinicalTerm: "Social Anxiety", culturalMetaphor: "Social Friction", icon: "Users", description: "The crowd feels like static" },
  { clinicalTerm: "Panic Attack", culturalMetaphor: "Inner Storm", icon: "Zap", description: "Lightning strikes without warning" },
  { clinicalTerm: "PTSD", culturalMetaphor: "Echoing Wound", icon: "Repeat", description: "The past replays unbidden" },
  { clinicalTerm: "Insomnia", culturalMetaphor: "Restless Night", icon: "Moon", description: "The mind refuses to dim its lantern" },
  { clinicalTerm: "Burnout", culturalMetaphor: "Burning Edge", icon: "Flame", description: "Running hot, close to overflow" },
  { clinicalTerm: "Dissociation", culturalMetaphor: "Foggy Lens", icon: "Eye", description: "Can't see what's ahead clearly" },
  { clinicalTerm: "OCD", culturalMetaphor: "Unbroken Loop", icon: "RefreshCw", description: "The wheel turns but doesn't advance" },
  { clinicalTerm: "Grief", culturalMetaphor: "Absent Sun", icon: "Sunset", description: "Light that no longer reaches you" },
  { clinicalTerm: "Loneliness", culturalMetaphor: "Silent Room", icon: "Home", description: "Walls that echo but don't answer" },
  { clinicalTerm: "Anger Issues", culturalMetaphor: "Volcanic Pulse", icon: "Flame", description: "Pressure building beneath the surface" },
  { clinicalTerm: "Low Self-Esteem", culturalMetaphor: "Dimmed Lantern", icon: "Lamp", description: "The flame forgets its own brightness" },
  { clinicalTerm: "Addiction", culturalMetaphor: "False Anchor", icon: "Anchor", description: "Holding onto what pulls you under" },
  { clinicalTerm: "Eating Disorder", culturalMetaphor: "Broken Table", icon: "UtensilsCrossed", description: "Nourishment becomes negotiation" },
  { clinicalTerm: "Bipolar Disorder", culturalMetaphor: "Shifting Tides", icon: "Waves", description: "The ocean swings between storm and calm" },
  { clinicalTerm: "Phobia", culturalMetaphor: "Frozen Path", icon: "Snowflake", description: "The road ahead turns to ice" },
  { clinicalTerm: "ADHD", culturalMetaphor: "Scattered Winds", icon: "Wind", description: "A hundred compasses pointing at once" },
  { clinicalTerm: "Suicidal Ideation", culturalMetaphor: "Edge of the Map", icon: "Map", description: "Standing where the known world ends" },
  { clinicalTerm: "Trauma", culturalMetaphor: "Deep Root", icon: "TreePine", description: "What grew underground, unseen" },
  { clinicalTerm: "Hypervigilance", culturalMetaphor: "Watchfire", icon: "Eye", description: "A guard that never sleeps" },
  { clinicalTerm: "Emotional Numbness", culturalMetaphor: "Still Water", icon: "Droplets", description: "The surface shows nothing beneath" },
  { clinicalTerm: "Codependency", culturalMetaphor: "Tangled Roots", icon: "GitBranch", description: "Two trees that forgot where one begins" },
  { clinicalTerm: "Imposter Syndrome", culturalMetaphor: "Borrowed Crown", icon: "Crown", description: "Wearing the title but not believing it" },
];

// ─────────────────────────────────────────────
// DATASET 2 — The Mentor Roster
// 10+ profiles across 4 tiers with Wisdom Avatars.
// ─────────────────────────────────────────────

export const MENTOR_ROSTER: Mentor[] = [
  // Tier: Professional
  { id: "m-sarah", name: "Guide Sarah", tier: "professional", role: "Clinical Lead", wisdomAvatar: "Shield", bio: "15 years in community mental health. Specialises in culturally adapted CBT.", languages: ["English", "Hindi"], available: true },
  { id: "m-mira", name: "Dr. Mira Patel", tier: "professional", role: "Psychiatrist", wisdomAvatar: "Stethoscope", bio: "Psychiatrist focused on South Asian diaspora wellness and medication management.", languages: ["English", "Gujarati", "Hindi"], available: true },
  { id: "m-omar", name: "Dr. Omar Farah", tier: "professional", role: "Psychologist", wisdomAvatar: "Brain", bio: "Trauma-informed care with a focus on refugee and immigrant communities.", languages: ["English", "Somali", "Arabic"], available: false },

  // Tier: Peer
  { id: "m-sage", name: "Sage Echo", tier: "peer", role: "Peer Facilitator", wisdomAvatar: "User", bio: "Lived experience navigator. Guides others through what she's walked herself.", languages: ["English"], available: true },
  { id: "m-nova", name: "Nova Light", tier: "peer", role: "Peer Supporter", wisdomAvatar: "Star", bio: "Youth advocate who connects through creative expression and journaling.", languages: ["English", "Urdu"], available: true },
  { id: "m-river", name: "River Stone", tier: "peer", role: "Wellness Guide", wisdomAvatar: "Compass", bio: "Nature-based grounding and mindfulness practitioner.", languages: ["English", "Swahili"], available: false },

  // Tier: Interpreter
  { id: "m-aris", name: "Guide Aris", tier: "interpreter", role: "Cultural Interpreter", wisdomAvatar: "Globe", bio: "Bridges clinical advice and cultural context. Fluent in the language of both worlds.", languages: ["English", "Arabic", "French"], available: true },
  { id: "m-priya", name: "Guide Priya", tier: "interpreter", role: "Cultural Interpreter", wisdomAvatar: "BookOpen", bio: "Translates therapeutic frameworks into South Asian family-system language.", languages: ["English", "Tamil", "Hindi"], available: true },

  // Tier: Moderator
  { id: "m-ember", name: "Ember Drift", tier: "moderator", role: "Circle Moderator", wisdomAvatar: "MessageCircle", bio: "Keeps group sessions safe, inclusive, and on-topic.", languages: ["English"], available: true },
  { id: "m-lena", name: "Guide Lena", tier: "moderator", role: "Mindfulness Moderator", wisdomAvatar: "Heart", bio: "Meditation facilitator and silent-circle host.", languages: ["English", "Amharic"], available: true },
  { id: "m-kai", name: "Guide Kai", tier: "moderator", role: "Youth Moderator", wisdomAvatar: "Sparkles", bio: "Specialises in moderation for 16-24 age sessions.", languages: ["English", "Bengali"], available: true },
];

// ─────────────────────────────────────────────
// DATASET 3 — Sacred Circles Schedule
// 7-day recurring schedule of group sessions.
// ─────────────────────────────────────────────

export const CIRCLES_SCHEDULE: CircleScheduleEntry[] = [
  // Monday
  { id: "cs-mon-1", title: "Dawn Meditation: Clearing the Fog", host: "Guide Lena", hostRole: "Mindfulness Moderator", category: "meditation", dayOfWeek: "Monday", time: "6:30 AM", durationMinutes: 30, recurring: true },
  { id: "cs-mon-2", title: "Gentle Flow: Waking the Body", host: "River Stone", hostRole: "Wellness Guide", category: "yoga", dayOfWeek: "Monday", time: "7:30 AM", durationMinutes: 45, recurring: true },

  // Tuesday
  { id: "cs-tue-1", title: "Expert Hour: Understanding the Inner Compass", host: "Dr. Mira Patel", hostRole: "Psychiatrist", category: "expert-talk", dayOfWeek: "Tuesday", time: "10:00 AM", durationMinutes: 60, recurring: true },
  { id: "cs-tue-2", title: "Open Circle: Sharing Without Masks", host: "Ember Drift", hostRole: "Circle Moderator", category: "community", dayOfWeek: "Tuesday", time: "5:30 PM", durationMinutes: 45, recurring: true },

  // Wednesday
  { id: "cs-wed-1", title: "Breathing Through the Storm", host: "Guide Aris", hostRole: "Cultural Interpreter", category: "meditation", dayOfWeek: "Wednesday", time: "8:00 PM", durationMinutes: 30, recurring: true },

  // Thursday
  { id: "cs-thu-1", title: "Power Flow: Strength from Stillness", host: "Guide Sarah", hostRole: "Clinical Lead", category: "yoga", dayOfWeek: "Thursday", time: "6:00 PM", durationMinutes: 50, recurring: true },
  { id: "cs-thu-2", title: "Youth Circle: Real Talk", host: "Guide Kai", hostRole: "Youth Moderator", category: "community", dayOfWeek: "Thursday", time: "7:30 PM", durationMinutes: 40, recurring: true },

  // Friday
  { id: "cs-fri-1", title: "Grounding Walk: Nature as Medicine", host: "River Stone", hostRole: "Wellness Guide", category: "yoga", dayOfWeek: "Friday", time: "7:00 AM", durationMinutes: 45, recurring: true },
  { id: "cs-fri-2", title: "Expert Hour: Navigating Family Dynamics", host: "Guide Priya", hostRole: "Cultural Interpreter", category: "expert-talk", dayOfWeek: "Friday", time: "11:00 AM", durationMinutes: 60, recurring: true },

  // Saturday
  { id: "cs-sat-1", title: "Silent Meditation: Stillness in the Monsoon", host: "Guide Lena", hostRole: "Mindfulness Moderator", category: "meditation", dayOfWeek: "Saturday", time: "6:30 AM", durationMinutes: 30, recurring: true },
  { id: "cs-sat-2", title: "Community Potluck Talk: Heritage & Healing", host: "Ember Drift", hostRole: "Circle Moderator", category: "community", dayOfWeek: "Saturday", time: "4:00 PM", durationMinutes: 60, recurring: true },

  // Sunday
  { id: "cs-sun-1", title: "Restorative Flow: Closing the Week", host: "Guide Sarah", hostRole: "Clinical Lead", category: "yoga", dayOfWeek: "Sunday", time: "9:00 AM", durationMinutes: 50, recurring: true },
  { id: "cs-sun-2", title: "Expert Hour: Trauma & Resilience with Dr. Farah", host: "Dr. Omar Farah", hostRole: "Psychologist", category: "expert-talk", dayOfWeek: "Sunday", time: "2:00 PM", durationMinutes: 60, recurring: true },
];
