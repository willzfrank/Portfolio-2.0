import { Navbar } from '@/components/navbar';
import Image from 'next/image';
import React from 'react';
import {
  AboutContainer,
  Thumbnail,
  AboutHeaderContent,
  ExperienceContainer,
  ExperienceList,
  ExperienceDate,
  SkillsContainer,
  SkillsList,
} from '@/styles/AboutStyles';
import Link from 'next/link';
import Footer from '@/components/footer/Footer';
import Head from 'next/head';

type Props = {};

function about({}: Props) {
  return (
    <div className="w95">
      <Head>
        <title>Godswill Francis &trade; | About</title>
        <meta name="description" content="about page of Godswill Francis" />
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

      <AboutContainer>
        <Thumbnail>
          <div className="image__container">
            <Image
              src="/profile.jpeg"
              alt=""
              width={100}
              height={100}
              className="img"
            />
          </div>
        </Thumbnail>
        <AboutHeaderContent>
          <h6>ABOUT ME</h6>

          <div className="content">
            <p className="large">
              Unleash {`tech's`} beauty with me, Godswill Francis - a frontend
              dev who transforms user experiences into stunning works of art.
              With 3 years of experience merging tech and beauty, {`I've`} honed
              my skills in UI development with a keen eye for detail. Skilled in
              React, Typescript and NextJs, {`I've`} worked with various
              companies in different industries, delivering scalable solutions
              while prioritizing user experience. {`Let's`} create something
              amazing together!
            </p>
          </div>
          <div
            className="content bottom mt-8 animate__fadeIn"
            id="about-secondary"
            data-scroll
            data-scroll-call="animate-in+about-secondary"
          >
            <p className="medium">
              I have had the privilege of working with esteemed organizations
              such as Vsonet Groups, Ullweb Technologies, and Yetti
              Technologies. Currently, I have unlimited availability for
              freelance projects, so if you believe that I can be of assistance
              to your innovative endeavor, please feel free to reach out to me
              via email at{' '}
              <Link
                href="mailto:willzudoh4@gmail.com"
                target="_blank"
                className="link"
              >
                willzudoh4@gmail.com
              </Link>
              .
            </p>
          </div>
        </AboutHeaderContent>
      </AboutContainer>
      <ExperienceContainer>
        <h2>Experience</h2>

        <ExperienceList>
          <li>
            <div>
              <p>Senior Frontend Developer</p>
              <p className="muted">Santoms</p>
            </div>
            <ExperienceDate>
              <p className="mr-2">
                <span className="mobile-hide">December</span> 2022
              </p>

              <svg
                className="arrow arrow-right"
                width="20"
                height="20"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.98887e-06 29.25L39.65 29.25L21.45 47.45L26 52L52 26L26 -2.27299e-06L21.45 4.55L39.65 22.75L2.55712e-06 22.75L1.98887e-06 29.25Z"
                  fill="black"
                />
              </svg>

              <p className="ml-2">Present</p>
            </ExperienceDate>
          </li>

          <li>
            <div>
              <p>React Developer</p>
              <p className="muted">Ullweb Technologies</p>
            </div>
            <ExperienceDate>
              <p className="mr-2">
                <span className="mobile-hide">September</span> 2022
              </p>

              <svg
                className="arrow arrow-right"
                width="20"
                height="20"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.98887e-06 29.25L39.65 29.25L21.45 47.45L26 52L52 26L26 -2.27299e-06L21.45 4.55L39.65 22.75L2.55712e-06 22.75L1.98887e-06 29.25Z"
                  fill="black"
                />
              </svg>

              <p className="ml-2">Present</p>
            </ExperienceDate>
          </li>

          <li>
            <div>
              <p>Frontend Developer</p>
              <p className="muted"> Yetti Technologies</p>
            </div>
            <ExperienceDate>
              <p className="mr-2">
                <span className="mobile-hide">December</span> 2021
              </p>

              <svg
                className="arrow arrow-right"
                width="20"
                height="20"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.98887e-06 29.25L39.65 29.25L21.45 47.45L26 52L52 26L26 -2.27299e-06L21.45 4.55L39.65 22.75L2.55712e-06 22.75L1.98887e-06 29.25Z"
                  fill="black"
                />
              </svg>

              <p className="ml-2">
                <span className="mobile-hide">August</span> 2022
              </p>
            </ExperienceDate>
          </li>

          <li>
            <div>
              <p>Frontend Developer</p>
              <p className="muted">Vsonet Group</p>
            </div>
            <ExperienceDate>
              <p className="mr-2">
                <span className="mobile-hide">January</span> 2020
              </p>

              <svg
                className="arrow arrow-right"
                width="20"
                height="20"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.98887e-06 29.25L39.65 29.25L21.45 47.45L26 52L52 26L26 -2.27299e-06L21.45 4.55L39.65 22.75L2.55712e-06 22.75L1.98887e-06 29.25Z"
                  fill="black"
                />
              </svg>

              <p className="ml-2">
                <span className="mobile-hide">February</span> 2021
              </p>
            </ExperienceDate>
          </li>

          <li>
            <div>
              <p>Frontend Developer Intern</p>
              <p className="muted">Side Hustle</p>
            </div>
            <ExperienceDate>
              <p className="mr-2">
                <span className="mobile-hide">May</span> 2020
              </p>

              <svg
                className="arrow arrow-right"
                width="20"
                height="20"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.98887e-06 29.25L39.65 29.25L21.45 47.45L26 52L52 26L26 -2.27299e-06L21.45 4.55L39.65 22.75L2.55712e-06 22.75L1.98887e-06 29.25Z"
                  fill="black"
                />
              </svg>

              <p className="ml-2">
                <span className="mobile-hide">June</span> 2020
              </p>
            </ExperienceDate>
          </li>
        </ExperienceList>
        <Link
          className="link resume"
          href="../../public/Godswill Udoh FrontendDeveloper.pdf"
          target="_blank"
          download
        >
          <p>Download Resume</p>
        </Link>
      </ExperienceContainer>
      <SkillsContainer className="about_skills_container">
        <h2>Skills</h2>
        <div className="skills">
          <span>Javascript</span>
          <span>ReactJS</span>
          <span>NextJS</span>
          <span>TypeScript</span>
          <span>Material UI</span>
          <span>Tailwind CSS</span>
          <span>Git</span>
          <span>Styled-Components</span>
          <span>HTML5</span>
          <span>SASS</span>
          <span>SCSS</span>
          <span>CSS3</span>
          <span>Responsive Design</span>
          <span>Performance Optimization</span>
          <span>Agile Development</span>
          <span>REST</span>
          <span>GRAPH QL</span>
        </div>
      </SkillsContainer>
      <Footer />
    </div>
  );
}

export default about;
