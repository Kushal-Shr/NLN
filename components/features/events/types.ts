export type EventCategory =
  | "mindfulness"
  | "expert-wisdom"
  | "physical-flow"
  | "community-talk";

export type CircleEvent = {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  category: EventCategory;
  coverUrl: string;
  date: string;
  time: string;
  isLive: boolean;
  attendees: number;
};

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; color: string }
> = {
  mindfulness: { label: "Mindfulness", color: "text-violet-400" },
  "expert-wisdom": { label: "Expert Wisdom", color: "text-amber-400" },
  "physical-flow": { label: "Physical Flow", color: "text-emerald-400" },
  "community-talk": { label: "Community Talk", color: "text-sky-400" },
};

export const SEED_EVENTS: CircleEvent[] = [
  {
    id: "evt-1",
    title: "Restoring the Inner Balance: Morning Flow",
    host: "Guide Sarah",
    hostRole: "Clinical Lead",
    category: "physical-flow",
    coverUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=340&fit=crop&q=80",
    date: "Today",
    time: "6:00 PM",
    isLive: true,
    attendees: 14,
  },
  {
    id: "evt-2",
    title: "Breathing Through the Storm: 4-7-8 Practice",
    host: "Guide Aris",
    hostRole: "Cultural Interpreter",
    category: "mindfulness",
    coverUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&h=340&fit=crop&q=80",
    date: "Today",
    time: "8:00 PM",
    isLive: false,
    attendees: 8,
  },
  {
    id: "evt-3",
    title: "Understanding the Inner Compass: Q&A with Dr. Mira",
    host: "Dr. Mira Patel",
    hostRole: "Psychiatrist",
    category: "expert-wisdom",
    coverUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=340&fit=crop&q=80",
    date: "Tomorrow",
    time: "10:00 AM",
    isLive: false,
    attendees: 23,
  },
  {
    id: "evt-4",
    title: "Open Circle: Sharing Strength Without Masks",
    host: "Sage Echo",
    hostRole: "Peer Facilitator",
    category: "community-talk",
    coverUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop&q=80",
    date: "Tomorrow",
    time: "5:30 PM",
    isLive: false,
    attendees: 11,
  },
  {
    id: "evt-5",
    title: "Grounding Walk: Nature as Medicine",
    host: "River Stone",
    hostRole: "Wellness Guide",
    category: "physical-flow",
    coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=340&fit=crop&q=80",
    date: "Fri, Apr 4",
    time: "7:00 AM",
    isLive: false,
    attendees: 6,
  },
  {
    id: "evt-6",
    title: "Silent Meditation: Stillness in the Monsoon",
    host: "Guide Lena",
    hostRole: "Mindfulness Coach",
    category: "mindfulness",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop&q=80",
    date: "Sat, Apr 5",
    time: "6:30 AM",
    isLive: false,
    attendees: 19,
  },
];
