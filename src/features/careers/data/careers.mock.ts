import type { Career } from '../types';

export const CAREERS: Career[] = [
  // ─────────── technology ───────────
  {
    id: 'c-001',
    slug: 'software-engineer',
    title: 'Software Engineer',
    category: 'technology',
    shortDescription:
      'Design, build, and maintain software systems that power products and services.',
    description:
      'Software engineers turn ideas into reliable software. The role spans architecture, coding, testing, and collaboration with product and design. Demand is broad — from early-stage startups to large platforms.',
    salaryRange: {
      entry: '₹6–12 LPA',
      mid: '₹18–35 LPA',
      senior: '₹45 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 3,
    interests: ['tech', 'math', 'making'],
    skills: [
      { name: 'Programming', weight: 90 },
      { name: 'Problem Solving', weight: 85 },
      { name: 'System Design', weight: 70 },
      { name: 'Communication', weight: 55 },
      { name: 'Databases', weight: 60 },
    ],
    roadmap: [
      {
        stage: 'Foundations',
        durationMonths: 6,
        items: ['Learn a primary language', 'CS basics', 'Build 3 small projects'],
      },
      {
        stage: 'Specialisation',
        durationMonths: 8,
        items: ['Web or systems track', 'Open-source contribution', 'Internship'],
      },
      {
        stage: 'Entry Role',
        durationMonths: 4,
        items: ['Portfolio + resume', 'Interview prep', 'Apply widely'],
      },
      {
        stage: 'Growth',
        durationMonths: 18,
        items: ['On-the-job depth', 'Side projects', 'Mentor juniors'],
      },
    ],
    relatedCareers: ['c-002', 'c-007', 'c-010'],
  },
  {
    id: 'c-002',
    slug: 'data-scientist',
    title: 'Data Scientist',
    category: 'technology',
    shortDescription:
      'Use statistics and machine learning to extract insight from data and inform decisions.',
    description:
      'Data scientists combine domain curiosity with statistical rigour. You’ll clean data, build models, communicate findings, and work closely with product teams to turn insight into action.',
    salaryRange: {
      entry: '₹7–14 LPA',
      mid: '₹22–40 LPA',
      senior: '₹50 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 4,
    interests: ['tech', 'math', 'science'],
    skills: [
      { name: 'Statistics', weight: 90 },
      { name: 'Python / R', weight: 80 },
      { name: 'Machine Learning', weight: 75 },
      { name: 'Communication', weight: 70 },
      { name: 'SQL', weight: 70 },
    ],
    roadmap: [
      {
        stage: 'Math Refresh',
        durationMonths: 4,
        items: ['Probability', 'Linear algebra basics', 'Hypothesis testing'],
      },
      {
        stage: 'Tooling',
        durationMonths: 5,
        items: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
      },
      {
        stage: 'Applied Projects',
        durationMonths: 6,
        items: ['2 portfolio projects', 'Kaggle participation'],
      },
      {
        stage: 'Interview',
        durationMonths: 3,
        items: ['Case studies', 'Stats drills', 'Behavioural prep'],
      },
    ],
    relatedCareers: ['c-001', 'c-008', 'c-010'],
  },

  // ─────────── science ───────────
  {
    id: 'c-003',
    slug: 'research-scientist',
    title: 'Research Scientist',
    category: 'science',
    shortDescription:
      'Conduct scientific research in academic, government, or industry settings.',
    description:
      'Research scientists design experiments, publish findings, and push the frontier of a field. The path usually involves a PhD, but applied research roles exist with a master’s.',
    salaryRange: {
      entry: '₹5–9 LPA',
      mid: '₹12–22 LPA',
      senior: '₹30 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'steady',
    difficulty: 5,
    interests: ['science', 'math'],
    skills: [
      { name: 'Scientific Method', weight: 95 },
      { name: 'Statistics', weight: 80 },
      { name: 'Writing', weight: 75 },
      { name: 'Domain Depth', weight: 85 },
      { name: 'Collaboration', weight: 60 },
    ],
    roadmap: [
      {
        stage: 'Bachelor’s',
        durationMonths: 36,
        items: ['Core coursework', 'Lab rotations', 'Reading groups'],
      },
      {
        stage: 'Master’s / PhD',
        durationMonths: 24,
        items: ['Pick a lab', 'Publish early', 'Build a niche'],
      },
      {
        stage: 'Postdoc / Industry',
        durationMonths: 24,
        items: ['Apply to labs', 'Industry R&D roles'],
      },
    ],
    relatedCareers: ['c-008', 'c-009'],
  },
  {
    id: 'c-004',
    slug: 'biotechnology-researcher',
    title: 'Biotechnology Researcher',
    category: 'science',
    shortDescription:
      'Apply biology, chemistry, and engineering to develop products in health, agriculture, and industry.',
    description:
      'Biotech researchers work at the intersection of biology and engineering. Roles exist in pharma, agriculture, and synthetic biology startups.',
    salaryRange: {
      entry: '₹4–8 LPA',
      mid: '₹10–20 LPA',
      senior: '₹28 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 4,
    interests: ['science', 'health', 'making'],
    skills: [
      { name: 'Molecular Biology', weight: 85 },
      { name: 'Lab Technique', weight: 80 },
      { name: 'Data Analysis', weight: 65 },
      { name: 'Bioinformatics', weight: 60 },
      { name: 'Collaboration', weight: 60 },
    ],
    roadmap: [
      {
        stage: 'Undergraduate',
        durationMonths: 36,
        items: ['B.Sc. Biotech / Biology', 'Lab internships'],
      },
      {
        stage: 'M.Sc. / PhD',
        durationMonths: 24,
        items: ['Specialise', 'Conference network'],
      },
      {
        stage: 'Industry Role',
        durationMonths: 6,
        items: ['Apply to pharma / startups'],
      },
    ],
    relatedCareers: ['c-003', 'c-009'],
  },

  // ─────────── business ───────────
  {
    id: 'c-005',
    slug: 'product-manager',
    title: 'Product Manager',
    category: 'business',
    shortDescription:
      'Own the why, what, and when of a product — bridging users, business, and engineering.',
    description:
      'Product managers decide what to build and why. They combine customer empathy, business judgement, and clear communication to keep cross-functional teams focused on outcomes.',
    salaryRange: {
      entry: '₹8–18 LPA',
      mid: '₹25–45 LPA',
      senior: '₹60 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 3,
    interests: ['business', 'tech', 'languages'],
    skills: [
      { name: 'Communication', weight: 90 },
      { name: 'Analytical Thinking', weight: 80 },
      { name: 'Customer Empathy', weight: 85 },
      { name: 'Prioritisation', weight: 75 },
      { name: 'Basic Tech Fluency', weight: 60 },
    ],
    roadmap: [
      {
        stage: 'Foundation',
        durationMonths: 6,
        items: ['Read PM classics', 'Pick a domain'],
      },
      {
        stage: 'Build a Portfolio',
        durationMonths: 6,
        items: ['Spec writeups', 'Side PM gigs', 'Case practice'],
      },
      {
        stage: 'APM Programs',
        durationMonths: 3,
        items: ['Apply to APM programs', 'Interviews'],
      },
    ],
    relatedCareers: ['c-006', 'c-012'],
  },
  {
    id: 'c-006',
    slug: 'business-analyst',
    title: 'Business Analyst',
    category: 'business',
    shortDescription:
      'Translate business needs into data, process, and product decisions.',
    description:
      'Business analysts sit between business stakeholders and technical teams. They gather requirements, model processes, and turn data into recommendations.',
    salaryRange: {
      entry: '₹5–10 LPA',
      mid: '₹12–22 LPA',
      senior: '₹30 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'steady',
    difficulty: 2,
    interests: ['business', 'math'],
    skills: [
      { name: 'SQL', weight: 80 },
      { name: 'Excel / Sheets', weight: 80 },
      { name: 'Communication', weight: 80 },
      { name: 'Process Modelling', weight: 65 },
      { name: 'Domain Knowledge', weight: 70 },
    ],
    roadmap: [
      {
        stage: 'Tooling',
        durationMonths: 4,
        items: ['SQL', 'Spreadsheets', 'A BI tool'],
      },
      {
        stage: 'Domain Pick',
        durationMonths: 4,
        items: ['Choose an industry', '1–2 projects'],
      },
      {
        stage: 'Entry Role',
        durationMonths: 3,
        items: ['Apply', 'Certifications optional'],
      },
    ],
    relatedCareers: ['c-005', 'c-002'],
  },

  // ─────────── arts ───────────
  {
    id: 'c-007',
    slug: 'ux-designer',
    title: 'UX Designer',
    category: 'arts',
    shortDescription:
      'Design product experiences that are useful, usable, and desirable.',
    description:
      'UX designers research users, sketch flows, prototype, and test. Strong UX designers pair visual craft with research and clear communication.',
    salaryRange: {
      entry: '₹5–10 LPA',
      mid: '₹14–28 LPA',
      senior: '₹40 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 3,
    interests: ['arts', 'tech', 'languages'],
    skills: [
      { name: 'Visual Design', weight: 80 },
      { name: 'Research', weight: 75 },
      { name: 'Prototyping', weight: 85 },
      { name: 'Communication', weight: 70 },
      { name: 'Information Architecture', weight: 70 },
    ],
    roadmap: [
      {
        stage: 'Foundations',
        durationMonths: 6,
        items: ['Figma', 'Design fundamentals', '1 concept app'],
      },
      {
        stage: 'Portfolio',
        durationMonths: 6,
        items: ['2 case studies', 'Brief teardowns'],
      },
      {
        stage: 'Junior Role',
        durationMonths: 3,
        items: ['Apply', 'Interview practice'],
      },
    ],
    relatedCareers: ['c-005', 'c-001'],
  },
  {
    id: 'c-008',
    slug: 'science-communicator',
    title: 'Science Communicator',
    category: 'arts',
    shortDescription:
      'Translate complex science for general audiences through writing, video, and teaching.',
    description:
      'Science communicators bridge research and the public. Work appears in journalism, museums, YouTube, podcasts, and curriculum design.',
    salaryRange: {
      entry: '₹3–7 LPA',
      mid: '₹8–18 LPA',
      senior: '₹25 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'steady',
    difficulty: 2,
    interests: ['science', 'languages', 'arts'],
    skills: [
      { name: 'Writing', weight: 90 },
      { name: 'Storytelling', weight: 85 },
      { name: 'Subject Depth', weight: 70 },
      { name: 'Visual Communication', weight: 65 },
      { name: 'Audience Empathy', weight: 75 },
    ],
    roadmap: [
      {
        stage: 'Practice',
        durationMonths: 4,
        items: ['Start a blog or channel', 'Weekly cadence'],
      },
      {
        stage: 'Build Audience',
        durationMonths: 8,
        items: ['Newsletter / channel', 'Cross-post', 'Network'],
      },
      {
        stage: 'Monetise',
        durationMonths: 6,
        items: ['Freelance', 'Sponsorships', 'Institutional roles'],
      },
    ],
    relatedCareers: ['c-003', 'c-007'],
  },

  // ─────────── health ───────────
  {
    id: 'c-009',
    slug: 'clinical-psychologist',
    title: 'Clinical Psychologist',
    category: 'health',
    shortDescription:
      'Assess and support mental health through evidence-based therapy.',
    description:
      'Clinical psychologists hold a master’s or doctorate in psychology and are licensed to assess, diagnose, and treat mental health conditions.',
    salaryRange: {
      entry: '₹4–8 LPA',
      mid: '₹10–20 LPA',
      senior: '₹30 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 5,
    interests: ['health', 'languages'],
    skills: [
      { name: 'Empathy', weight: 95 },
      { name: 'Active Listening', weight: 90 },
      { name: 'Assessment', weight: 80 },
      { name: 'Evidence-Based Practice', weight: 85 },
      { name: 'Ethics', weight: 80 },
    ],
    roadmap: [
      {
        stage: 'Bachelor’s',
        durationMonths: 36,
        items: ['B.A. / B.Sc. Psychology'],
      },
      {
        stage: "Master's",
        durationMonths: 24,
        items: ['M.A. Clinical Psychology', 'Internship'],
      },
      {
        stage: 'Licensure',
        durationMonths: 12,
        items: ['RCI registration', 'Supervised practice'],
      },
    ],
    relatedCareers: ['c-008'],
  },
  {
    id: 'c-010',
    slug: 'health-data-analyst',
    title: 'Health Data Analyst',
    category: 'health',
    shortDescription:
      'Use data to improve clinical decisions, operations, and population health.',
    description:
      'Health data analysts work with clinical and operational datasets to surface insights. Strong domain familiarity (EHRs, claims, public health) is a differentiator.',
    salaryRange: {
      entry: '₹5–10 LPA',
      mid: '₹12–22 LPA',
      senior: '₹30 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'positive',
    difficulty: 3,
    interests: ['health', 'tech', 'math'],
    skills: [
      { name: 'SQL', weight: 85 },
      { name: 'Statistics', weight: 80 },
      { name: 'Healthcare Domain', weight: 75 },
      { name: 'Visualisation', weight: 70 },
      { name: 'Communication', weight: 65 },
    ],
    roadmap: [
      {
        stage: 'Tooling',
        durationMonths: 5,
        items: ['SQL', 'Python / R', 'A BI tool'],
      },
      {
        stage: 'Healthcare 101',
        durationMonths: 4,
        items: ['EHR / claims basics', 'HIPAA / DISHA'],
      },
      {
        stage: 'Projects',
        durationMonths: 5,
        items: ['Public dataset analyses', '1 portfolio piece'],
      },
    ],
    relatedCareers: ['c-002', 'c-009'],
  },

  // ─────────── engineering ───────────
  {
    id: 'c-011',
    slug: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    category: 'engineering',
    shortDescription:
      'Design and analyse mechanical systems across energy, automotive, and manufacturing.',
    description:
      'Mechanical engineers work across a wide set of industries — automotive, energy, HVAC, robotics. CAD, FEA, and thermodynamics are core skills.',
    salaryRange: {
      entry: '₹4–8 LPA',
      mid: '₹10–20 LPA',
      senior: '₹30 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'steady',
    difficulty: 3,
    interests: ['making', 'science', 'math'],
    skills: [
      { name: 'CAD', weight: 85 },
      { name: 'Thermodynamics', weight: 75 },
      { name: 'Materials', weight: 70 },
      { name: 'FEA', weight: 65 },
      { name: 'Manufacturing', weight: 65 },
    ],
    roadmap: [
      {
        stage: 'Bachelor’s',
        durationMonths: 48,
        items: ['B.E. / B.Tech. Mechanical', 'Internships'],
      },
      {
        stage: 'Specialisation',
        durationMonths: 12,
        items: ['Pick a niche', 'CAD mastery'],
      },
      {
        stage: 'Industry Role',
        durationMonths: 4,
        items: ['Apply', 'GATE optional'],
      },
    ],
    relatedCareers: ['c-012'],
  },
  {
    id: 'c-012',
    slug: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'engineering',
    shortDescription:
      'Plan, design, and oversee construction of infrastructure — roads, bridges, buildings, water systems.',
    description:
      'Civil engineers shape the built environment. The work spans design, project management, site supervision, and increasingly, sustainability analysis.',
    salaryRange: {
      entry: '₹4–8 LPA',
      mid: '₹10–22 LPA',
      senior: '₹32 LPA+',
      currency: 'INR',
    },
    growthOutlook: 'steady',
    difficulty: 3,
    interests: ['making', 'science'],
    skills: [
      { name: 'Structural Analysis', weight: 85 },
      { name: 'Project Management', weight: 75 },
      { name: 'AutoCAD / Revit', weight: 75 },
      { name: 'Surveying', weight: 65 },
      { name: 'Sustainability', weight: 60 },
    ],
    roadmap: [
      {
        stage: 'Bachelor’s',
        durationMonths: 48,
        items: ['B.E. Civil', 'Internships'],
      },
      {
        stage: 'Licensure',
        durationMonths: 12,
        items: ['Engineer-in-training', 'Site exposure'],
      },
      {
        stage: 'Specialise',
        durationMonths: 24,
        items: ['Structures / Transportation / Environmental'],
      },
    ],
    relatedCareers: ['c-011'],
  },
];

export const CATEGORIES = [
  { value: 'technology',  label: 'Technology'  },
  { value: 'science',     label: 'Science'     },
  { value: 'business',    label: 'Business'    },
  { value: 'arts',        label: 'Arts'        },
  { value: 'health',      label: 'Health'      },
  { value: 'engineering', label: 'Engineering' },
];
