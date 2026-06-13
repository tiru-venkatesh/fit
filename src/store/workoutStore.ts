import { create } from 'zustand';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { CompleteWorkoutSession, WorkoutStreak, MuscleGroup } from '../types/workout';
import { handleFirestoreError, OperationType } from '../utils/firebaseError';

export interface Announcement {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  date: string;
  urgency: 'normal' | 'important' | 'urgent';
}

interface WorkoutActions {
  addSession: (session: Omit<CompleteWorkoutSession, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  incrementStreak: () => void;
  resetWorkoutHistory: () => Promise<void>;
  
  // Real-time Auth Sync
  initWorkoutsSync: (userId: string, isOwner: boolean) => () => void;
  
  // Gym Owner / Admin specific integrations
  assignWorkoutToClient: (clientUid: string, session: Omit<CompleteWorkoutSession, 'id'>) => Promise<void>;
  postAnnouncement: (announcement: Omit<Announcement, 'id' | 'ownerId' | 'date'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

const DEFAULT_STREAK: WorkoutStreak = {
  currentStreak: 4,
  longestStreak: 9,
  lastWorkoutDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

export const useWorkoutStore = create<{
  sessions: CompleteWorkoutSession[];
  announcements: Announcement[];
  streak: WorkoutStreak;
  allClientsWorkouts: CompleteWorkoutSession[]; // admin cached copy
} & WorkoutActions>()((set, get) => ({
  sessions: [],
  announcements: [],
  streak: DEFAULT_STREAK,
  allClientsWorkouts: [],

  initWorkoutsSync: (userId, isOwner) => {
    // 1. Subscription to workouts for standard client
    const workoutsRef = collection(db, 'workouts');
    
    // If Owner, subscribe to ALL workouts to monitor activity. 
    // If Client, subscribe only to their own workouts.
    const workoutsQuery = isOwner 
      ? query(workoutsRef, orderBy('date', 'desc'))
      : query(workoutsRef, where('userId', '==', userId));
      
    const unsubWorkouts = onSnapshot(workoutsQuery, (snapshot) => {
      const items: CompleteWorkoutSession[] = [];
      snapshot.forEach((snapshotDoc) => {
        items.push({ id: snapshotDoc.id, ...snapshotDoc.data() } as CompleteWorkoutSession);
      });
      
      if (isOwner) {
        set({ allClientsWorkouts: items });
      } else {
        set({ sessions: items });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'workouts');
    });

    // 2. Subscription to Announcements (Both roles subscribe to bulletins)
    const announcementsRef = collection(db, 'announcements');
    const announcementsQuery = query(announcementsRef, orderBy('date', 'desc'));
    
    const unsubAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
      const bulletins: Announcement[] = [];
      snapshot.forEach((bulletinDoc) => {
        bulletins.push({ id: bulletinDoc.id, ...bulletinDoc.data() } as Announcement);
      });
      set({ announcements: bulletins });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'announcements');
    });

    // Return clean composite unsubscribers
    return () => {
      unsubWorkouts();
      unsubAnnouncements();
    };
  },

  addSession: async (sessionData) => {
    const customId = 'wj-' + Math.random().toString(36).substr(2, 9);
    const resolvedSession: CompleteWorkoutSession = {
      ...sessionData,
      id: customId,
    };

    try {
      await setDoc(doc(db, 'workouts', customId), resolvedSession);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `workouts/${customId}`);
    }

    // Keep streak updated locally in store State
    const todayStr = new Date().toISOString().split('T')[0];
    let currentStreak = get().streak.currentStreak;
    let longestStreak = get().streak.longestStreak;
    const lastWorkout = get().streak.lastWorkoutDate;

    if (lastWorkout !== todayStr) {
      if (lastWorkout === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    }

    set({
      streak: {
        currentStreak,
        longestStreak,
        lastWorkoutDate: todayStr,
      }
    });
  },

  deleteSession: async (id) => {
    try {
      await deleteDoc(doc(db, 'workouts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `workouts/${id}`);
    }
  },

  incrementStreak: () => {
    set((state) => ({
      streak: {
        ...state.streak,
        currentStreak: state.streak.currentStreak + 1,
        longestStreak: Math.max(state.streak.longestStreak, state.streak.currentStreak + 1),
      },
    }));
  },

  resetWorkoutHistory: async () => {
    const currentSessions = get().sessions;
    for (const s of currentSessions) {
      try {
        await deleteDoc(doc(db, 'workouts', s.id));
      } catch (e) {
        console.error("Cleanout error", e);
      }
    }
    set({
      sessions: [],
      streak: { currentStreak: 0, longestStreak: 0, lastWorkoutDate: null }
    });
  },

  // Owner Capability: Assign workout routines directly to specific clients
  assignWorkoutToClient: async (clientUid, session) => {
    const customId = 'wj-assign-' + Math.random().toString(36).substr(2, 9);
    const resolvedSession: CompleteWorkoutSession = {
      ...session,
      id: customId,
      userId: clientUid,
      creatorId: auth.currentUser?.uid || 'gym_owner_admin',
      isAssignedByOwner: true,
    };

    try {
      await setDoc(doc(db, 'workouts', customId), resolvedSession);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `workouts/${customId}`);
    }
  },

  // Owner Capability: Post general community/gym announcements
  postAnnouncement: async (announcementData) => {
    const customId = 'ann-' + Math.random().toString(36).substr(2, 9);
    const payload: Announcement = {
      ...announcementData,
      id: customId,
      ownerId: auth.currentUser?.uid || 'gym_owner',
      date: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'announcements', customId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `announcements/${customId}`);
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  }
}));
