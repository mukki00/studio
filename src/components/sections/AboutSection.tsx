
import Link from 'next/link';
// Import HTML Img instead of next/image for diagnostics
// import Image from 'next/image';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, Github, Briefcase, Cloud, Target } from 'lucide-react';

export default function AboutSection() {
  const coreTechnologies = ["Angular", "React", "Vue", "Node.js", "Spring Boot", "PHP (Laravel)", "GraphQL", "Docker", "AWS", "Azure", "SQL", "WebLogic"];
  const devopsCloudSkills = ["CI/CD", "Monitoring", "Kubernetes", "AppDynamics", "Splunk"];
  const focusAreas = ["Technical Architecture", "Mentorship", "Agile PI Planning", "Team Scaling"];

  return (
    <Section
      id="about"
      title="About Me"
      // subtitle="“Building Tomorrow’s Software, Today”"
    >
      <blockquote className="highlight-quote">
        <span className="quote-mark">“</span>
        Building Tomorrow’s Software, Today
        <span className="quote-mark">”</span>
      </blockquote>
      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2 relative aspect-square max-w-md mx-auto md:order-last">
          {/* Using standard img tag for diagnostics */}
          <img
            src="../../profile_photo.png" // Adjust path as necessary
            alt="Mohammedh Muksith - Professional Portrait"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        <div className="md:col-span-3 space-y-6 text-left">
          <p className="text-lg text-foreground/90 leading-relaxed">
            As a Tech Lead with over 6 years of hands-on experience, I specialize in building scalable, enterprise-grade software across cloud-native and hybrid environments. My expertise spans modern front-end frameworks like Angular, React, and Vue, as well as robust back-end systems using Node.js, Spring Boot, and Laravel.
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
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="../../public/Mohamed_Muksith_Tech_Lead_Resume.pdf" download="Mohamed_Muksith_Tech_Lead_Resume">
                <Download className="mr-2 h-5 w-5" />
                Download CV
              </Link>
            </Button>
            <div className="flex gap-4 justify-start">
              <Button asChild variant="outline" size="icon" aria-label="LinkedIn Profile">
                <Link href="https://www.linkedin.com/in/mukki00" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 text-accent" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon" aria-label="GitHub Profile">
                <Link href="https://github.com/mukki00" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5 text-accent" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
