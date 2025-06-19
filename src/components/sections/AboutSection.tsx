import Image from 'next/image';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, Github } from 'lucide-react';

export default function AboutSection() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="A Glimpse into My World and Professional Journey"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square max-w-md mx-auto md:order-last group overflow-hidden rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
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
        <div className="space-y-6 text-center md:text-left">
          <p className="text-lg text-foreground/90 leading-relaxed">
            Hello! I&apos;m Muksith, a passionate and results-driven [Your Profession/Title] with a knack for creating elegant and efficient solutions. My journey in tech has been fueled by a relentless curiosity and a desire to build things that make a difference.
          </p>
          <p className="text-lg text-foreground/90 leading-relaxed">
            With experience in [mention key skills/technologies like React, Next.js, Node.js, etc.], I thrive in collaborative environments and enjoy tackling complex challenges. When I&apos;m not coding, you can find me [mention a hobby or interest].
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
            <div className="flex gap-4 justify-center md:justify-start">
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
