export interface Project {
  id: string
  title: string
  slug: string
  type: string
  technologies: string[]
  timeline: string
  description: string
  longDescription: string
  liveUrl: string
  githubUrl?: string
  image: string
  contributors: Contributor[]
  contributions: string[]
  images: ProjectImage[]
  category: 'web-design' | 'ai' | 'hr' | 'ecommerce' | 'tech'
}

export interface Contributor {
  role: string
  name: string
  link?: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'Artsy',
    slug: 'artsy',
    type: 'Photography E-commerce',
    technologies: ['TypeScript', 'Next.js', 'React'],
    timeline: 'December 2022-January 2023',
    description:
      'A photography e-commerce website offering an art-focused shopping experience.',
    longDescription: `Artsy is a personal project that seeks to offer an art-focused e-commerce experience, allowing you to discover a variety of art and artists. Are you prepared to start shopping?

In December 2022, Coding Ossy assigned a task to build a photography e-commerce website. This project offered a great opportunity to gain new skills and experiences.

The biggest challenge was incorporating TypeScript into the project, as it was the first time using it with Next.js.

In particular, there was difficulty in setting up the routing for both the Marketplace page and the Article page.`,
    liveUrl: 'https://artsy-swart.vercel.app/',
    githubUrl: 'https://github.com/willzfrank/ARTSY',
    image: '/Screenshot (1).png',
    category: 'ecommerce',
    contributors: [
      {
        role: 'Lead Designer',
        name: '@celestinaa0',
        link: 'https://www.behance.net/bammiewh0',
      },
      {
        role: 'Idea',
        name: 'Coding Ossy',
        link: 'https://twitter.com/codingossy',
      },
    ],
    contributions: ['Copywriting', 'Page layout & design'],
    images: [
      {
        src: '/HOMEPAGE.png',
        alt: 'Artsy Homepage',
        width: 500,
        height: 900,
        className: 'coverImg artsyImage',
      },
      {
        src: '/DROP WEB.png',
        alt: 'Artsy Drop Web',
        width: 500,
        height: 900,
        className: 'coverImg artsyImage',
      },
    ],
  },
  {
    id: '02',
    title: 'Machala Vehicles',
    slug: 'machalavehicles',
    type: 'Vehicle Website',
    technologies: ['JavaScript', 'CSS', 'HTML'],
    timeline: 'January 2023-February 2023',
    description:
      'A comprehensive vehicle dealership website showcasing luxury cars and services.',
    longDescription: `Machala Vehicles is a premium vehicle dealership website that showcases luxury cars and provides comprehensive automotive services. The project focuses on creating an elegant and user-friendly interface for car enthusiasts and potential buyers.

The website features detailed vehicle listings, service information, and contact forms to facilitate customer inquiries. The design emphasizes luxury and professionalism while maintaining excellent user experience.`,
    liveUrl: 'https://lexusniitdemo.vercel.app/',
    image: '/About us __ Mavhala Vehicles.png',
    category: 'web-design',
    contributors: [
      {
        role: 'Lead Developer',
        name: 'Godswill Francis',
      },
    ],
    contributions: [
      'Full-stack development',
      'UI/UX design',
      'Content management',
    ],
    images: [
      {
        src: '/About us __ Mavhala Vehicles.png',
        alt: 'Machala Vehicles About Page',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
      {
        src: '/Popular __ Machala Vehicles.png',
        alt: 'Machala Vehicles Popular Cars',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
    ],
  },
  {
    id: '03',
    title: 'Vsonet Education',
    slug: 'vsonet',
    type: 'Tech Website',
    technologies: ['JavaScript', 'CSS', 'HTML'],
    timeline: 'February 2023-March 2023',
    description:
      'An educational technology platform providing innovative learning solutions.',
    longDescription: `Vsonet Education is a cutting-edge educational technology platform that provides innovative learning solutions for students and educators. The platform combines modern web technologies with educational best practices to create an engaging learning environment.

The project focuses on creating an intuitive interface that makes learning accessible and enjoyable for users of all ages. The platform includes features for course management, progress tracking, and interactive learning modules.`,
    liveUrl: 'https://vsoneteducationdemo.netlify.app/',
    image: '/Vsonet Education.png',
    category: 'tech',
    contributors: [
      {
        role: 'Lead Developer',
        name: 'Godswill Francis',
      },
    ],
    contributions: [
      'Frontend development',
      'Educational content integration',
      'User experience optimization',
    ],
    images: [
      {
        src: '/Vsonet Education.png',
        alt: 'Vsonet Education Homepage',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
      {
        src: '/Vsonet Education (2).png',
        alt: 'Vsonet Education Features',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
      {
        src: '/Vsonet Education (3).png',
        alt: 'Vsonet Education Courses',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
    ],
  },
  {
    id: '04',
    title: 'GoghR',
    slug: 'goghr',
    type: 'AI-Powered HR Platform',
    technologies: ['React', 'Node.js', 'AI/ML', 'Python', 'MongoDB'],
    timeline: 'March 2023-April 2023',
    description:
      'An innovative AI-powered human resources platform that revolutionizes recruitment and employee management.',
    longDescription: `GoghR is a cutting-edge AI-powered human resources platform that revolutionizes the way companies approach recruitment, employee management, and organizational development. The platform leverages advanced machine learning algorithms to streamline HR processes and improve decision-making.

The system features intelligent candidate screening, automated interview scheduling, performance analytics, and predictive workforce planning. By combining artificial intelligence with human expertise, GoghR helps organizations build stronger, more diverse teams while reducing bias in hiring processes.

Key features include AI-driven resume parsing, skill gap analysis, employee engagement monitoring, and predictive turnover analysis. The platform also provides comprehensive reporting and analytics to help HR professionals make data-driven decisions.`,
    liveUrl: 'https://goghr-demo.vercel.app/',
    githubUrl: 'https://github.com/willzfrank/goghr',
    image: '/Willz Frank.png',
    category: 'ai',
    contributors: [
      {
        role: 'Lead AI Engineer',
        name: 'Godswill Francis',
      },
      {
        role: 'UX Designer',
        name: 'Sarah Chen',
        link: 'https://www.behance.net/sarahchen',
      },
      {
        role: 'Backend Developer',
        name: 'Alex Rodriguez',
        link: 'https://github.com/alexrodriguez',
      },
    ],
    contributions: [
      'AI/ML algorithm development',
      'Frontend architecture',
      'API integration',
      'User experience design',
    ],
    images: [
      {
        src: '/Willz Frank.png',
        alt: 'GoghR Dashboard',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
      {
        src: '/Willz Frank (1).png',
        alt: 'GoghR Candidate Screening',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
      {
        src: '/Willz Frank (2).png',
        alt: 'GoghR Analytics',
        width: 500,
        height: 500,
        className: 'coverImg',
      },
    ],
  },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug)
}

export const getProjectsByCategory = (
  category: Project['category']
): Project[] => {
  return projects.filter((project) => project.category === category)
}
