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
import { GetStaticProps, GetStaticPaths } from 'next'
import { projects, getProjectBySlug, Project } from '@/data/projects'

interface ProjectPageProps {
  project: Project
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project }) => {
  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div>
      <Head>
        <title>Godswill Francis &trade; | {project.title}</title>
        <meta name="description" content={project.description} />
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
        <meta
          property="og:title"
          content={`Godswill Francis ™ | ${project.title}`}
        />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={project.image} />
        <meta
          property="og:url"
          content={`https://yourwebsite.com/project/${project.slug}`}
        />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Godswill Francis ™ | ${project.title}`}
        />
        <meta name="twitter:description" content={project.description} />
        <meta name="twitter:image" content={project.image} />
      </Head>
      <Navbar />
      <ProjectHeader className="w95">
        <ProjectHeaderTitle>
          <div className="projectheader_title">
            <h6>{project.category.toUpperCase()}</h6>
            <h1>{project.title}</h1>
          </div>
        </ProjectHeaderTitle>
        <ProjectContributors>
          <div className="section slimmer flex between mobile-block mobile-collapse ">
            <div className="column">
              <h3>Project Timeline</h3>
              <p>{project.timeline}</p>
            </div>
            <div className="column">
              <h3>Project Type</h3>
              <p>{project.type}</p>
            </div>
            <div className="column">
              <h3>Contributers</h3>
              <ul>
                {project.contributors.map((contributor, index) => (
                  <li key={index} className="contributer">
                    <p className="mb-1 ">{contributor.role}</p>
                    {contributor.link ? (
                      <Link
                        href={contributor.link}
                        className="link"
                        target="_blank"
                        rel="noopener"
                      >
                        {contributor.name}
                      </Link>
                    ) : (
                      <span>{contributor.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="column">
              <h3>My Contribution</h3>
              <ul>
                {project.contributions.map((contribution, index) => (
                  <li key={index} className="mb-2">
                    <p className="">{contribution}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ProjectContributors>
        <ProjectContent>
          <div className="project_linkcontainer flex between">
            <div className="project_contentLink">
              <Link
                href={project.liveUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Dashspan></Dashspan>
                <span
                  style={{
                    color: 'white',
                  }}
                >
                  CHECK OUT THE WEBSITE
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

            {project.githubUrl && (
              <div className="project_contentLink">
                <Link
                  href={project.githubUrl}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>CHECK OUT THE SOURCE CODE</span>
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
            )}
          </div>

          <ProjectContent1>
            {project.longDescription.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <div className={`project_imgContainer ${project.slug}`}>
              {project.images.map((img, index) => (
                <Image
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className={img.className || 'coverImg'}
                />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
    },
  }
}

export default ProjectPage
