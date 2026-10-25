import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

let serverClient: SupabaseClient | null = null

/** Service-role client. Server-side only (API routes, getStaticProps). */
export const getServerClient = (): SupabaseClient => {
  if (!serverClient) {
    serverClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    )
  }
  return serverClient
}
