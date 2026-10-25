import Pointer from '@/components/pointer/pointer';
import SmoothScroll from '@/components/scroll/SmoothScroll';
import PresenceToast from '@/components/presence/PresenceToast';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Pointer />}
      {!isAdmin && <PresenceToast />}
      {!isAdmin && <SmoothScroll />}
      <Component {...pageProps} />
    </>
  );
};

export default App;
