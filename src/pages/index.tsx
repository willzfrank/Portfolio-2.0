import Head from 'next/head';
import React from 'react';
import { Navbar } from '@/components/navbar';
import Header from '@/components/header/Header';
import AboutComponent from '@/components/about/About';
import Works from '@/components/works/Works';
import Footer from '@/components/footer/Footer';
import Marquee from '@/components/marquee/Marquee';
import Preloader from '@/components/preloader/Preloader';

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Head>
            <title>Godswill Francis &trade; | Home</title>
            <meta
              name="description"
              content="Personal portfolio of Godswill Francis"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="stylesheet"
              href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
            ></link>
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon_io (2)/favicon-32x32.png"
            />
          </Head>
          <Navbar />
          <div className="w95">
            <div className="overflow_hidden">
              <Header />
              <AboutComponent />
              <Works />
              <Marquee />
              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  );
}
