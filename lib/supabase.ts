import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hasCredentials = supabaseUrl && supabaseAnonKey

export const supabase = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { fetch: (...args) => fetch(...args) },
    })
  : null

export const isSupabaseConfigured = hasCredentials
