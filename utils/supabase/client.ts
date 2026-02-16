import { createBrowserClient } from '@supabase/ssr'

// Export a singleton browser client so subscriptions reuse a single connection
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function createClient() {
  return supabase
}

export default supabase
