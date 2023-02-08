import { Navbar } from '@/components/navbar';
import React from 'react';
import {
  ProjectHeader,
  ProjectHeaderTitle,
  ProjectContributors,
  ProjectContent,
  Dashspan,
  ProjectContent1,
  LongerDashspan,
} from '@/styles/ProjectStyles';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/footer/Footer';

type Props = {};

const Artsy = (props: Props) => {
  return (
    <div>
      <Head>
        <title>Godswill Francis &trade; | Artsy</title>
        <meta
          name="description"
          content="This page is about the Artsy project by Godswill Francis"
        />
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
      <ProjectHeader>
        <Navbar />
        <ProjectHeaderTitle>
          <div className="projectheader_title">
            <h6>WEB DESIGN</h6>
            <h1>ARTSY</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Project Timeline</h3>
              <p>December 2022-January 2023</p>
            </div>
            <div className="column">
              <h3>Project Type</h3>
              <p>Photography E-commerce</p>
            </div>
            <div className="column">
              <h3>Contributers</h3>
              <ul>
                <li className="contributer">
                  <p className="mb-1 ">Lead Designer</p>

                  <Link
                    href="https://www.behance.net/bammiewh0"
                    className="link"
                    target="_blank"
                    rel="noopener"
                  >
                    @celestinaa0
                  </Link>
                </li>

                <li className="contributer">
                  <p className="mb-1 ">Idea </p>

                  <Link
                    href="https://twitter.com/codingossy"
                    className="link"
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Coding Ossy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="column">
              <h3>My Contribution</h3>
              <ul>
                <li className="mb-2">
                  <p className="">Copywriting</p>
                </li>

                <li className="mb-2">
                  <p className="">Page layout & design</p>
                </li>
              </ul>
            </div>
          </div>
        </ProjectContributors>
        <ProjectContent>
          <div className="project_linkcontainer flex between">
            <div className="project_contentLink">
              <Link
                href="https://artsy-swart.vercel.app/"
                className="link"
                target="_blank"
              >
                <Dashspan></Dashspan>
                <span>CHECK OUT THE WEBSITE</span>
              </Link>

              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.63668 21.2132L17.9887 10.8611L17.9887 20.3646L20.3646 20.3646V6.78819H6.78816L6.78816 9.16407L16.2917 9.16407L5.93963 19.5161L7.63668 21.2132Z"
                  fill="black"
                />
              </svg>
            </div>

            <div className="project_contentLink">
              <Link
                href="https://github.com/willzfrank/ARTSY"
                className="link"
                target="_blank"
              >
                {/* <Dashspan></Dashspan> */}
                <span>CHECK OUT THE SOURCE CODE</span>
              </Link>

              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.63668 21.2132L17.9887 10.8611L17.9887 20.3646L20.3646 20.3646V6.78819H6.78816L6.78816 9.16407L16.2917 9.16407L5.93963 19.5161L7.63668 21.2132Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>

          <ProjectContent1>
            <p>
              Artsy is a personal project that seeks to offer an art-focused
              e-commerce experience, allowing you to discover a variety of art
              and artists. Are you prepared to start shopping?
            </p>
            <p>
              In December 2022,{' '}
              <Link
                href="https://twitter.com/codingossy"
                className="link"
                target="_blank"
                rel="noopener nofollow"
              >
                Coding Ossy
              </Link>{' '}
              assigned a task to build a photography e-commerce website. This
              project offered a great opportunity to gain new skills and
              experiences.{' '}
            </p>
            <p>
              {' '}
              The biggest challenge was incorporating TypeScript into the
              project, as it was the first time using it with Next.js.{' '}
            </p>
            <p>
              In particular, there was difficulty in setting up the routing for
              both the Marketplace page and the Article page.
            </p>

            <div className="project_imgContainer sea">
              <Image
                src="/HOMEPAGE.png"
                alt=""
                width={300}
                height={900}
                className="coverImg"
              />

              <Image
                src="/DROP WEB.png"
                alt=""
                width={300}
                height={900}
                className="coverImg"
              />

              <Image
                src="/LIVE AUCTION WEB.png"
                alt=""
                width={300}
                height={300}
                className="coverImg"
              />
            </div>
          </ProjectContent1>
          <div className="project_homeLink">
            <Link href="/projects" className="link" target="_blank">
              <LongerDashspan></LongerDashspan>
              <span>BACK TO PROJECTS</span>
            </Link>
          </div>
        </ProjectContent>
        <Footer />
      </ProjectHeader>
    </div>
  );
};

export default Artsy;
