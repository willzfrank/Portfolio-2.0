import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { analyticsAllowed, createTracker } from '@/lib/analytics'

const cleanPath = (url: string) => url.split(/[?#]/)[0] || '/'

/** Mounts the anonymous analytics tracker and reports every page view. */
const AnalyticsTracker = () => {
  const router = useRouter()

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !analyticsAllowed()) return
    const tracker = createTracker()
    const visit = (url: string) => {
      tracker.pageView(cleanPath(url))
      if (router.pathname === '/404') tracker.event('not_found', { path: cleanPath(url) })
    }
    visit(router.asPath)
    const onRoute = (url: string) => visit(url)
    router.events.on('routeChangeComplete', onRoute)
    return () => {
      router.events.off('routeChangeComplete', onRoute)
      tracker.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default AnalyticsTracker
