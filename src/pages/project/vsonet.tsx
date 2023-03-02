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
import Marquee from '@/components/marquee/Marquee';

type Props = {};

const Artsy = (props: Props) => {
  return (
    <div>
      <Head>
        <title>Godswill Francis &trade; | Vsonet Education</title>
        <meta
          name="description"
          content="This page is about the Vsonet Education project by Godswill Francis"
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
      <Navbar />

      <ProjectHeader className="w95">
        <ProjectHeaderTitle>
          <div className="projectheader_title">
            <h6>TECH TRAINING PLATFORM</h6>
            <h1>VSONET EDUCATION</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Project Timeline</h3>
              <p>November 2021-January 2022</p>
            </div>
            <div className="column">
              <h3>Project Type</h3>
              <p>Tech Education</p>
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
          <div className="flex between project_linkcontainer">
            <div className="project_contentLink">
              <Link
                href="https://vsoneteducationdemo.netlify.app/"
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
                  fill="white"
                />
              </svg>
            </div>
            <div className="project_contentLink">
              <Link
                href="https://github.com/willzfrank/Vsonet_Education"
                className="link"
                target="_blank"
              >
                {/* <Dashspan></Dashspan> */}
                <span>CHECK OUT THE SOURCE CODE </span>
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
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <ProjectContent1>
            <p>
              The idea of this cutting-edge platform was designed to unleash the
              full potential of students and aspiring developers. With
              mentorship, training, and bootcamps at your fingertips, {`it's`}{' '}
              the ultimate launchpad for your tech career. So, are you ready to
              start learning like a pro?
            </p>
            <p>
              Attention, tech lovers! Late November 2021 was a wild ride for the
              Vsonet crew. They knew it was time to revamp their website and who
              did they call? The one, the only - yours truly! I was challenged
              to create a website so gorgeous, it would make their customers do
              a double-take. And let me tell ya, I brought my A-game with some
              serious CSS animation magic! 😎
            </p>
            <p>
              When it comes to company websites, perfection is key. And{' '}
              {`that's `}
              exactly what I was striving for with the Vsonet project. From
              optimization and SEO to customer satisfaction, I left no stone
              unturned. But my biggest challenge was bringing the unique design
              of CSS cards to life, based on a Figma design. But with
              determination and teamwork, we conquered that hurdle and delivered
              a website that exceeded expectations.
            </p>

            <div className="project_imgContainer artsy">
              <Image
                src="/Vsonet Education (3).png"
                alt=""
                width={1200}
                height={500}
                className="coverImg vsonetImg"
              />

              <Image
                src="/Vsonet Education.png"
                alt=""
                width={1200}
                height={500}
                className="coverImg vsonetImg"
              />

              <Image
                src="/Vsonet Education (2).png"
                alt=""
                width={1200}
                height={500}
                className="coverImg vsonetImg"
              />
            </div>
          </ProjectContent1>

          <div className="project_homeLink">
            <Link href="/project" className="link">
              <LongerDashspan></LongerDashspan>
              <span>BACK TO PROJECTS</span>
            </Link>
          </div>
        </ProjectContent>
        <Marquee />
        <Footer />
      </ProjectHeader>
    </div>
  );
};

export default Artsy;
