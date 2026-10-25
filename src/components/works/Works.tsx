import Link from 'next/link';
import VerticalTabs from './VerticalTab/Tab';
import { Project } from '@/data/projects';
import {
  WorkContentBox,
  WorkContentTitle,
  WorkContentText,
  WorkBox,
} from './WorkStyles';

const Works = ({ projects }: { projects: Project[] }) => {
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
      <VerticalTabs projects={projects} />
    </WorkBox>
  );
};

export default Works;
