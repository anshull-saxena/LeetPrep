'use client'

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'

const STORAGE_KEY = 'completed-questions-v1'

type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline'

interface CompletionContextType {
  toggleCompletion: (questionId: string) => void
  isCompleted: (questionId: string) => boolean
  isLoaded: boolean
  syncStatus: SyncStatus
  resetProgress: () => void
}

const CompletionContext = createContext<CompletionContextType>({
  toggleCompletion: () => {},
  isCompleted: () => false,
  isLoaded: false,
  syncStatus: 'local',
  resetProgress: () => {},
})

// Confetti celebration effect
const triggerConfetti = async () => {
  if (typeof window === 'undefined') return
  
  const confetti = (await import('canvas-confetti')).default
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

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setSyncStatus('local')
      return
    }

    const syncFromSupabase = async () => {
      setSyncStatus('syncing')
      
      if (!supabase || !isSupabaseConfigured) {
        setSyncStatus('local')
        return
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_questions')
        .eq('user_id', user.uid)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase fetch error:', error)
        setSyncStatus('offline')
        return
      }

        const cloudQuestions = (data?.completed_questions || []) as string[]
        const cloudSet = new Set(cloudQuestions)

      // Get local data
      const localStored = localStorage.getItem(STORAGE_KEY)
      let localSet = new Set<string>()
      if (localStored) {
        try {
          localSet = new Set(JSON.parse(localStored))
        } catch (e) {
          console.error('Failed to parse local storage', e)
        }
      }

      // Merge local and cloud
      const merged = new Set<string>([...cloudSet, ...localSet])
      
      // If local has extras, push to cloud
      if (localSet.size > cloudSet.size) {
        await supabase
          .from('user_progress')
          .upsert({ 
            user_id: user.uid, 
            completed_questions: Array.from(merged) 
          }, { onConflict: 'user_id' })
      }

      setCompleted(merged)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(merged)))
      setSyncStatus('synced')
    }

    syncFromSupabase()
  }, [user])

  const saveToSupabase = async (questions: string[]) => {
    if (!user || !supabase || !isSupabaseConfigured) {
      setSyncStatus('local')
      return
    }
    
    setSyncStatus('syncing')
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: user.uid, 
        completed_questions: questions 
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Supabase save error:', error)
      setSyncStatus('offline')
    } else {
      setSyncStatus('synced')
    }
  }

  const toggleCompletion = useCallback((questionId: string) => {
    setCompleted((prev) => {
      const newSet = new Set(prev)
      const wasCompleted = newSet.has(questionId)

      if (wasCompleted) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
        triggerConfetti()
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)))

      // Save to Supabase if logged in
      if (user) {
        saveToSupabase(Array.from(newSet))
      }

      return newSet
    })
  }, [user])

  const resetProgress = useCallback(async () => {
    setCompleted(new Set())
    localStorage.removeItem(STORAGE_KEY)

    if (user && supabase && isSupabaseConfigured) {
      setSyncStatus('syncing')
      const { error } = await supabase
        .from('user_progress')
        .upsert({ 
          user_id: user.uid, 
          completed_questions: [] 
        }, { onConflict: 'user_id' })

      if (error) {
        console.error('Supabase reset error:', error)
        setSyncStatus('offline')
      } else {
        setSyncStatus('synced')
      }
    }
  }, [user])

  const isCompleted = useCallback((questionId: string) => completed.has(questionId), [completed])

  return (
    <CompletionContext.Provider value={{ toggleCompletion, isCompleted, isLoaded, syncStatus, resetProgress }}>
      {children}
    </CompletionContext.Provider>
  )
}

export const useCompletion = () => useContext(CompletionContext)