import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional Firestore connection test
export async function testConnection() {
  try {
    const testRef = doc(db, 'test', 'connection');
    await getDocFromServer(testRef);
    console.log('✅ Firestore connected successfully');
  } catch (error) {
    console.error('❌ Firestore connection error:', error);

    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error(
        'Please check your Firebase configuration or internet connection.'
      );
    }
  }
}

// Comment this for now while debugging
// testConnection();