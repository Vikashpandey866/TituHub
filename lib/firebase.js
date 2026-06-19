import { initializeApp, getApps, getApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { addDoc, collection, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const firebaseReady = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

export function getFirebase() {
  if (!firebaseReady) return null;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app)
  };
}

export async function firebaseSignup({ name, email, phone, password }) {
  const firebase = getFirebase();
  if (!firebase) return null;
  const credential = await createUserWithEmailAndPassword(firebase.auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  await setDoc(doc(firebase.db, "users", credential.user.uid), {
    uid: credential.user.uid,
    name,
    email,
    phone,
    role: "customer",
    emailVerified: credential.user.emailVerified,
    createdAt: serverTimestamp()
  }, { merge: true });
  return credential.user;
}

export async function firebaseLogin({ email, password }) {
  const firebase = getFirebase();
  if (!firebase) return null;
  const credential = await signInWithEmailAndPassword(firebase.auth, email, password);
  return credential.user;
}

export async function firebaseLogout() {
  const firebase = getFirebase();
  if (!firebase) return;
  await signOut(firebase.auth);
}

export async function firebaseResetPassword(email) {
  const firebase = getFirebase();
  if (!firebase) return null;
  await sendPasswordResetEmail(firebase.auth, email);
  return true;
}

export async function saveFirestoreDoc(collectionName, payload) {
  const firebase = getFirebase();
  if (!firebase) return null;
  return addDoc(collection(firebase.db, collectionName), {
    ...payload,
    createdAt: serverTimestamp()
  });
}

export async function saveFirestoreCart(user, items) {
  const firebase = getFirebase();
  if (!firebase || !user) return null;
  const cartId = encodeURIComponent(user.uid || user.email || "guest");
  return setDoc(doc(firebase.db, "carts", cartId), {
    userId: user.uid || "",
    email: user.email || "",
    items,
    updatedAt: serverTimestamp()
  }, { merge: true });
}
