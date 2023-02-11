import Footer from '@/components/footer/Footer';
import { Navbar } from '@/components/navbar';
import Head from 'next/head';
import React from 'react';
import { ContactContainer, ContactSocials } from '@/styles/ContactStyles';
import Link from 'next/link';

type Props = {};

const contact = (props: Props) => {
  return (
    <>
      <Head>
        <title>Godswill Francis &trade; | Contact</title>
        <meta name="description" content="Contact page of Godswill Francis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      <ContactContainer>
        <div className="contact_container2">
          <div className="contact_title">
            <h6>A PROJECT?</h6>
          </div>
          <div className="contact_content">
            <h2>
              CONTACT <span> - COLLABORATION REQUEST</span>
            </h2>
            <h5>
              Are you looking for a freelance frontend developer? Do you have a
              project, an idea to realize? Do not hesitate to send me an email
              to discuss it, I am at your disposal!
            </h5>

            <button>
              <Link
                href="mailto:willzudoh4@gmail.com"
                target="_blank"
                className="link"
              >
                SEND AN EMAIL
              </Link>
            </button>
          </div>
        </div>

        <ContactSocials>
          <li>
            <Link
              href="https://github.com/willzfrank"
              className="link"
              target="_blank"
            >
              <i className="uil uil-github"></i>
            </Link>
          </li>
          <li>
            <Link
              href="https://twitter.com/willzfrank001"
              className="link"
              target="_blank"
            >
              <i className="uil uil-twitter"></i>
            </Link>
          </li>
          <li>
            <Link
              href="https://www.linkedin.com/in/godswill-udoh/"
              target="_blank"
              className="link"
            >
              <i className="uil uil-linkedin"></i>
            </Link>
          </li>
        </ContactSocials>
      </ContactContainer>
      <Footer />
    </>
  );
};

export default contact;
