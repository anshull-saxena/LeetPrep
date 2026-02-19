'use client'

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, createElement } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/auth-provider'
import confetti from 'canvas-confetti'

const STORAGE_KEY = 'completed-questions-v1'

type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline'

interface CompletionContextType {
  completed: Set<string>
  toggleCompletion: (questionId: string) => void
  isCompleted: (questionId: string) => boolean
  isLoaded: boolean
  syncStatus: SyncStatus
}

const CompletionContext = createContext<CompletionContextType>({
  completed: new Set(),
  toggleCompletion: () => {},
  isCompleted: () => false,
  isLoaded: false,
  syncStatus: 'local',
})

// Confetti celebration effect
const triggerConfetti = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Fire confetti from different positions
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}

export function CompletionProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local')
  const { user } = useAuth()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCompleted(new Set(JSON.parse(stored)))
      }
    } catch (e) {
      console.error('Failed to load completion status', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Firestore real-time sync when user is logged in
  useEffect(() => {
    if (!user) {
      setSyncStatus('local')
      // Reset to localStorage-only data when user signs out
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        setCompleted(stored ? new Set(JSON.parse(stored)) : new Set())
      } catch {
        setCompleted(new Set())
      }
      return
    }

    setSyncStatus('syncing')
    console.log(`Starting sync for user: ${user.uid}`)
    const docRef = doc(db, 'users', user.uid)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data()
          console.log('Received cloud data:', cloudData)
          const cloudSet = new Set<string>(cloudData.completedQuestions || [])

          // Merge with localStorage on sync
          const localStored = localStorage.getItem(STORAGE_KEY)
          if (localStored) {
            try {
              const localSet = new Set<string>(JSON.parse(localStored))
              const merged = new Set([...cloudSet, ...localSet])

              if (merged.size !== cloudSet.size) {
                console.log(`Merging local (${localSet.size}) and cloud (${cloudSet.size}) data. New size: ${merged.size}`)
                // Local has items cloud doesn't — push merged set
                setDoc(docRef, {
                  completedQuestions: Array.from(merged),
                  updatedAt: new Date().toISOString(),
                }, { merge: true }).then(() => {
                  console.log('Successfully pushed merged data to cloud')
                }).catch(err => {
                  console.error('Failed to push merged data:', err)
                })
              }

              setCompleted(merged)
              localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(merged)))
            } catch (e) {
              console.error('Failed to parse local storage during merge', e)
              setCompleted(cloudSet)
            }
          } else {
            console.log('No local data to merge, using cloud data')
            setCompleted(cloudSet)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(cloudSet)))
          }
        } else {
          // No cloud data yet — push local data
          console.log('No cloud data found for user, checking local data...')
          const localStored = localStorage.getItem(STORAGE_KEY)
          if (localStored) {
            try {
              const localSet = new Set<string>(JSON.parse(localStored))
              if (localSet.size > 0) {
                console.log(`Pushing ${localSet.size} local items to new cloud profile`)
                setDoc(docRef, {
                  completedQuestions: Array.from(localSet),
                  updatedAt: new Date().toISOString(),
                }).then(() => {
                  console.log('Successfully initialized cloud profile with local data')
                }).catch(err => {
                  console.error('Failed to initialize cloud profile:', err)
                })
                setCompleted(localSet)
              }
            } catch (e) {
              console.error('Failed to parse local storage', e)
            }
          }
        }
        setSyncStatus('synced')
      },
      (error) => {
        console.error('Firestore snapshot error:', error)
        setSyncStatus('offline')
      }
    )

    return unsubscribe
  }, [user])

  const toggleCompletion = useCallback((questionId: string) => {
    setCompleted((prev) => {
      const newSet = new Set(prev)
      const wasCompleted = newSet.has(questionId)

      if (wasCompleted) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
        // Trigger confetti when completing a question
        triggerConfetti()
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)))

      // Save to Firestore if logged in
      if (user) {
        setSyncStatus('syncing')
        const docRef = doc(db, 'users', user.uid)
        setDoc(docRef, {
          completedQuestions: Array.from(newSet),
          updatedAt: new Date().toISOString(),
        }, { merge: true }).then(() => {
          setSyncStatus('synced')
        }).catch(() => {
          setSyncStatus('offline')
        })
      }

      return newSet
    })
  }, [user])

  const isCompleted = useCallback((questionId: string) => completed.has(questionId), [completed])

  return createElement(CompletionContext.Provider, {
    value: { completed, toggleCompletion, isCompleted, isLoaded, syncStatus },
  }, children)
}

export const useCompletion = () => useContext(CompletionContext)
