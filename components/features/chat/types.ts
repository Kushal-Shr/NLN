export type Peer = {
  id: string;
  name: string;
  tier?: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export const SELF_ID = "self";

export const MENTOR: Peer = {
  id: "mentor-aris",
  name: "Guide Aris",
  tier: "Cultural Interpreter",
  lastMessage: "Remember, the compass always recalibrates.",
  timestamp: "2 min ago",
  online: true,
};

export const PEERS: Peer[] = [
  {
    id: "peer-sage",
    name: "Sage Echo",
    lastMessage: "That breathing technique really helped.",
    timestamp: "12 min ago",
    online: true,
  },
  {
    id: "peer-nova",
    name: "Nova Light",
    lastMessage: "I journaled about it — want to share notes?",
    timestamp: "1 hr ago",
    online: false,
  },
  {
    id: "peer-ember",
    name: "Ember Drift",
    lastMessage: "Catch you in the next session.",
    timestamp: "3 hr ago",
    online: false,
  },
  {
    id: "peer-river",
    name: "River Stone",
    lastMessage: "Grounding walk tomorrow morning?",
    timestamp: "Yesterday",
    online: false,
  },
];

export const SEED_MESSAGES: Record<string, Message[]> = {
  "mentor-aris": [
    { id: "m1", senderId: "mentor-aris", content: "Welcome back to the Sanctuary. How are the waters today?", timestamp: "10:02 AM" },
    { id: "m2", senderId: SELF_ID, content: "A little choppy, but I'm steering.", timestamp: "10:03 AM" },
    { id: "m3", senderId: "mentor-aris", content: "That's real navigation. Remember, the compass always recalibrates.", timestamp: "10:04 AM" },
  ],
  "peer-sage": [
    { id: "s1", senderId: "peer-sage", content: "Hey — tried the 4-7-8 breathing from the Hub.", timestamp: "9:45 AM" },
    { id: "s2", senderId: SELF_ID, content: "How'd it go?", timestamp: "9:46 AM" },
    { id: "s3", senderId: "peer-sage", content: "That breathing technique really helped.", timestamp: "9:48 AM" },
  ],
  "peer-nova": [
    { id: "n1", senderId: SELF_ID, content: "I wrote about the 'foggy lens' feeling.", timestamp: "8:30 AM" },
    { id: "n2", senderId: "peer-nova", content: "I journaled about it — want to share notes?", timestamp: "9:00 AM" },
  ],
  "peer-ember": [
    { id: "e1", senderId: "peer-ember", content: "Good session today.", timestamp: "Yesterday" },
    { id: "e2", senderId: SELF_ID, content: "Agreed. Thanks for listening.", timestamp: "Yesterday" },
    { id: "e3", senderId: "peer-ember", content: "Catch you in the next session.", timestamp: "Yesterday" },
  ],
  "peer-river": [
    { id: "r1", senderId: "peer-river", content: "Grounding walk tomorrow morning?", timestamp: "Yesterday" },
  ],
};
