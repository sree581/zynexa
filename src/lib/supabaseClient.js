import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables')
}

if (supabaseUrl.includes('your-project-ref') || supabaseAnonKey.includes('your-anon-key')) {
  throw new Error('Supabase .env values are still placeholders. Replace them with your actual Supabase project URL and anon key.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
  },
})
