export type PeerStatus = "online" | "away" | "offline";

export type Peer = {
  id: string;
  name: string;
  tier?: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  status: PeerStatus;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export const SELF_ID = "self";

export const MENTOR: Peer = {
  id: "mentor-shreyas",
  name: "Shreyas K. Shrestha",
  tier: "Mentor",
  lastMessage: "Namaste — how are you feeling today?",
  timestamp: "Just now",
  online: true,
  status: "online",
};

export const PEERS: Peer[] = [
  {
    id: "peer-shrijan",
    name: "Shrijan Paudel",
    lastMessage: "Let me know if you need anything from my side.",
    timestamp: "5 min ago",
    online: true,
    status: "online",
  },
  {
    id: "peer-sashwot",
    name: "Sashwot Amatya",
    lastMessage: "I'll review the notes and get back to you.",
    timestamp: "30 min ago",
    online: false,
    status: "away",
  },
];

export const SEED_MESSAGES: Record<string, Message[]> = {
  "mentor-shreyas": [
    { id: "ms1", senderId: "mentor-shreyas", content: "Namaste, I am here to help you navigate your journey. How are you feeling today?", timestamp: "10:00 AM" },
    { id: "ms2", senderId: SELF_ID, content: "I've been feeling a bit overwhelmed with everything lately.", timestamp: "10:02 AM" },
    { id: "ms3", senderId: "mentor-shreyas", content: "That's completely natural. Sometimes the weight we carry is heavier than what others can see. Let's talk through it — one step at a time.", timestamp: "10:03 AM" },
  ],
  "peer-shrijan": [
    { id: "sj1", senderId: "peer-shrijan", content: "Hey! I just pushed the latest changes to the Sanctuary repo. Let me know if you need anything from my side.", timestamp: "9:50 AM" },
    { id: "sj2", senderId: SELF_ID, content: "Thanks Shrijan — I'll pull and review it.", timestamp: "9:52 AM" },
    { id: "sj3", senderId: "peer-shrijan", content: "Sounds good. The backend API for the mentor matcher is live now too.", timestamp: "9:53 AM" },
  ],
  "peer-sashwot": [
    { id: "sa1", senderId: SELF_ID, content: "Sashwot, can you take a look at the event cards layout?", timestamp: "9:15 AM" },
    { id: "sa2", senderId: "peer-sashwot", content: "Sure — I'll review the notes and get back to you. Give me about an hour.", timestamp: "9:20 AM" },
  ],
};
