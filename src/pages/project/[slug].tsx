import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { Project } from '@/data/projects'
import { getProjects } from '@/lib/projectsRepo'
import CaseStudy, { NextRef } from '@/components/project/CaseStudy'

interface ProjectPageProps {
  project: Project
  next: NextRef | null
  index: number
  total: number
}

const ProjectPage = (props: ProjectPageProps) => <CaseStudy {...props} />

// Pages are generated on first request (and revalidated), so projects added
// in the admin appear without a rebuild.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return { notFound: true, revalidate: 60 }

  const after = projects[(index + 1) % projects.length]
  return {
    props: {
      project: projects[index],
      next: projects.length > 1 ? { title: after.title, slug: after.slug } : null,
      index,
      total: projects.length,
    },
    revalidate: 60,
  }
}

export default ProjectPage
