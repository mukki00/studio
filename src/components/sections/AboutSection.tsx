import Link from 'next/link';
import Image from 'next/image';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Briefcase, Cloud, Target } from 'lucide-react';
import DownloadCvButton from '@/components/common/DownloadCvButton';

export default function AboutSection() {
  const coreTechnologies = ['Angular', 'React', 'Vue', 'Node.js', 'Spring Boot', 'PHP (Laravel)', 'GraphQL', 'Docker', 'AWS', 'Azure', 'SQL', 'WebLogic'];
  const devopsCloudSkills = ['CI/CD', 'Monitoring', 'Kubernetes', 'AppDynamics', 'Splunk'];
  const focusAreas = ['Technical Architecture', 'Mentorship', 'Agile PI Planning', 'Team Scaling'];

  return (
    <Section
      id="about"
      title="About Me"
    >
      {/* Hero card: circular photo + tagline */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="shrink-0 relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-accent/30 shadow-xl">
          <Image
            src="/profile_photo.png"
            alt="Mohammedh Muksith - Professional Portrait"
            fill
            className="object-cover object-top"
            priority
            data-ai-hint="professional portrait"
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-headline text-2xl sm:text-3xl font-bold text-accent leading-snug mb-2">
            Building Tomorrow&rsquo;s Software, Today
          </p>
          <p className="text-sm text-foreground/60 uppercase tracking-widest font-medium">
            Tech Lead &nbsp;&middot;&nbsp; 6+ Years &nbsp;&middot;&nbsp; Cloud-native &amp; Enterprise
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mt-5">
            <DownloadCvButton />
            <div className="flex gap-3">
              <Button asChild variant="outline" size="icon" aria-label="LinkedIn Profile" className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50">
                <Link href="https://www.linkedin.com/in/mukki00" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" aria-label="GitHub Profile" className="border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50">
                <Link href="https://github.com/mukki00" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio + Skills grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bio */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            I specialize in building scalable, enterprise-grade software across cloud-native and hybrid environments. My expertise spans front-end frameworks like Angular, React, and Vue, as well as robust back-end systems using Node.js, Spring Boot, and Laravel.
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            I&apos;ve led high-performing teams, driven Agile delivery, and translated complex business requirements into architecture solutions that balance performance, security, and maintainability.
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            Currently exploring Generative AI, Kubernetes, and LLMs&mdash;open to Technical Architect and Engineering Leadership roles.
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Briefcase className="h-4 w-4" /> Core Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {coreTechnologies.map(skill => (
                <span key={skill} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Cloud className="h-4 w-4" /> DevOps &amp; Cloud
            </h3>
            <div className="flex flex-wrap gap-2">
              {devopsCloudSkills.map(skill => (
                <span key={skill} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Target className="h-4 w-4" /> Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map(area => (
                <span key={area} className="skill-badge">{area}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </Section>
  );
}
