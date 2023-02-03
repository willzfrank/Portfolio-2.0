import React from 'react';
import Link from 'next/link';
import { AboutBox, AboutTitle, MoreBtn } from './aboutStyles';

type Props = {};

const AboutComponent: React.FC<Props> = () => {
  return (
    <AboutBox className="section">
      <p id="about-content">
        <AboutTitle className="heading_small letter-animate" id="about-title">
          About
        </AboutTitle>
        {`I'm`} currently jamming with the awesome team at @
        <a href="https://sanmtosapp.com/" target="_blank" rel="noreferrer">
          Sanmtos
        </a>
        , and with three years of software development experience under my belt,{' '}
        {`I've`} become a master of crafting quirky and efficient solutions for
        a variety of projects.
        {/* {`I'm`} passionate about using technology for good and always on the
        hunt for new and innovative ways to solve problems. My expertise in
        Javascript and its frameworks means that I can consistently deliver
        high-quality software that blows my clients away. I have a gift for
        turning complex ideas into simple and stylish solutions, and {`I'm`}{' '}
        always working on getting even better. */}
      </p>

      <MoreBtn>
        <Link href="/about/" className="morebtn" id="about-cta">
          More
        </Link>
      </MoreBtn>
    </AboutBox>
  );
};

export default AboutComponent;
