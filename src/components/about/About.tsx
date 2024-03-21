import Link from 'next/link';
import { AboutBox, AboutTitle, MoreBtn } from './aboutStyles';

const AboutComponent: React.FC = () => {
  return (
    <AboutBox>
      <div>
        <AboutTitle>About</AboutTitle>
        <span>
          With 4 years of software development experience, I am part of the
          amazing team at Sanmtos and a master of crafting efficient and
          creative solutions. Passionate about using tech for good, I am
          constantly seeking innovative problem-solving methods. Expert in
          Javascript and its frameworks, I deliver high-quality software that
          impresses clients. I have a talent for simplifying complex ideas and
          strive to continuously improve.
        </span>
      </div>

      <MoreBtn>
        <Link href="/about/" className="morebtn">
          More
        </Link>
      </MoreBtn>
    </AboutBox>
  );
};

export default AboutComponent;
