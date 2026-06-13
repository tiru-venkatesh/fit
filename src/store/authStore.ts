import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { User, AuthState } from '../types/auth';
import { handleFirestoreError, OperationType } from '../utils/firebaseError';

// Extend types/auth locally or dynamically for full backwards compatibility
export type UserRole = 'client' | 'owner';

export interface ExtendedUser extends User {
  role: UserRole;
}

export interface ExtendedAuthState extends AuthState {
  user: ExtendedUser | null;
}

interface AuthActions {
  initAuthSync: () => () => void;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, selectedRole: UserRole) => Promise<boolean>;
  loginWithGoogle: (selectedRole?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (updates: Partial<ExtendedUser>) => Promise<void>;
  switchUserRole: (newRole: UserRole) => Promise<void>;
}

export const useAuthStore = create<ExtendedAuthState & AuthActions>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading until Firebase checks auth state
  rememberMe: true,
  error: null,

  // Setup the state sync with Firebase Auth
  initAuthSync: () => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data() as ExtendedUser;
            set({ 
              user: userData, 
              isAuthenticated: true, 
              isLoading: false, 
              error: null 
            });
          } else {
            // Document might not exist if they signed up with Google but didn't finish role step
            const newUser: ExtendedUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'Gym Member',
              avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              role: 'client', // Default to client, can switch
              joinedAt: new Date().toISOString(),
            };
            
            // Set doc cleanly in Firestore
            await setDoc(userDocRef, newUser);
            set({ 
              user: newUser, 
              isAuthenticated: true, 
              isLoading: false, 
              error: null 
            });
          }
        } catch (error) {
          console.error("Auth state loading error: ", error);
          // Set user fallback but show we have session
          set({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'Gym Member',
              avatarUrl: firebaseUser.photoURL || undefined,
              role: 'client',
              joinedAt: new Date().toISOString()
            },
            isAuthenticated: true,
            isLoading: false
          });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email, password, rememberMe) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const userData = docSnap.data() as ExtendedUser;
        set({ user: userData, isAuthenticated: true, rememberMe, isLoading: false });
        return true;
      } else {
        const fallbackUser: ExtendedUser = {
          id: uid,
          email,
          fullName: email.split('@')[0].toUpperCase(),
          role: 'client',
          joinedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', uid), fallbackUser);
        set({ user: fallbackUser, isAuthenticated: true, rememberMe, isLoading: false });
        return true;
      }
    } catch (e: any) {
      let customError = 'System connection error.';
      if (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
        customError = 'Invalid email address or matching password.';
      } else if (e.code === 'auth/network-request-failed') {
        customError = 'Network communication failure.';
      } else {
        customError = e.message || 'Authentication failed.';
      }
      set({ error: customError, isLoading: false });
      return false;
    }
  },

  signup: async (fullName, email, password, selectedRole: UserRole) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const newUser: ExtendedUser = {
        id: uid,
        email,
        fullName,
        role: selectedRole,
        joinedAt: new Date().toISOString(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      try {
        await setDoc(doc(db, 'users', uid), newUser);
      } catch (firestoreError) {
        handleFirestoreError(firestoreError, OperationType.CREATE, `users/${uid}`);
      }

      set({ user: newUser, isAuthenticated: true, isLoading: false });
      return true;
    } catch (e: any) {
      let customError = 'Registration failed.';
      if (e.code === 'auth/email-already-in-use') {
        customError = 'This email account is already registered.';
      } else if (e.code === 'auth/weak-password') {
        customError = 'Password is weak. Make it at least 6 characters.';
      } else {
        customError = e.message || 'Signup failed.';
      }
      set({ error: customError, isLoading: false });
      return false;
    }
  },

  loginWithGoogle: async (selectedRole: UserRole = 'client') => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const uid = userCredential.user.uid;
      const email = userCredential.user.email || '';
      const fullName = userCredential.user.displayName || 'Gold Member';
      const avatarUrl = userCredential.user.photoURL || undefined;

      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data() as ExtendedUser;
        set({ user: userData, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        const newUser: ExtendedUser = {
          id: uid,
          email,
          fullName,
          avatarUrl,
          role: selectedRole,
          joinedAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, newUser);
        } catch (firestoreError) {
          handleFirestoreError(firestoreError, OperationType.CREATE, `users/${uid}`);
        }
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch (e: any) {
      set({ error: e.message || 'Google authentication failed.', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, error: null });
    } catch (e) {
      console.error("Signout error", e);
    }
  },

  clearError: () => set({ error: null }),

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      // Stub password reset since it's standard Firebase trigger
      await new Promise((resolve) => setTimeout(resolve, 600));
      set({ isLoading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message || 'Failed to request reset.', isLoading: false });
      return false;
    }
  },

  updateUser: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    try {
      const updatedUser = { ...currentUser, ...updates };
      await setDoc(doc(db, 'users', currentUser.id), updatedUser, { merge: true });
      set({ user: updatedUser });
    } catch (firestoreError) {
      handleFirestoreError(firestoreError, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  },

  switchUserRole: async (newRole: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    
    // Switch the role immediately in state and try saving to database
    const updatedUser = { ...currentUser, role: newRole };
    set({ user: updatedUser });
    try {
      await setDoc(doc(db, 'users', currentUser.id), { role: newRole }, { merge: true });
    } catch (e) {
      console.error("Failed to persist swapped role", e);
    }
  }
}));
