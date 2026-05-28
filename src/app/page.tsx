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

        {/* ── HERO SECTION ── Palestinian Theme */}
        <section className="relative hero-wave-bg px-4 pt-20 pb-36 text-center overflow-hidden">

          {/* Ambient green/red glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
            background: 'radial-gradient(ellipse 65% 55% at 18% 35%, rgba(0,150,57,0.10) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at 82% 65%, rgba(206,17,38,0.08) 0%, transparent 60%)',
            animation: 'caustic-shift 10s ease-in-out infinite',
          }} />

          {/* Dome of the Rock silhouette */}
          <div aria-hidden="true" className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2" style={{ width: 'min(500px, 88vw)' }}>
            <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg"
              className="w-full opacity-[0.09] dark:opacity-[0.13]" fill="currentColor">
              {/* Platform */}
              <rect x="10" y="205" width="460" height="15" rx="3"/>
              {/* Terrace */}
              <rect x="40" y="186" width="400" height="19" rx="2"/>
              {/* Octagonal wall */}
              <polygon points="55,186 425,186 405,138 75,138"/>
              {/* Drum */}
              <rect x="168" y="86" width="144" height="52" rx="5"/>
              {/* Dome */}
              <path d="M153,86 Q240,-35 327,86 Z"/>
              {/* Finial post */}
              <rect x="237" y="-35" width="6" height="32" rx="2"/>
              {/* Crescent */}
              <path d="M232,-35 A13,13 0 0,1 250,-35 A9,9 0 0,0 232,-35 Z"/>
              {/* Left minaret */}
              <rect x="57" y="103" width="22" height="83" rx="3"/>
              <rect x="51" y="122" width="34" height="7" rx="1"/>
              <polygon points="57,103 79,103 68,74"/>
              {/* Right minaret */}
              <rect x="401" y="103" width="22" height="83" rx="3"/>
              <rect x="395" y="122" width="34" height="7" rx="1"/>
              <polygon points="401,103 423,103 412,74"/>
            </svg>
          </div>

          {/* Left olive branch */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1 top-16 hidden sm:block"
            style={{ width: '88px', animation: 'olive-sway 7s ease-in-out infinite', transformOrigin: 'bottom center' }}>
            <svg viewBox="0 0 80 170" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-[0.20] dark:opacity-[0.25] text-primary" fill="currentColor">
              <path d="M42,170 Q39,140 34,118 Q28,95 20,70 Q14,50 10,25" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <ellipse cx="30" cy="130" rx="15" ry="6" transform="rotate(-35 30 130)"/>
              <ellipse cx="24" cy="107" rx="13" ry="5.5" transform="rotate(-25 24 107)"/>
              <ellipse cx="19" cy="84"  rx="12" ry="5"   transform="rotate(-15 19 84)"/>
              <ellipse cx="39" cy="148" rx="11" ry="5"   transform="rotate(20 39 148)"/>
              <ellipse cx="14" cy="60"  rx="10" ry="4.5" transform="rotate(-8 14 60)"/>
              <circle cx="34" cy="120" r="3.5"/><circle cx="28" cy="96" r="3"/><circle cx="21" cy="73" r="2.5"/>
            </svg>
          </div>

          {/* Right olive branch (mirrored) */}
          <div aria-hidden="true" className="pointer-events-none absolute right-1 top-16 hidden sm:block"
            style={{ width: '88px', transform: 'scaleX(-1)', animation: 'olive-sway 8s ease-in-out infinite reverse', transformOrigin: 'bottom center' }}>
            <svg viewBox="0 0 80 170" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-[0.20] dark:opacity-[0.25] text-primary" fill="currentColor">
              <path d="M42,170 Q39,140 34,118 Q28,95 20,70 Q14,50 10,25" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <ellipse cx="30" cy="130" rx="15" ry="6" transform="rotate(-35 30 130)"/>
              <ellipse cx="24" cy="107" rx="13" ry="5.5" transform="rotate(-25 24 107)"/>
              <ellipse cx="19" cy="84"  rx="12" ry="5"   transform="rotate(-15 19 84)"/>
              <ellipse cx="39" cy="148" rx="11" ry="5"   transform="rotate(20 39 148)"/>
              <ellipse cx="14" cy="60"  rx="10" ry="4.5" transform="rotate(-8 14 60)"/>
              <circle cx="34" cy="120" r="3.5"/><circle cx="28" cy="96" r="3"/><circle cx="21" cy="73" r="2.5"/>
            </svg>
          </div>

          {/* Floating watermelons */}
          <span aria-hidden="true" className="pointer-events-none select-none absolute left-[5%]  bottom-32 text-3xl" style={{ animation: 'float-up-down 5s ease-in-out infinite' }}>🍉</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute right-[6%] bottom-40 text-2xl" style={{ animation: 'float-up-down 6s ease-in-out infinite', animationDelay: '1.5s' }}>🍉</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute left-[17%] top-10  text-xl opacity-50" style={{ animation: 'float-up-down 7s ease-in-out infinite', animationDelay: '0.8s' }}>🍉</span>
          <span aria-hidden="true" className="pointer-events-none select-none absolute right-[19%] top-14 text-xl opacity-40" style={{ animation: 'float-up-down 5.5s ease-in-out infinite', animationDelay: '2.2s' }}>🍉</span>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">

            {/* Free Palestine badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6
              bg-accent/10 border border-accent/30 text-accent animate-shimmer">
              <span className="text-sm leading-none">🇵🇸</span>
              Free Palestine — From the River to the Sea
            </span>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-[1.05]"
              style={{
                background: 'linear-gradient(135deg, #009639 0%, #e8d5a3 42%, #CE1126 82%, #009639 100%)',
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

            {/* Mahmoud Darwish quote */}
            <blockquote className="glass-card relative rounded-2xl px-6 py-4 mb-6 max-w-md mx-auto text-left overflow-hidden">
              {/* Palestinian flag left border stripe */}
              <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                style={{ background: 'linear-gradient(to bottom, #009639, #ffffff, #CE1126)' }} />
              <p className="pl-3 text-sm italic text-foreground/75 leading-relaxed">
                &ldquo;If the olive trees knew the hands that planted them, their oil would become tears.&rdquo;
              </p>
              <footer className="pl-3 mt-2 text-xs font-bold tracking-wide" style={{ color: '#009639' }}>
                — Mahmoud Darwish
              </footer>
            </blockquote>

            <p className="text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Crafting scalable, enterprise-grade software across cloud-native environments.
              6+ years turning complex requirements into elegant, performant solutions.
            </p>
          </div>

          {/* Palestinian flag strip + wave transition */}
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none">
            {/* Flag strip */}
            <div className="w-full overflow-hidden" style={{ height: '18px', position: 'relative', animation: 'flag-wave 5s ease-in-out infinite' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.72)' }} />
                <div style={{ flex: 1, background: 'rgba(235,235,235,0.72)' }} />
                <div style={{ flex: 1, background: 'rgba(0,150,57,0.72)' }} />
              </div>
              <svg style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: 'auto' }} viewBox="0 0 36 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="0,0 36,9 0,18" fill="rgba(206,17,38,0.85)" />
              </svg>
            </div>
            {/* Wave into page */}
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

