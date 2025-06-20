import React from 'react'
import Link from 'next/link'
import { Project } from '@/data/projects'
import { TabButton, Num, TitleText } from './VerticalTab/TabStyles'

interface ProjectCardProps {
  project: Project
  isActive: boolean
  onClick: () => void
  isDefault?: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive,
  onClick,
  isDefault = false,
}) => {
  return (
    <TabButton
      className={isActive ? 'active' : ''}
      onClick={onClick}
      id={isDefault ? 'defaultOpen' : undefined}
    >
      <li className="project">
        <Num id={`project-${project.id}-num`}>{project.id}</Num>
        <Link href={`/project/${project.slug}`} className="link">
          <TitleText id={`project-${project.id}-title`} title={project.title}>
            {project.title}
          </TitleText>
        </Link>
        <TitleText id={`project-${project.id}-type`}>
          {project.type} - {project.technologies.join(', ')}
        </TitleText>
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
              fill="#dbdada"
            />
          </svg>
        </Link>
      </li>
    </TabButton>
  )
}

export default ProjectCard
