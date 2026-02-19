import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyChaHfN5yYL_Cd8eOdmS7hzq1_Z0_t7myc",
  authDomain: "leetprep12.firebaseapp.com",
  projectId: "leetprep12",
  storageBucket: "leetprep12.firebasestorage.app",
  messagingSenderId: "619128919978",
  appId: "1:619128919978:web:aed7320367debbe7123dd3",
  measurementId: "G-E8GD5EJY5S",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
