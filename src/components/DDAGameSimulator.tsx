import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch,
} from './firebase';
import { User, GameProgressState, JourneyEntry, PersonalDevelopmentGoal } from '../types';

export const USER_COLLECTION = 'users';

/**
 * Load user profile from Firestore, fallback to null if not found
 */
export async function fetchUserProfileFromFirestore(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, USER_COLLECTION, userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as User;
    }
    return null;
  } catch (error) {
    console.warn('Firestore: Could not fetch user profile (offline/rules):', error);
    return null;
  }
}

/**
 * Save user profile to Firestore
 */
export async function saveUserProfileToFirestore(user: User): Promise<boolean> {
  try {
    const userRef = doc(db, USER_COLLECTION, user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore: Could not save user profile:', error);
    return false;
  }
}

/**
 * Fetch game progress & DDA state from Firestore
 */
export async function fetchGameProgressFromFirestore(
  userId: string
): Promise<GameProgressState | null> {
  try {
    const progressRef = doc(db, USER_COLLECTION, userId, 'game_progress', 'current');
    const snapshot = await getDoc(progressRef);
    if (snapshot.exists()) {
      return snapshot.data() as GameProgressState;
    }
    return null;
  } catch (error) {
    console.warn('Firestore: Could not fetch game progress:', error);
    return null;
  }
}

/**
 * Save game progress & DDA state to Firestore
 */
export async function saveGameProgressToFirestore(
  progress: GameProgressState
): Promise<boolean> {
  try {
    const progressRef = doc(db, USER_COLLECTION, progress.userId, 'game_progress', 'current');
    await setDoc(
      progressRef,
      {
        ...progress,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore: Could not save game progress:', error);
    return false;
  }
}

/**
 * Fetch persistent journey entries for a user
 */
export async function fetchJourneyEntriesFromFirestore(
  userId: string
): Promise<JourneyEntry[]> {
  try {
    const entriesCol = collection(db, USER_COLLECTION, userId, 'journey_entries');
    const entriesQuery = query(entriesCol, orderBy('updatedAt', 'desc'), limit(50));
    const snapshot = await getDocs(entriesQuery);
    const entries: JourneyEntry[] = [];
    snapshot.forEach((d) => {
      entries.push(d.data() as JourneyEntry);
    });
    return entries;
  } catch (error) {
    console.warn('Firestore: Could not fetch journey entries:', error);
    return [];
  }
}

/**
 * Save a single journey entry to Firestore
 */
export async function saveJourneyEntryToFirestore(
  userId: string,
  entry: JourneyEntry
): Promise<boolean> {
  try {
    const entryRef = doc(db, USER_COLLECTION, userId, 'journey_entries', entry.id);
    await setDoc(
      entryRef,
      {
        ...entry,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore: Could not save journey entry:', error);
    return false;
  }
}

/**
 * Fetch personal development goals from Firestore
 */
export async function fetchPersonalGoalsFromFirestore(
  userId: string
): Promise<PersonalDevelopmentGoal[]> {
  try {
    const goalsCol = collection(db, USER_COLLECTION, userId, 'development_goals');
    const goalsQuery = query(goalsCol, orderBy('updatedAt', 'desc'), limit(50));
    const snapshot = await getDocs(goalsQuery);
    const goals: PersonalDevelopmentGoal[] = [];
    snapshot.forEach((d) => {
      goals.push(d.data() as PersonalDevelopmentGoal);
    });
    return goals;
  } catch (error) {
    console.warn('Firestore: Could not fetch personal development goals:', error);
    return [];
  }
}

/**
 * Save a personal development goal to Firestore
 */
export async function savePersonalGoalToFirestore(
  goal: PersonalDevelopmentGoal
): Promise<boolean> {
  try {
    const goalRef = doc(db, USER_COLLECTION, goal.userId, 'development_goals', goal.id);
    await setDoc(
      goalRef,
      {
        ...goal,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore: Could not save personal development goal:', error);
    return false;
  }
}

/**
 * Delete a personal development goal from Firestore
 */
export async function deletePersonalGoalFromFirestore(
  userId: string,
  goalId: string
): Promise<boolean> {
  try {
    const goalRef = doc(db, USER_COLLECTION, userId, 'development_goals', goalId);
    await deleteDoc(goalRef);
    return true;
  } catch (error) {
    console.warn('Firestore: Could not delete personal development goal:', error);
    return false;
  }
}

/**
 * Clear all user documents, subcollections, journey entries, goals, game progress,
 * and data from Firestore to ensure a completely fresh and clean environment.
 */
export async function clearAllFirestoreData(userId?: string): Promise<boolean> {
  try {
    const targetUserIds = userId
      ? [userId]
      : ['maya', 'marcus', 'elena', 'saugat', 'aris', 'user-saugat-singh'];

    for (const uid of targetUserIds) {
      try {
        const entriesRef = collection(db, USER_COLLECTION, uid, 'journey_entries');
        const entriesSnap = await getDocs(entriesRef);
        if (!entriesSnap.empty) {
          const batch = writeBatch(db);
          entriesSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
          await batch.commit();
        }
      } catch (e) {
        console.warn(`Firestore: Could not clear journey entries for ${uid}:`, e);
      }

      try {
        const goalsRef = collection(db, USER_COLLECTION, uid, 'development_goals');
        const goalsSnap = await getDocs(goalsRef);
        if (!goalsSnap.empty) {
          const batch = writeBatch(db);
          goalsSnap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
          await batch.commit();
        }
      } catch (e) {
        console.warn(`Firestore: Could not clear goals for ${uid}:`, e);
      }

      try {
        const progRef = doc(db, USER_COLLECTION, uid, 'game_progress', 'current');
        await deleteDoc(progRef);
      } catch (e) {
        console.warn(`Firestore: Could not clear game progress for ${uid}:`, e);
      }
    }
    return true;
  } catch (error) {
    console.warn('Firestore: Could not clear database records:', error);
    return false;
  }
}
