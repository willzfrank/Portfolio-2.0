import Link from 'next/link';
import VerticalTabs from './VerticalTab/Tab';
import {
  WorkContentBox,
  WorkContentTitle,
  WorkContentText,
  WorkBox,
} from './WorkStyles';

const Works = () => {
  return (
    <WorkBox>
      <WorkContentBox>
        <WorkContentTitle>Selected works</WorkContentTitle>
        <WorkContentText>
          Here are some of my best projects. For a complete list, visit the{' '}
          <Link href="/project" className="project_link">
            Projects page
          </Link>
          .
        </WorkContentText>
      </WorkContentBox>
      <VerticalTabs />
    </WorkBox>
  );
};

export default Works;
