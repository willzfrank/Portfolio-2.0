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
  /** Extra places to open the project, e.g. App Store or Google Play. */
  links?: ProjectLink[]
  /** Brand colour behind the phones on app projects. */
  accent?: string
  /** The 10-second summary shown at the top of the case study. */
  highlights?: Highlights
  /** Short narrative for the case study: the problem, what was built, and what came out of it. */
  story?: Story
  /** Shown instead of the buttons when there is nothing public to open (private platforms). */
  access?: string
  image: string
  contributors: Contributor[]
  contributions: string[]
  images: ProjectImage[]
  category: 'web-design' | 'ai' | 'hr' | 'ecommerce' | 'tech'
}

export interface Highlights {
  role: string
  stack: string
  /** Two or three short, concrete things the project delivered. */
  outcomes: string[]
}

export interface Story {
  challenge: string
  approach: string
  result: string
}

export interface ProjectLink {
  label: string
  url: string
}

export interface Contributor {
  role: string
  name: string
  link?: string
}

export interface ProjectImage {
  src: string
  alt: string
  /** Short line shown beside a phone screen in the scroll showcase. */
  caption?: string
  width: number
  height: number
  className?: string
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'Café One',
    slug: 'cafeone',
    type: 'Coworking Platform',
    technologies: ['Mobile', 'iOS & Android'],
    timeline: '2026',
    description:
      "Booking and membership for Nigeria's largest coworking network.",
    longDescription: `Café One brings workspace booking, events and membership for a network of coworking hubs across Nigeria into one clear experience.

I built the mobile app: the way members find a space, book it and get on with their day.`,
    liveUrl: 'https://cafeone.ng',
    links: [{ label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.cafe.one' }],
    accent: '#b3121a',
    highlights: {
      role: 'Mobile app engineer',
      stack: 'React Native · Expo · TypeScript · TanStack Query',
      outcomes: [
        'Live on Google Play, built for iOS and Android from one TypeScript codebase',
        'Seven member journeys in one app: hubs, booking, work plans, café orders, events and tickets, wallet, feedback',
        'Book a space in three steps: pick a hub, choose a time, pay from your wallet',
      ],
    },
    story: {
      challenge:
        "Members had to find a hub, book a space, pay and join events from their phone, while prices, payments and tickets had to stay under the server's control, never the app's.",
      approach:
        'The app is built with React Native, Expo Router and TypeScript, so every screen is a real route and deep links work. Checkout hands off to the payment provider and returns through a verified deep link, and a booking only shows as paid once the server confirms it. I also wrote a small native Android module for step counting and set up EAS builds for both stores.',
      result:
        'One app covering hubs, booking, work plans, café orders, events and the wallet, live on Google Play.',
    },
    image: '/work/cafeone-1.jpg',
    category: 'tech',
    contributors: [],
    contributions: ['Mobile app engineering'],
    images: [
      { src: '/work/cafeone-s1.jpg', alt: 'Café One home', caption: 'Your workspace, sorted', width: 900, height: 1951 },
      { src: '/work/cafeone-s2.jpg', alt: 'Café One hub', caption: 'Pick a hub', width: 900, height: 1951 },
      { src: '/work/cafeone-s3.jpg', alt: 'Café One time selection', caption: 'Choose your time', width: 900, height: 1951 },
      { src: '/work/cafeone-s4.jpg', alt: 'Café One bookings', caption: 'Every booking in one place', width: 900, height: 1951 },
      { src: '/work/cafeone-s5.jpg', alt: 'Café One wallet', caption: 'Pay with your wallet', width: 900, height: 1951 },
      { src: '/work/cafeone-s6.jpg', alt: 'Café One event review', caption: 'Host your own event', width: 900, height: 1951 },
      { src: '/work/cafeone-1.jpg', alt: 'Café One website', width: 1440, height: 900 },
    ],
  },
  {
    id: '02',
    title: 'Whipcare',
    slug: 'whipcare',
    type: 'Car-care Marketplace',
    technologies: ['Mobile', 'iOS & Android'],
    timeline: '2026',
    description:
      'A marketplace connecting vehicle owners with trusted service providers.',
    longDescription: `Whipcare connects vehicle owners with mechanics, detailers and other service providers across Lagos, through iOS and Android apps.

I built the mobile app, the admin console and the landing page.`,
    liveUrl: 'https://whipcare.app',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/ng/app/whipcare-car-care-near-you/id6670729882' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.jozy.whipcareapp2' },
    ],
    accent: '#7a2205',
    highlights: {
      role: 'Mobile app, admin console and landing page',
      stack: 'React Native · Expo · NativeWind · Next.js · TypeScript',
      outcomes: [
        'Live on the App Store and Google Play',
        'Real-time booking offers and messages, so owners and providers answer each other live',
        'An admin console for bookings, providers, vehicle owners, fleet managers, financials, ads and feedback',
      ],
    },
    story: {
      challenge:
        'Vehicle owners needed a straightforward way to find a service, compare offers and follow the work, providers needed their side of the same conversation, and the Whipcare team needed one place to run the marketplace.',
      approach:
        'I built all three surfaces. The mobile app uses React Native, Expo and NativeWind, with booking requests, offers, status changes and messages arriving in real time through Ably, plus maps, push notifications and a separate flow for providers. The admin console is a Next.js dashboard for bookings, service providers, vehicle owners, fleet managers, financials, ads, marketing and feedback, with tables the team can export. The landing page at whipcare.app brings people to the app.',
      result:
        'Owners and providers use one app on iOS and Android to book, compare offers, pay and track a job from request to completion, and the team runs the marketplace from one console. The app is live on both stores.',
    },
    image: '/work/whipcare-1.jpg',
    category: 'tech',
    contributors: [],
    contributions: ['Mobile app engineering', 'Admin console', 'Landing page'],
    images: [
      { src: '/work/whipcare-s1.jpg', alt: 'Whipcare home', caption: 'Your car at a glance', width: 900, height: 1951 },
      { src: '/work/whipcare-s2.jpg', alt: 'Whipcare booking', caption: 'Book a service', width: 900, height: 1951 },
      { src: '/work/whipcare-s3.jpg', alt: 'Whipcare offers', caption: 'Compare offers', width: 900, height: 1951 },
      { src: '/work/whipcare-s4.jpg', alt: 'Whipcare tracking', caption: 'Track every repair', width: 900, height: 1951 },
      { src: '/work/whipcare-s5.jpg', alt: 'Whipcare vehicle health', caption: 'Know its health', width: 900, height: 1951 },
      { src: '/work/whipcare-s6.jpg', alt: 'Whipcare provider dashboard', caption: 'A dashboard for providers', width: 900, height: 1951 },
      { src: '/work/whipcare-1.jpg', alt: 'Whipcare website', width: 1440, height: 900 },
    ],
  },
  {
    id: '03',
    title: 'Bucks Invest',
    slug: 'bucksinvest',
    type: 'Investment Platform',
    technologies: ['Web', 'Platform'],
    timeline: '2025–2026',
    description:
      'A calm, confident way for investors to grow their money.',
    longDescription: `Bucks Invest is Bucksfield Asset Management's investment platform, with a customer portal for investors and an operations console for the team behind it.

I built the customer portal, the operations console and the partner portal.`,
    liveUrl: '',
    highlights: {
      role: 'Customer portal, admin console and partner portal',
      stack: 'Next.js · TypeScript · Tailwind · TanStack Query',
      outcomes: [
        'Three products shipped: the investor portal, the operations console and the partner portal',
        'Investors see their portfolio, product terms and every transaction in one place',
        'Charts and reporting for the team that runs it',
      ],
    },
    story: {
      challenge:
        'Investors needed a calm, trustworthy place to fund, invest and withdraw, and the operations team needed tight control over who can approve what.',
      approach:
        'I built three products on the same API. The customer portal covers onboarding with KYC, funding, investing, transfers, withdrawals, portfolio and referrals. The admin console has twelve modules, including approvals, AML checks, an audit trail and role-based settings. I also built the partner portal for investment partners. All of it is Next.js with React Hook Form and Zod for forms, TanStack Query for data and Recharts for the dashboards.',
      result:
        "Investors, staff and partners each get a focused tool: one place for the investor's money, one for the team that approves and audits it, and one for the partners.",
    },
    access: 'Private platform. A walkthrough is available on request.',
    image: '/work/bucks-v1.jpg',
    category: 'tech',
    contributors: [],
    contributions: ['Customer portal', 'Admin console', 'Partner portal'],
    images: [
      { src: '/work/bucks-v1.jpg', alt: 'Bucks Invest dashboard', caption: 'Your money at a glance', width: 1600, height: 865 },
      { src: '/work/bucks-v2.jpg', alt: 'Bucks Invest products', caption: 'Choose an instrument', width: 1600, height: 865 },
      { src: '/work/bucks-v3.jpg', alt: 'Bucks Invest product details', caption: 'Know the terms before you buy', width: 1600, height: 865 },
      { src: '/work/bucks-v4.jpg', alt: 'Bucks Invest portfolio', caption: 'Your portfolio', width: 1600, height: 865 },
      { src: '/work/bucks-v5.jpg', alt: 'Bucks Invest transactions', caption: 'Every transaction', width: 1600, height: 865 },
    ],
  },
  {
    id: '04',
    title: 'E-CAM',
    slug: 'ecam',
    type: 'Credit Appraisal Platform',
    technologies: ['Web', 'Platform'],
    timeline: '2026',
    description:
      'A workspace for reviewing, verifying and approving loan applications.',
    longDescription: `E-CAM is a credit appraisal platform that takes loan applications from first review to approval, with identity checks, contracts and a clear audit trail.

I built the platform.`,
    liveUrl: '',
    highlights: {
      role: 'Software engineer',
      stack: 'Next.js · TypeScript · Tailwind · TanStack Query',
      outcomes: [
        'Takes a loan application from first review to approval in one workspace',
        'Customer identity verification and contract signing built in',
        "API types generated from the backend's OpenAPI spec, so the UI and API can't drift apart",
      ],
    },
    story: {
      challenge:
        'Loan applications go through review, identity checks, contracts and approval, and reviewers need to see where every one stands and who touched it.',
      approach:
        "I built it with Next.js, TypeScript and TanStack Query, with API types generated from the backend's OpenAPI spec. It covers pending and approved applications, credit checks, customers, contracts, reports and an audit log, plus public pages where customers confirm their identity and sign contracts.",
      result:
        'One workspace takes an application from first review to approval, with each step recorded in an audit trail.',
    },
    access: 'Private platform. A walkthrough is available on request.',
    image: '/work/ecam-v1.jpg',
    category: 'tech',
    contributors: [],
    contributions: ['Software engineering'],
    images: [
      { src: '/work/ecam-v1.jpg', alt: 'E-CAM dashboard', caption: 'A day at a glance', width: 1600, height: 1000 },
      { src: '/work/ecam-v2.jpg', alt: 'E-CAM pending applications', caption: 'The review queue', width: 1600, height: 1000 },
      { src: '/work/ecam-v3.jpg', alt: 'E-CAM application review', caption: 'Every application, in depth', width: 1600, height: 1000 },
      { src: '/work/ecam-v4.jpg', alt: 'E-CAM credit checks', caption: 'Credit checks', width: 1600, height: 1000 },
      { src: '/work/ecam-v5.jpg', alt: 'E-CAM reports', caption: 'Reporting', width: 1600, height: 1000 },
    ],
  },
  {
    id: '07',
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
  //   {
  //     id: '04',
  //     title: 'GoghR',
  //     slug: 'goghr',
  //     type: 'AI-Powered HR Platform',
  //     technologies: ['React', 'Node.js', 'AI/ML', 'Python', 'MongoDB'],
  //     timeline: 'March 2023-April 2023',
  //     description:
  //       'An innovative AI-powered human resources platform that revolutionizes recruitment and employee management.',
  //     longDescription: `GoghR is a cutting-edge AI-powered human resources platform that revolutionizes the way companies approach recruitment, employee management, and organizational development. The platform leverages advanced machine learning algorithms to streamline HR processes and improve decision-making.

  // The system features intelligent candidate screening, automated interview scheduling, performance analytics, and predictive workforce planning. By combining artificial intelligence with human expertise, GoghR helps organizations build stronger, more diverse teams while reducing bias in hiring processes.

  // Key features include AI-driven resume parsing, skill gap analysis, employee engagement monitoring, and predictive turnover analysis. The platform also provides comprehensive reporting and analytics to help HR professionals make data-driven decisions.`,
  //     liveUrl: 'https://goghr-demo.vercel.app/',
  //     githubUrl: 'https://github.com/willzfrank/goghr',
  //     image: '/Willz Frank.png',
  //     category: 'ai',
  //     contributors: [
  //       {
  //         role: 'Lead AI Engineer',
  //         name: 'Godswill Francis',
  //       },
  //       {
  //         role: 'UX Designer',
  //         name: 'Sarah Chen',
  //         link: 'https://www.behance.net/sarahchen',
  //       },
  //       {
  //         role: 'Backend Developer',
  //         name: 'Alex Rodriguez',
  //         link: 'https://github.com/alexrodriguez',
  //       },
  //     ],
  //     contributions: [
  //       'AI/ML algorithm development',
  //       'Frontend architecture',
  //       'API integration',
  //       'User experience design',
  //     ],
  //     images: [
  //       {
  //         src: '/Willz Frank.png',
  //         alt: 'GoghR Dashboard',
  //         width: 500,
  //         height: 500,
  //         className: 'coverImg',
  //       },
  //       {
  //         src: '/Willz Frank (1).png',
  //         alt: 'GoghR Candidate Screening',
  //         width: 500,
  //         height: 500,
  //         className: 'coverImg',
  //       },
  //       {
  //         src: '/Willz Frank (2).png',
  //         alt: 'GoghR Analytics',
  //         width: 500,
  //         height: 500,
  //         className: 'coverImg',
  //       },
  //     ],
  //   },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug)
}

export const getProjectsByCategory = (
  category: Project['category']
): Project[] => {
  return projects.filter((project) => project.category === category)
}
