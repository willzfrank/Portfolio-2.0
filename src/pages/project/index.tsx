import { Navbar } from '@/components/navbar'
import React from 'react'
import {
  ProjectHeader,
  ProjectHeaderTitle,
  ProjectContributors,
  ProjectContent,
  Dashspan,
  ProjectContent1,
  LongerDashspan,
} from '@/styles/ProjectStyles'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/footer/Footer'
import Marquee from '@/components/marquee/Marquee'
import { projects } from '@/data/projects'

const ProjectsPage = () => {
  return (
    <div>
      <Head>
        <title>Godswill Francis &trade; | Projects</title>
        <meta
          name="description"
          content="Explore the portfolio of projects by Godswill Francis - Web Design, AI, HR, and Technology solutions"
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
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Godswill Francis ™ | Projects" />
        <meta
          property="og:description"
          content="Explore the portfolio of projects by Godswill Francis - Web Design, AI, HR, and Technology solutions"
        />
        <meta property="og:image" content="/profile.jpeg" />
        <meta property="og:url" content="https://yourwebsite.com/project" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Godswill Francis ™ | Projects" />
        <meta
          name="twitter:description"
          content="Explore the portfolio of projects by Godswill Francis - Web Design, AI, HR, and Technology solutions"
        />
        <meta name="twitter:image" content="/profile.jpeg" />
      </Head>
      <Navbar />
      <ProjectHeader className="w95">
        <ProjectHeaderTitle>
          <div className="projectheader_title">
            <h6>PORTFOLIO</h6>
            <h1>PROJECTS</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Total Projects</h3>
              <p>{projects.length}</p>
            </div>
            <div className="column">
              <h3>Categories</h3>
              <p>Web Design, AI, HR, E-commerce, Tech</p>
            </div>
            <div className="column">
              <h3>Technologies</h3>
              <p>React, Next.js, TypeScript, AI/ML, Python</p>
            </div>
            <div className="column">
              <h3>Experience</h3>
              <p>2+ Years</p>
            </div>
          </div>
        </ProjectContributors>
        <ProjectContent>
          <div className="project_linkcontainer flex between">
            <div className="project_contentLink">
              <Link href="/" className="link">
                <Dashspan></Dashspan>
                <span
                  style={{
                    color: 'white',
                  }}
                >
                  BACK TO HOME
                </span>
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
              Welcome to my project portfolio! Here you'll find a collection of
              my work across various domains including web design, artificial
              intelligence, human resources, and technology solutions.
            </p>
            <p>
              Each project represents a unique challenge and learning
              opportunity, showcasing my skills in frontend development, AI/ML
              integration, and user experience design.
            </p>

            <div className="project_imgContainer">
              {projects.map((project, index) => (
                <div key={project.id} className="project-preview">
                  <Link href={`/project/${project.slug}`}>
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      width={400}
                      height={300}
                      className="coverImg"
                    />
                    <div className="project-overlay">
                      <h3>{project.title}</h3>
                      <p>{project.type}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </ProjectContent1>
        </ProjectContent>
      </ProjectHeader>
      <Marquee />
      <Footer />
    </div>
  )
}

export default ProjectsPage
