import Section from '@/components/common/Section';
import ProjectCard from '@/components/cards/ProjectCard';

const projects: Array<{
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string[];
  liveLink?: string;
  repoLink?: string;
}> = [
  // Projects will be added here in the future
];

export default function ProjectsSection() {
  return (
    <Section 
      id="projects" 
      title="My Projects"
      subtitle="A Selection of My Recent Work and Personal Endeavors"
      className="bg-primary/5"
    >
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      ) : (
        <div className="text-center text-foreground/70">
          <p>More projects coming soon. Stay tuned!</p>
        </div>
      )}
    </Section>
  );
}
