/** Public profile and links. Replace the reserved URL with your domain before deployment. */
export const site = {
  name: 'Isah Philip',
  initials: 'IP',
  role: 'AI Automation & Systems Integration Engineer',
  email: 'Isahphilip50@gmail.com',
  linkedin: 'https://www.linkedin.com/in/isah-philip',
  github: '',
  url: 'https://isahphilip.github.io',
  base: '/portfolio',
  headline: 'Connect your tools. Simplify your workflows.',
  description: 'Thoughtful AI automation and systems integration. Explore workflow designs that connect business tools, reduce manual handoffs, and make operations easier to run.',
  bio: 'I connect the tools your business already uses and turn disconnected tasks into dependable workflows. My approach starts with understanding how people work, then building systems that are clear, maintainable, and easy to hand over.',
  bioIsDraft: true,
  // Add a real file in public/ and its root-relative path here to show the download.
  resume: '',
  portrait: '',
  tools: ['n8n', 'Make', 'Zapier', 'TypeScript', 'Python', 'REST APIs', 'Webhooks', 'OpenAI API', 'PostgreSQL', 'HubSpot', 'Airtable', 'Notion'],
};
export const contactHref = `mailto:${site.email}?subject=${encodeURIComponent('Let’s connect my workflows')}`;
export const link = (path: string) => `${site.base}${path}`;
export const services = [
  { icon: 'workflow', title: 'Workflow automation', text: 'Turn repetitive handoffs into clear, reliable workflows. From the first trigger to the final follow-up.', tags: 'n8n · Make · Zapier' },
  { icon: 'connect', title: 'Systems integration', text: 'Give your CRM, forms, databases, and business tools a shared language. Keep the right information in sync.', tags: 'APIs · Webhooks · Data sync' },
  { icon: 'spark', title: 'Practical AI systems', text: 'Add useful intelligence to everyday operations, with structured outputs, human review, and sensible guardrails.', tags: 'AI workflows · Classification · Extraction' },
];
