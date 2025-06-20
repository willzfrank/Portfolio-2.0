import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Tab, TabContent, TabImage, TabContainer } from './TabStyles'
import { projects } from '@/data/projects'
import ProjectCard from '../ProjectCard'
import MobileProjectCard from '../MobileProjectCard'

const VerticalTabs = () => {
  const [activeTab, setActiveTab] = useState<string>(projects[0]?.title || '')

  useEffect(() => {
    document.getElementById('defaultOpen')?.click()
  }, [])

  const openProject = (projectTitle: string) => {
    setActiveTab(projectTitle)
  }

  const activeProject = projects.find((project) => project.title === activeTab)

  return (
    <div>
      <TabContainer>
        <Tab>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={activeTab === project.title}
              onClick={() => openProject(project.title)}
              isDefault={index === 0}
            />
          ))}
        </Tab>

        {projects.map((project) => (
          <TabContent
            key={project.id}
            style={{ display: activeTab === project.title ? 'block' : 'none' }}
          >
            <TabImage>
              <div className="imgimg">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  width={500}
                  height={400}
                  className="tab_img"
                />
              </div>
            </TabImage>
          </TabContent>
        ))}
      </TabContainer>

      <div className="mobile_tab">
        <MobileProjectCard projects={projects} />
        <Link
          className="link resume"
          href="../../public/Godswill Udoh FrontendDeveloper.pdf"
          download
        ></Link>
      </div>
    </div>
  )
}

export default VerticalTabs
