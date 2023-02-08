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
        <title>Godswill Francis &trade; | Portfolio 1.0</title>
        <meta
          name="description"
          content="This page is about the Portfolio 1.0 project by Godswill Francis"
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
            <h6>PORTFOLIO PAGE</h6>
            <h1>PORTFOLIO 1.0</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Project Timeline</h3>
              <p>January 2022-Febuary 2022</p>
            </div>
            <div className="column">
              <h3>Project Type</h3>
              <p>Portfolio Page</p>
            </div>
            <div className="column">
              <h3>Contributers</h3>
              <ul>
                <li className="contributer">
                  <p className="mb-1 ">Backend Developer </p>

                  <Link
                    href="https://github.com/Emmagist"
                    className="link"
                    target="_blank"
                    rel="noopener nofollow"
                  >
                    Ogundipe Olusegun
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
                href="https://willzfrank.netlify.app/"
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
                href="https://github.com/willzfrank/Portfolio-1.0"
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
              Ready to see the OG of portfolios? Introducing Portfolio 1.0! This
              baby was my debut portfolio in the world of digital
              self-promotion. Built with a touch of vanilla JS and a dash of PHP
              magic, it was the perfect showcase for my mad skills. Get ready
              for some portfolio greatness!
            </p>
            <p>
              January 2022 was a game-changer! {`That's`} when I had the
              brilliant idea to create Portfolio 1.0, the ultimate platform that
              speaks volumes about my skills and talents. This bad boy was
              designed with the latest and greatest of that era, so get ready to
              be wowed!
            </p>
            <p>
              {' '}
              My greatest challenge was when I was faced with the daunting task
              of adding a backend to Portfolio 1.0, I knew I needed backup.{' '}
              {`That's`} when the amazing Backend developer{' '}
              <Link
                href="https://github.com/Emmagist"
                className="link"
                target="_blank"
                rel="noopener nofollow"
              >
                Ogundipe Olusegun
              </Link>{' '}
              swooshed in and worked his PHP magic to make the web application a
              true work of art! Together, we were unstoppable.
            </p>

            <div className="project_imgContainer">
              <Image
                src="/Willz Frank.png"
                alt=""
                width={700}
                height={400}
                className="coverImg"
              />

              <Image
                src="/Willz Frank (2).png"
                alt=""
                width={500}
                height={700}
                className="coverImg"
              />

              <Image
                src="/Willz Frank (1).png"
                alt=""
                width={600}
                height={700}
                className="coverImg"
              />

              <Image
                src="/Willz Frankblack.png"
                alt=""
                width={600}
                height={700}
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
