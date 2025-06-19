import Section from '@/components/common/Section';
import ProjectCard from '@/components/cards/ProjectCard';

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with Next.js, Stripe integration, and advanced product management.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'online store',
    tags: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    liveLink: '#',
    repoLink: '#',
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates using Firebase and a clean, intuitive UI.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'to-do list',
    tags: ['React', 'Firebase', 'Material UI', 'Node.js'],
    liveLink: '#',
  },
  {
    title: 'Personal Blog CMS',
    description: 'A custom-built CMS for a personal blog, featuring markdown support, SEO optimization, and an admin dashboard.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'writing content',
    tags: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    repoLink: '#',
  },
   {
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets, built with D3.js and React, offering various chart types and filtering options.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'charts graphs',
    tags: ['React', 'D3.js', 'Node.js', 'Express'],
    liveLink: '#',
    repoLink: '#',
  },
];

export default function ProjectsSection() {
  return (
    <Section 
      id="projects" 
      title="My Projects"
      subtitle="A Selection of My Recent Work and Personal Endeavors"
      className="bg-primary/5"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </Section>
  );
}
