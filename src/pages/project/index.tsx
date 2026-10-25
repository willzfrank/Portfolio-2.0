import React, { useMemo, useState } from 'react'
import { GetStaticProps } from 'next'
import { Project } from '@/data/projects'
import { getProjects } from '@/lib/projectsRepo'
import PageShell from '@/components/page/PageShell'
import PageHero from '@/components/page/PageHero'
import WorkIndex from '@/components/home/WorkIndex'
import { Chips } from '@/components/page/pageStyles'

const CATEGORY_LABELS: Record<string, string> = {
  'web-design': 'Web design',
  ai: 'AI',
  hr: 'HR',
  ecommerce: 'E-commerce',
  tech: 'Tech',
}

const ProjectsPage = ({ projects }: { projects: Project[] }) => {
  const [cat, setCat] = useState('all')

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects]
  )
  const shown = cat === 'all' ? projects : projects.filter((p) => p.category === cat)

  return (
    <PageShell
      title="Projects"
      description="Explore the portfolio of projects by Godswill Francis - web design, e-commerce and technology solutions."
      footer="full"
    >
      <PageHero
        label="(01) — Portfolio"
        meta={`${String(projects.length).padStart(2, '0')} projects`}
        lines={[{ text: 'Selected' }, { text: 'work', out: true }]}
      >
        Each project is a unique challenge and learning opportunity, showing my
        skills across web, mobile, backend and cloud.
      </PageHero>

      {categories.length > 1 && (
        <Chips>
          <button className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>
            All ({projects.length})
          </button>
          {categories.map((c) => (
            <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
              {CATEGORY_LABELS[c] ?? c}
            </button>
          ))}
        </Chips>
      )}

      <WorkIndex projects={shown} label="(02) — Index" showAll={false} />
    </PageShell>
  )
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { projects: await getProjects() },
  revalidate: 60,
})

export default ProjectsPage
