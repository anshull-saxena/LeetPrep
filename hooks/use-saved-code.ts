'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'

const STORAGE_KEY = 'saved-code-v1'

interface SavedCodeEntry {
  language: string
  code: string
}

type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline'

export function useSavedCode() {
  const [savedCodeMap, setSavedCodeMap] = useState<Record<string, SavedCodeEntry>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local')
  const { user } = useAuth()

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedCodeMap(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load saved code', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (!user || !supabase || !isSupabaseConfigured) {
      setSyncStatus('local')
      return
    }

    const syncFromSupabase = async () => {
      setSyncStatus('syncing')

      const { data, error } = await supabase
        .from('user_progress')
        .select('saved_code')
        .eq('user_id', user.uid)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase fetch saved_code error:', error)
        setSyncStatus('offline')
        return
      }

      const cloudCode: Record<string, SavedCodeEntry> = (data?.saved_code as Record<string, SavedCodeEntry>) || {}

      // Merge: local takes precedence (most recent edits)
      const localStored = localStorage.getItem(STORAGE_KEY)
      let localCode: Record<string, SavedCodeEntry> = {}
      if (localStored) {
        try { localCode = JSON.parse(localStored) } catch { }
      }

      const merged = { ...cloudCode, ...localCode }

      // If local has extras, push to cloud
      if (Object.keys(localCode).length > 0) {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.uid,
            saved_code: merged,
          }, { onConflict: 'user_id' })
      }

      setSavedCodeMap(merged)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      setSyncStatus('synced')
    }

    syncFromSupabase()
  }, [user])

  const saveCode = useCallback((questionId: string, language: string, code: string) => {
    setSavedCodeMap(prev => {
      const updated = { ...prev, [questionId]: { language, code } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      if (user && supabase && isSupabaseConfigured) {
        setSyncStatus('syncing')
        supabase
          .from('user_progress')
          .upsert({
            user_id: user.uid,
            saved_code: updated,
          }, { onConflict: 'user_id' })
          .then(({ error }) => {
            if (error) {
              console.error('Supabase save code error:', error)
              setSyncStatus('offline')
            } else {
              setSyncStatus('synced')
            }
          })
      }

      return updated
    })
  }, [user])

  const getSavedCode = useCallback((questionId: string): SavedCodeEntry | null => {
    return savedCodeMap[questionId] ?? null
  }, [savedCodeMap])

  return { saveCode, getSavedCode, isLoaded, syncStatus }
}
