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
  {
    title: 'Balangoda Grand Mosque Website',
    description: 'Balangoda Grand Mosque - Sheltering communities with compassion and unity. Find prayer times, notices, community updates, and sanda collection services on our website.',
    imageUrl: '/images/balangoda_grand_mosque/Jummah_Masjidh.png',
    imageHint: 'Next.js, Express, Oracle, Tailwind CSS, GitHub Actions',
    tags: ['Next.js', 'Express', 'Oracle', 'Tailwind CSS', 'GitHub Actions'],
    liveLink: 'https://balangodajummahmasjidh.org.lk/',
    repoLink: 'https://github.com/mukki00/masjidh-community-page.git',
  },
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio website to showcase my projects, skills, and experience as a Full Stack Developer and Software Architect.',
    imageUrl: '/profile_photo.png',
    imageHint: 'Next.js, Firebase, Cloud Firestore, MongoDB',
    tags: ['Next.js', 'Firebase', 'Cloud Firestore', 'MongoDB', 'Tailwind CSS', 'GitHub Actions'],
    liveLink: 'https://muksith.dev/',
    repoLink: 'https://github.com/mukki00/studio.git',
  },
  {
    title: 'Job Tracker',
    description: 'A tool that extracts jobs from multiple portals and applies automatically to save time and boost efficiency',
    imageUrl: '/images/JobTracker/JobTracker.png',
    imageHint: 'Python, Oracle, GitHub Actions',
    tags: ['Python', 'Oracle', 'GitHub Actions'],
    repoLink: 'https://github.com/mukki00/JobTracker.git',
  },
  {
    title: 'Stock Market Analysis Tool',
    description: 'A web application that provides real-time stock market data, analysis, and visualization tools for investors and traders.',
    imageUrl: '/images/StockMarketAnalysisTool/StockMarketAnalysisTool.png',
    imageHint: 'React, Node.js, Express, MongoDB, Chart.js',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
  }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
