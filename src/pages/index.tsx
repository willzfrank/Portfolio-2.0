import Head from 'next/head';
import { Navbar } from '@/components/navbar';
import Header from '@/components/header/Header';
import AboutComponent from '@/components/about/About';

export default function Home() {
  return (
    <>
      <Head>
        <title>Godswill Francis &trade; | Home</title>
        <meta
          name="description"
          content="Personal portfolio of Godswill Francis"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io (2)/favicon-32x32.png"
        />
      </Head>
      <Navbar />
      <Header />
      <AboutComponent />
    </>
  );
}
