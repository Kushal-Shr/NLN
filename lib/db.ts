import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDx6Yj0jpKRt2lWp0ISJa-LuBEp3pNfYGc",
  authDomain: "nln-fe241.firebaseapp.com",
  projectId: "nln-fe241",
  storageBucket: "nln-fe241.firebasestorage.app",
  messagingSenderId: "821172162136",
  appId: "1:821172162136:web:0b34138547eddd6f98842d"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export async function loginAnonymously() {
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function saveUserProfile(uid: string, profile: {
  comfort: string;
  language: string;
  background: string;
}) {
  await setDoc(doc(db, "users", uid), {
    ...profile,
    createdAt: serverTimestamp(),
  });
}

export async function createPost(content: string, uid: string) {
  await addDoc(collection(db, "posts"), {
    content,
    uid,
    createdAt: serverTimestamp(),
  });
}

export async function getPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function clearSession() {
  await auth.signOut();
  sessionStorage.clear();
}

export { auth, db };
