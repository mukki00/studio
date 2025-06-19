
import Image from 'next/image';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, Github, Briefcase, Cloud, Target, Brain } from 'lucide-react';

export default function AboutSection() {
  const coreTechnologies = ["Angular", "React", "Vue", "Node.js", "Spring Boot", "PHP (Laravel)", "GraphQL", "Docker", "AWS", "Azure", "SQL", "WebLogic"];
  const devopsCloudSkills = ["CI/CD", "Monitoring", "Kubernetes", "AppDynamics", "Splunk"];
  const focusAreas = ["Technical Architecture", "Mentorship", "Agile PI Planning", "Team Scaling"];

  return (
    <Section
      id="about"
      title="About Me"
      subtitle="A Glimpse into My World and Professional Journey"
    >
      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2 relative aspect-square max-w-md mx-auto md:order-last group overflow-hidden rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
          <Image
            src="https://placehold.co/600x600.png"
            alt="Mohammedh Muksith - Professional Portrait"
            width={600}
            height={600}
            className="rounded-lg object-cover"
            data-ai-hint="professional portrait"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="md:col-span-3 space-y-6 text-left">
          <p className="text-lg text-foreground/90 leading-relaxed">
            Hello! I&apos;m Muksith. As a Tech Lead with over 6 years of hands-on experience, I specialize in building scalable, enterprise-grade software across cloud-native and hybrid environments. My expertise spans modern front-end frameworks like Angular, React, and Vue, as well as robust back-end systems using Node.js, Spring Boot, and Laravel.
          </p>
          <p className="text-lg text-foreground/90 leading-relaxed">
            I’ve led high-performing teams, driven Agile delivery, and translated complex business requirements into modern architecture solutions that balance performance, security, and maintainability.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xl font-semibold text-accent mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5" /> Core Technologies:</h3>
              <div className="flex flex-wrap gap-2">
                {coreTechnologies.map(skill => (
                  <span key={skill} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-accent mb-2 flex items-center"><Cloud className="mr-2 h-5 w-5" /> DevOps & Cloud:</h3>
              <div className="flex flex-wrap gap-2">
                {devopsCloudSkills.map(skill => (
                  <span key={skill} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-accent mb-2 flex items-center"><Target className="mr-2 h-5 w-5" /> Focus Areas:</h3>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map(area => (
                  <span key={area} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{area}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-lg text-foreground/90 leading-relaxed pt-2">
            Passionate about continuous learning and innovation—currently exploring Generative AI, Kubernetes, and LLMs. Open to Technical Architect and Engineering Leadership roles where I can drive strategy, guide teams, and deliver impactful solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-start pt-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
            <div className="flex gap-4 justify-start">
              <Button variant="outline" size="icon" aria-label="LinkedIn Profile">
                <Linkedin className="h-5 w-5 text-accent" />
              </Button>
              <Button variant="outline" size="icon" aria-label="GitHub Profile">
                <Github className="h-5 w-5 text-accent" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
