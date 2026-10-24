export const LEARNING_CATEGORIES = Object.freeze([
  { id: 'all', label: 'All topics' },
  { id: 'computer-science', label: 'Computer science' },
  { id: 'programming', label: 'Programming' },
  { id: 'web-development', label: 'Web development' },
  { id: 'developer-workflow', label: 'Developer workflow' },
]);

// These entries link to official provider pages. Pathlight does not copy or
// redistribute their lessons. License notes below describe the linked source;
// always follow the provider's current terms and any notices on individual pages.
export const LEARNING_RESOURCES = Object.freeze([
  Object.freeze({
    id: 'cs50x-2026',
    title: 'CS50x: Introduction to Computer Science',
    provider: 'Harvard University',
    summary: 'A broad introduction to computational thinking, algorithms, data structures, C, Python, SQL, and web programming. Work through the course at your own pace.',
    category: 'computer-science',
    level: 'Beginner',
    format: 'OpenCourseWare course',
    access: 'Free to take; optional certificate paths may cost extra',
    url: 'https://cs50.harvard.edu/x/',
    sourceUrl: 'https://cs50.harvard.edu/x/',
    sourceLabel: 'Official CS50x course',
    licenseLabel: 'Provider course terms; linked only, not republished',
    licenseUrl: 'https://cs50.harvard.edu/x/faqs/#can-i-teach-this-course-to-my-students',
    licenseNote: 'Course materials may have their own notices and terms. Pathlight links to the source and does not reproduce CS50 content.',
    tags: ['algorithms', 'data structures', 'C', 'Python', 'SQL', 'web'],
    reviewedOn: '2026-10-25',
  }),
  Object.freeze({
    id: 'mdn-getting-started',
    title: 'Getting started with web development',
    provider: 'MDN Web Docs',
    summary: 'Begin with environment setup, your first website, and web standards before moving into the core HTML, CSS, and JavaScript modules.',
    category: 'web-development',
    level: 'Beginner',
    format: 'Structured documentation modules',
    access: 'Free to read',
    url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started',
    sourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started',
    sourceLabel: 'Official MDN learning modules',
    licenseLabel: 'Documentation: CC BY-SA 2.5 or later, unless otherwise noted',
    licenseUrl: 'https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Attrib_copyright_license',
    licenseNote: 'MDN documents that licenses can vary by content type. Pathlight links to the original page and does not copy MDN text, examples, or media.',
    tags: ['HTML', 'CSS', 'JavaScript', 'browser', 'web standards'],
    reviewedOn: '2026-10-25',
  }),
  Object.freeze({
    id: 'python-tutorial',
    title: 'The Python Tutorial',
    provider: 'Python Software Foundation',
    summary: 'Learn core Python language features, control flow, data structures, modules, input/output, errors, and classes from the official tutorial.',
    category: 'programming',
    level: 'Beginner to intermediate',
    format: 'Official language documentation',
    access: 'Free to read',
    url: 'https://docs.python.org/3/tutorial/',
    sourceUrl: 'https://docs.python.org/3/tutorial/',
    sourceLabel: 'Official Python documentation',
    licenseLabel: 'PSF License Version 2; code examples also dual-licensed under Zero-Clause BSD',
    licenseUrl: 'https://docs.python.org/3/license.html',
    licenseNote: 'The Python documentation describes the license terms and notes that some incorporated material may use different licenses. Pathlight links only.',
    tags: ['Python', 'syntax', 'functions', 'data structures', 'programming'],
    reviewedOn: '2026-10-25',
  }),
  Object.freeze({
    id: 'mit-missing-semester',
    title: 'The Missing Semester of Your CS Education',
    provider: 'MIT',
    summary: 'Practical lessons on the command line, shell tools, editors, version control, debugging, and other tools used in everyday computing.',
    category: 'developer-workflow',
    level: 'Beginner to intermediate',
    format: 'Course notes, exercises, and recordings',
    access: 'Public course materials',
    url: 'https://missing.csail.mit.edu/',
    sourceUrl: 'https://missing.csail.mit.edu/',
    sourceLabel: 'Official MIT course site',
    licenseLabel: 'CC BY-NC-SA 4.0',
    licenseUrl: 'https://missing.csail.mit.edu/license/',
    licenseNote: 'The course license includes attribution, non-commercial, and share-alike conditions. Pathlight links to the original material and does not rehost it.',
    tags: ['command line', 'shell', 'Git', 'debugging', 'developer tools'],
    reviewedOn: '2026-10-25',
  }),
  Object.freeze({
    id: 'github-skills-intro',
    title: 'Introduction to GitHub',
    provider: 'GitHub Skills',
    summary: 'Practice the core GitHub workflow with an interactive learning course for creating a repository, making changes, and collaborating.',
    category: 'developer-workflow',
    level: 'Beginner',
    format: 'Interactive course',
    access: 'Free interactive course',
    url: 'https://skills.github.com/',
    sourceUrl: 'https://skills.github.com/',
    sourceLabel: 'Official GitHub Skills catalogue',
    licenseLabel: 'Provider terms; linked only, not republished',
    licenseUrl: 'https://docs.github.com/en/site-policy/github-terms/github-terms-of-service',
    licenseNote: 'Pathlight links to GitHub-hosted lessons and does not copy lesson text or code. Use the provider terms and notices shown with each resource.',
    tags: ['Git', 'GitHub', 'repositories', 'commits', 'collaboration'],
    reviewedOn: '2026-10-25',
  }),
]);

const VALID_STATUSES = new Set(['all', 'completed', 'incomplete']);

export function filterLearningResources(
  resources = LEARNING_RESOURCES,
  { query = '', category = 'all', status = 'all', completedIds = [] } = {},
) {
  const search = typeof query === 'string' ? query.trim().toLocaleLowerCase() : '';
  const completed = new Set(Array.isArray(completedIds) ? completedIds : []);
  const activeStatus = VALID_STATUSES.has(status) ? status : 'all';

  return resources.filter((resource) => {
    const isCompleted = completed.has(resource.id);
    if (category !== 'all' && resource.category !== category) return false;
    if (activeStatus === 'completed' && !isCompleted) return false;
    if (activeStatus === 'incomplete' && isCompleted) return false;
    if (!search) return true;

    const searchable = [
      resource.title,
      resource.provider,
      resource.summary,
      resource.category,
      resource.level,
      resource.format,
      ...(Array.isArray(resource.tags) ? resource.tags : []),
    ].join(' ').toLocaleLowerCase();
    return searchable.includes(search);
  });
}

export function getLearningProgress(resources = LEARNING_RESOURCES, completedIds = []) {
  const ids = new Set(resources.map((resource) => resource.id));
  const completed = new Set(
    (Array.isArray(completedIds) ? completedIds : []).filter((id) => ids.has(id)),
  );
  const total = resources.length;

  return {
    completed: completed.size,
    total,
    remaining: total - completed.size,
    percentage: total === 0 ? 0 : Math.round((completed.size / total) * 100),
  };
}
