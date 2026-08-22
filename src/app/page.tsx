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
    <div className="relative flex flex-col min-h-screen bg-background">

      <Header />
      <main className="flex-grow" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO SECTION ── Modern Professional */}
        <section className="relative hero-wave-bg px-4 pt-20 pb-36 text-center overflow-hidden">

          {/* Ambient gradient burst */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
            background: [
              'radial-gradient(ellipse 80% 60% at 50% 0%,    hsl(230 85% 56% / 0.14) 0%, transparent 60%)',
              'radial-gradient(ellipse 65% 55% at 18% 35%,   hsl(230 85% 56% / 0.09) 0%, transparent 65%)',
              'radial-gradient(ellipse 55% 50% at 82% 65%,   hsl(262 72% 56% / 0.08) 0%, transparent 60%)',
              'radial-gradient(ellipse 40% 35% at 50% 100%,  hsl(262 72% 56% / 0.06) 0%, transparent 50%)',
            ].join(','),
            animation: 'caustic-shift 10s ease-in-out infinite',
          }} />

          {/* Ambient pulsing rings */}
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ top: '30%', left: '10%', width: '160px', height: '160px' }}>
            <div className="app-ring w-full h-full" style={{ borderColor: 'hsl(230 85% 56% / 0.20)', animationDelay: '0s' }} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ top: '15%', right: '8%', width: '120px', height: '120px' }}>
            <div className="app-ring w-full h-full" style={{ borderColor: 'hsl(262 72% 56% / 0.18)', animationDelay: '1.5s' }} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ bottom: '20%', right: '15%', width: '90px', height: '90px' }}>
            <div className="app-ring w-full h-full" style={{ borderColor: 'hsl(230 85% 56% / 0.14)', animationDelay: '3s' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">

            {/* Role badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6
              bg-primary/10 border border-primary/30 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Tech Lead · Full Stack Developer
            </span>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-[1.05]"
              style={{
                background: 'linear-gradient(135deg, hsl(230 85% 56%) 0%, hsl(262 72% 62%) 45%, hsl(198 76% 52%) 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'aurora-flow 7s linear infinite',
              }}>
              Mohamedh Muksith
            </h1>

            <h2 className="font-headline text-xl sm:text-2xl font-semibold mb-5 text-foreground/80">
              Full Stack Developer &amp; Software Architect
            </h2>

            {/* Professional tagline card */}
            <blockquote className="glass-card relative rounded-2xl px-6 py-4 mb-6 max-w-md mx-auto text-left overflow-hidden">
              <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ background: 'linear-gradient(to bottom, hsl(230 85% 56%), hsl(262 72% 56%))' }} />
              <p className="pl-3 text-sm italic text-foreground/75 leading-relaxed">
                &ldquo;Clean code, scalable architecture, and user-centric design &mdash; that&rsquo;s the craft I bring to every project.&rdquo;
              </p>
              <footer className="pl-3 mt-2 text-xs font-bold tracking-wide text-primary">
                &mdash; Mohamedh Muksith
              </footer>
            </blockquote>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Crafting scalable, enterprise-grade software across cloud-native environments.
              6+ years turning complex requirements into elegant, performant solutions.
            </p>
          </div>

          {/* Wave into page */}
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12 sm:h-16">
              <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" className="fill-background opacity-80"/>
              <path d="M0,42 C360,15 720,55 1080,22 C1260,8 1380,38 1440,42 L1440,60 L0,60 Z" className="fill-background"/>
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

