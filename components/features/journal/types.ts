export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  energy: number;
  autoNuke: boolean;
  createdAt: string;
};

export const SEED_ENTRIES: JournalEntry[] = [
  {
    id: "entry-1",
    title: "Morning by the river",
    body: "Watched the water carry leaves downstream. It felt like the current was taking some of the weight off my chest. I breathed with it for a while.",
    energy: 65,
    autoNuke: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "entry-2",
    title: "Tea with Grandmother's recipe",
    body: "Made chai the way she taught me — cardamom first, then the leaves. The smell filled the room and for a second I was in her kitchen again.",
    energy: 80,
    autoNuke: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "entry-3",
    title: "Restless evening",
    body: "Couldn't sit still. Walked around the block three times. The third lap was slower. Maybe that counts as progress.",
    energy: 35,
    autoNuke: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];
