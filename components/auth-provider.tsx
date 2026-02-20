'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  AuthError,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => { },
  signOut: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Check for redirect result on mount
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Successfully signed in via redirect')
        }
      })
      .catch((error: AuthError) => {
        console.error('Redirect sign-in failed:', error)
        handleAuthError(error)
      })
  }, [])

  const handleAuthError = (error: AuthError) => {
    let errorMessage = 'Failed to sign in with Google. Please try again.'

    switch (error.code) {
      case 'auth/popup-blocked':
        errorMessage = 'Pop-up was blocked. Please allow pop-ups and try again.'
        break
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign-in was cancelled.'
        break
      case 'auth/cancelled-popup-request':
        errorMessage = 'Only one sign-in request at a time.'
        break
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for OAuth operations. Please contact support.'
        break
      case 'auth/operation-not-allowed':
        errorMessage = 'Google sign-in is not enabled. Please contact support.'
        break
      case 'auth/invalid-api-key':
      case 'auth/app-deleted':
      case 'auth/invalid-user-token':
        errorMessage = 'Configuration error. Please contact support.'
        break
      default:
        errorMessage = `Sign-in failed: ${error.message}`
    }

    setError(errorMessage)
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      // Configure the provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      })

      // Try popup first
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (popupError: unknown) {
        const authError = popupError as AuthError
        // If popup fails, try redirect as fallback
        if (authError.code === 'auth/popup-blocked' ||
          authError.code === 'auth/popup-closed-by-user') {
          console.log('Popup failed, trying redirect...')
          await signInWithRedirect(auth, googleProvider)
        } else {
          throw popupError
        }
      }
    } catch (error: unknown) {
      const authError = error as AuthError
      console.error('Google sign-in failed:', authError)
      handleAuthError(authError)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
      // Hard refresh to clear all in-memory state cleanly
      window.location.reload()
    } catch (error: unknown) {
      const authError = error as AuthError
      console.error('Sign out failed:', authError)
      setError('Failed to sign out. Please try again.')
      setTimeout(() => setError(null), 5000)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
