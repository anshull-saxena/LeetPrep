'use client'

import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/components/auth-provider'
import confetti from 'canvas-confetti'

const STORAGE_KEY = 'completed-questions-v1'

type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline'

// Confetti celebration effect
const triggerConfetti = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function() {
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

export const useCompletion = () => {
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
      return
    }

    setSyncStatus('syncing')
    const docRef = doc(db, 'users', user.uid)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data()
          const cloudSet = new Set<string>(cloudData.completedQuestions || [])

          // Merge with localStorage on first sync
          const localStored = localStorage.getItem(STORAGE_KEY)
          if (localStored) {
            const localSet = new Set<string>(JSON.parse(localStored))
            const merged = new Set([...cloudSet, ...localSet])
            if (merged.size !== cloudSet.size) {
              // Local has items cloud doesn't — push merged set
              setDoc(docRef, {
                completedQuestions: Array.from(merged),
                updatedAt: new Date().toISOString(),
              }, { merge: true })
            }
            setCompleted(merged)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(merged)))
          } else {
            setCompleted(cloudSet)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(cloudSet)))
          }
        } else {
          // No cloud data yet — push local data
          const localStored = localStorage.getItem(STORAGE_KEY)
          if (localStored) {
            const localSet = new Set<string>(JSON.parse(localStored))
            if (localSet.size > 0) {
              setDoc(docRef, {
                completedQuestions: Array.from(localSet),
                updatedAt: new Date().toISOString(),
              })
            }
          }
        }
        setSyncStatus('synced')
      },
      () => {
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

  return { completed, toggleCompletion, isCompleted, isLoaded, syncStatus }
}
