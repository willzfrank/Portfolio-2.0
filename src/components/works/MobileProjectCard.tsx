import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { ExperienceList, ExperienceDate } from '@/styles/AboutStyles';
import { TitleText } from './VerticalTab/TabStyles';

interface MobileProjectCardProps {
  projects: Project[];
}

const MobileProjectCard: React.FC<MobileProjectCardProps> = ({ projects }) => {
  return (
    <ExperienceList>
      {projects.map((project) => (
        <li key={project.id}>
          <Link href={`/project/${project.slug}`} className="link">
            <TitleText id={`project-${project.id}-title`} title={project.title}>
              {project.title}
            </TitleText>
          </Link>
          <ExperienceDate>
            <Link
              href={project.liveUrl}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
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
            </Link>
          </ExperienceDate>
        </li>
      ))}
    </ExperienceList>
  );
};

export default MobileProjectCard; 