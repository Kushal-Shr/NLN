import { db } from "@/lib/db";
import { collection, addDoc } from "firebase/firestore";

const testMentors = [
  {
    name: "Priya Sharma",
    tier: 1,
    role: "Software Engineer at Google",
    culturalBg: "south_asian",
    topics: ["burnout", "stress", "career"],
    languages: ["English", "Hindi"],
    availability: true,
    bio: "Navigated family pressure while building a tech career",
  },
  {
    name: "Omar Hassan",
    tier: 3,
    role: "Community Elder & MHFA Certified",
    culturalBg: "mena",
    topics: ["grief", "anxiety", "faith"],
    languages: ["English", "Arabic"],
    availability: true,
    bio: "Bridges mental health and Islamic teachings",
  },
  {
    name: "Meera Patel",
    tier: 2,
    role: "Graduate Student",
    culturalBg: "south_asian",
    topics: ["family pressure", "identity", "school stress"],
    languages: ["English", "Gujarati"],
    availability: true,
    bio: "First gen student who found her way through family expectations",
  },
];

const testStudents = [
  {
    name: "Aryan K",
    culturalBg: "south_asian",
    framingMode: "spiritual",
    language: "en",
    topics: ["stress", "family"],
    isAnonymous: true,
  },
  {
    name: "Lena M",
    culturalBg: "mena",
    framingMode: "religious",
    language: "en",
    topics: ["anxiety", "faith"],
    isAnonymous: true,
  },
];

export async function seedDatabase() {
  // Add mentors
  for (const mentor of testMentors) {
    await addDoc(collection(db, "mentors"), mentor);
    console.log("Added mentor:", mentor.name);
  }

  // Add students
  for (const student of testStudents) {
    await addDoc(collection(db, "students"), student);
    console.log("Added student:", student.name);
  }

  console.log("Seeding done!");
}