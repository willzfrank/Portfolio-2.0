import Cursor from '@/components/cursor/Cursor';
import RouteProgress from '@/components/scroll/RouteProgress';
import SmoothScroll from '@/components/scroll/SmoothScroll';
import PresenceToast from '@/components/presence/PresenceToast';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Cursor />}
      {!isAdmin && <PresenceToast />}
      {!isAdmin && <AnalyticsTracker />}
      <RouteProgress />
      {!isAdmin && <SmoothScroll />}
      {!isAdmin && <div className="grain" aria-hidden />}
      <Component {...pageProps} />
    </>
  );
};

export default App;
