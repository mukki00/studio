import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';

export const metadata: Metadata = {
  title: 'Mohamedh Muksith | Full Stack Developer & Software Architect',
  description: 'Mohamedh Muksith is a Full Stack Developer and Software Architect. Explore my portfolio, projects, blog, and contact information. Find out why I am the top choice for software architecture and full stack development.',
  keywords: ['Muksith', 'Mohamedh Muksith', 'Full Stack Developer', 'Software Architect', 'Tech Lead', 'Portfolio', 'Blog', 'Projects'],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">

        {/* ── HERO SECTION ── Swimming UI: flowing gradient, wave SVG, glass pill */}
        <section className="relative hero-wave-bg px-4 pt-20 pb-28 text-center overflow-hidden">

          {/* Caustic light streak */}
          <div aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(125deg, transparent 35%, hsl(var(--accent) / 0.04) 50%, transparent 65%)',
              animation: 'caustic-shift 8s ease-in-out infinite',
            }}
          />

          {/* Decorative floating bubbles — varied sizes & positions */}
          <span aria-hidden="true" className="pointer-events-none absolute left-[6%]  bottom-14  w-4 h-4 rounded-full bg-accent/25  animate-float" style={{ animationDelay: '0s',    animationDuration: '4.2s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute left-[14%] bottom-28  w-2 h-2 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1.1s',  animationDuration: '3.8s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute left-[22%] bottom-16  w-3 h-3 rounded-full bg-accent/20  animate-float" style={{ animationDelay: '2.3s',  animationDuration: '5.0s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute left-[32%] bottom-36  w-1.5 h-1.5 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '0.6s',  animationDuration: '4.6s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute right-[8%]  bottom-18  w-5 h-5 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1.8s',  animationDuration: '4.8s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute right-[16%] bottom-24  w-2 h-2 rounded-full bg-accent/20  animate-float" style={{ animationDelay: '0.4s',  animationDuration: '3.5s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute right-[26%] bottom-14  w-3 h-3 rounded-full bg-accent/15  animate-float" style={{ animationDelay: '2.7s',  animationDuration: '5.2s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute right-[38%] bottom-32  w-2 h-2 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1.5s',  animationDuration: '4.0s' }} />
          {/* upper floating orbs */}
          <span aria-hidden="true" className="pointer-events-none absolute left-[5%]  top-8   w-6 h-6 rounded-full bg-primary/8 animate-float" style={{ animationDelay: '3.2s',  animationDuration: '6.0s' }} />
          <span aria-hidden="true" className="pointer-events-none absolute right-[7%] top-12  w-4 h-4 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '1.4s',  animationDuration: '5.5s' }} />

          {/* SEO-optimized content */}
          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
            {/* Status pill */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6
              bg-accent/10 border border-accent/30 text-accent animate-shimmer">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
              Available for new opportunities
            </span>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-[1.05]
              bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
              style={{ animation: 'aurora-flow 6s linear infinite' }}
            >
              Mohamedh Muksith
            </h1>

            <h2 className="font-headline text-xl sm:text-2xl font-semibold mb-5 text-foreground/80">
              Full Stack Developer &amp; Software Architect
            </h2>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Crafting scalable, enterprise-grade software across cloud-native environments.
              6+ years turning complex requirements into elegant, performant solutions.
            </p>
          </div>

          {/* Wave SVG at the bottom */}
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-16 sm:h-20"
            >
              <path
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
                className="fill-background opacity-80"
              />
              <path
                d="M0,55 C360,20 720,70 1080,30 C1260,10 1380,50 1440,55 L1440,80 L0,80 Z"
                className="fill-background"
              />
            </svg>
          </div>
        </section>

        <AboutSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

