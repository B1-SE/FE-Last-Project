import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '../../types/types';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let persistenceInitialized: Promise<void> | null = null;
