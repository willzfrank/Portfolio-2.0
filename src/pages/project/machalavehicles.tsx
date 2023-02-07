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
            <h1>MACHALA VEHICLES</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Project Timeline</h3>
              <p>August 2022-September 2022</p>
            </div>
            <div className="column">
              <h3>Project Type</h3>
              <p>Automobile Web design</p>
            </div>
            <div className="column">
              <h3>Contributers</h3>
              <ul>
                <li className="contributer">
                  <p className="mb-1 ">Lead Designer</p>
                  @willzfrank
                </li>

                <li className="contributer">
                  <p className="mb-1 ">Idea </p>
                  NIIT
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
          <div className="project_contentLink">
            <Link
              href="https://lexusniitdemo.vercel.app/index.html"
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

          <ProjectContent1>
            <p>
              Machala Vehicles is an ambitious personal project that is on a
              mission to revolutionize the car industry. With a focus on the
              latest and greatest vehicles, including modern, exotic, and
              electric cars, this project aims to bring the thrill of
              cutting-edge automotive technology to a wider audience. The goal
              is to create an unforgettable and immersive car-buying experience
              that truly showcases the power, elegance, and innovation of these
              remarkable machines. So, buckle up and get ready for a ride of a
              lifetime, as Machala Vehicles takes you on a journey to discover
              the very best in modern driving.
            </p>
            <p>
              Just around August 2022, NIIT pulled out a wild card and assigned
              me and my team the task of building an automobile website with a
              twist - not only was I tasked with promoting the latest and
              greatest vehicles, but also with showing off my website design
              skills. And let me tell you, I was more than ready to take on this
              challenge! With excitement in my heart and determination in my
              bones, I threw myself into the project and learned as I went
              along. It was a wild ride, full of laughs, challenges, and a whole
              lot of car-filled fun.
            </p>
            <p>
              The biggest challenge in building the automobile website was
              finding the perfect design, but I was up for it! I scoured the
              internet, hitting up all the hottest spots like YouTube, Dribbble,
              and Figma, searching for design inspiration. I was like a kid in a
              candy store, soaking up all the creativity and taking notes on the
              coolest trends. It was a blast and I was more than ready to put my
              new-found design skills to the test. And let me tell you, the
              results were simply breathtaking.
            </p>

            <div className="project_imgContainer">
              <Image
                src="/MachalaVehicles __ A NIIT demo car website.png"
                alt=""
                width={450}
                height={900}
                className="coverImg"
              />

              <Image
                src="/Popular __ Machala Vehicles.png"
                alt=""
                width={450}
                height={900}
                className="coverImg"
              />

              <Image
                src="/About us __ Mavhala Vehicles.png"
                alt=""
                width={500}
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
