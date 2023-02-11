import Footer from '@/components/footer/Footer';
import { Navbar } from '@/components/navbar';
import Head from 'next/head';
import React from 'react';
import { ContactContainer, ContactSocials } from '@/styles/ContactStyles';
import Link from 'next/link';
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

type Props = {};

const project = (props: Props) => {
  return (
    <>
      <Head>
        <title>Godswill Francis &trade; | Project</title>
        <meta name="description" content="Project page of Godswill Francis" />
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
            <h6>ACHIEVEMENTS</h6>
          </div>
          <div className="contact_content">
            <h2>
              PROJECTS
              <span> - Frontend </span>
            </h2>
            <h5>
              With an eye for the small details that make a big impact, I pour
              all of my passion into my work to craft exceptional UI
              experiences. Each project I undertake is distinct and custom-made
              with its own distinct personality. Please take a look at some of
              my achievements below:
            </h5>
          </div>
        </div>
      </ContactContainer>
      <ExperienceContainer>
        <ExperienceList>
          <Link className="link" href="/project/vsonet">
            <li>
              <div>
                <p>VSONET EDUCATION</p>
              </div>
              <ExperienceDate>
                <p>PERSONAL PROJECT</p>
              </ExperienceDate>
            </li>
          </Link>

          <Link className="link" href="/project/machalavehicles">
            <li>
              <div>
                <p>MACHALA VEHICLES</p>
              </div>
              <ExperienceDate>
                <p>PERSONAL PROJECT</p>
              </ExperienceDate>
            </li>
          </Link>

          <li>
            <div>
              <p>PORTFOLIO 1.0</p>
            </div>
            <ExperienceDate>
              <p>PERSONAL PORTFOLIO</p>
            </ExperienceDate>
          </li>

          <li>
            <div>
              <p>ARTSY</p>
            </div>
            <ExperienceDate>
              <p>PHOTOGRAPHY E-COMMERCE</p>
            </ExperienceDate>
          </li>
        </ExperienceList>
      </ExperienceContainer>
      <Footer />
    </>
  );
};

export default project;
