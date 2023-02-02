import Pointer from '@/components/pointer/pointer';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Pointer />
      <Component {...pageProps} />
    </>
  );
};

export default App;
