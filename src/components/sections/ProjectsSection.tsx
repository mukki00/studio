'use client';

import Section from '@/components/common/Section';
import ProjectCard from '@/components/cards/ProjectCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
    title: 'Job Tracker Tool',
    description: 'A tool that extracts jobs from multiple portals to save time and boost efficiency',
    imageUrl: '/images/JobTracker/JobTracker.png',
    imageHint: 'Python, Oracle, GitHub Actions',
    tags: ['Python', 'Oracle', 'GitHub Actions'],
    repoLink: 'https://github.com/mukki00/JobTracker.git',
  },
  {
    title: 'Job Portal',
    description: 'A web application that connects job seekers with employers, featuring job listings, company profiles, and application tracking.',
    imageUrl: '/images/JobPortal/Job_portal.png',
    imageHint: 'Next.js, Node.js, Express, MongoDB, Tailwind CSS',
    tags: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    repoLink: 'https://github.com/mukki00/JobPortal.git',
  },
  {
    title: 'Stock Market Analysis Tool',
    description: 'A web application that provides real-time stock market data, analysis, and visualization tools for investors and traders.',
    imageUrl: '/images/stock_market_analysis/stock_market_analysis.png',
    imageHint: 'React, Node.js, Express, MongoDB, Chart.js',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
  }
];

export default function ProjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // Can scroll left if we're not at the beginning
      setCanScrollLeft(scrollLeft > 5); // Small threshold to account for rounding
      // Can scroll right if there's more content to the right
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Small threshold
    }
  };

  useEffect(() => {
    // Add a small delay to ensure the container is properly rendered
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      // Also check on resize
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Scroll by one item width (25% of container + gap)
      const containerWidth = scrollContainerRef.current.clientWidth;
      const itemWidth = (containerWidth - 32) / 4 + 16; // Account for padding and gap
      scrollContainerRef.current.scrollBy({
        left: -itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Scroll by one item width (25% of container + gap)
      const containerWidth = scrollContainerRef.current.clientWidth;
      const itemWidth = (containerWidth - 32) / 4 + 16; // Account for padding and gap
      scrollContainerRef.current.scrollBy({
        left: itemWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Section 
      id="projects" 
      title="My Projects"
      subtitle="A Selection of My Recent Work and Personal Endeavors"
      className="bg-primary/5"
    >
      {projects.length > 0 ? (
        <div className="relative">
          {/* Left scroll button - only show when there are items to scroll back to */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm shadow-lg border-2 transition-all duration-200 hover:bg-background hover:scale-105 hover:shadow-xl"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Right scroll button - only show when there are more items to scroll to */}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm shadow-lg border-2 transition-all duration-200 hover:bg-background hover:scale-105 hover:shadow-xl"
              onClick={scrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {projects.map((project, index) => (
              <div key={`${index}-${project.title}`} className="flex-none w-[calc(25%-12px)] min-w-[300px] sm:min-w-[280px] lg:min-w-[300px]">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-foreground/70">
          <p>More projects coming soon. Stay tuned!</p>
        </div>
      )}
    </Section>
  );
}
