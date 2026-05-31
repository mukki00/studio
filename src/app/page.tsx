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

      {/* ── FULL-PAGE SCATTERED PALESTINIAN FLAGS ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {([
          { left: '3%',   top: '4%',   rotate: -10, delay: '0s',    size: 44, opacity: 0.18 },
          { left: '91%',  top: '2%',   rotate:   7, delay: '1.2s',  size: 36, opacity: 0.15 },
          { left: '47%',  top: '7%',   rotate:  -4, delay: '0.6s',  size: 30, opacity: 0.12 },
          { left: '76%',  top: '11%',  rotate:  12, delay: '2.1s',  size: 40, opacity: 0.16 },
          { left: '14%',  top: '15%',  rotate:  -7, delay: '0.9s',  size: 34, opacity: 0.14 },
          { left: '62%',  top: '19%',  rotate:   5, delay: '1.7s',  size: 48, opacity: 0.20 },
          { left: '88%',  top: '23%',  rotate: -13, delay: '0.3s',  size: 32, opacity: 0.13 },
          { left: '28%',  top: '27%',  rotate:   9, delay: '2.4s',  size: 38, opacity: 0.17 },
          { left: '5%',   top: '32%',  rotate:  -5, delay: '1.0s',  size: 42, opacity: 0.15 },
          { left: '53%',  top: '35%',  rotate:  14, delay: '0.5s',  size: 30, opacity: 0.12 },
          { left: '79%',  top: '40%',  rotate:  -8, delay: '1.9s',  size: 46, opacity: 0.19 },
          { left: '20%',  top: '44%',  rotate:   3, delay: '0.7s',  size: 36, opacity: 0.14 },
          { left: '40%',  top: '50%',  rotate: -11, delay: '2.7s',  size: 34, opacity: 0.13 },
          { left: '93%',  top: '53%',  rotate:   6, delay: '1.4s',  size: 40, opacity: 0.16 },
          { left: '10%',  top: '58%',  rotate:  -3, delay: '0.2s',  size: 28, opacity: 0.11 },
          { left: '66%',  top: '61%',  rotate:  10, delay: '2.0s',  size: 44, opacity: 0.18 },
          { left: '35%',  top: '66%',  rotate:  -9, delay: '1.1s',  size: 38, opacity: 0.15 },
          { left: '82%',  top: '70%',  rotate:   4, delay: '0.8s',  size: 32, opacity: 0.13 },
          { left: '2%',   top: '74%',  rotate: -14, delay: '2.3s',  size: 50, opacity: 0.20 },
          { left: '57%',  top: '78%',  rotate:   8, delay: '1.6s',  size: 36, opacity: 0.14 },
          { left: '24%',  top: '82%',  rotate:  -6, delay: '0.4s',  size: 42, opacity: 0.17 },
          { left: '70%',  top: '86%',  rotate:  11, delay: '2.8s',  size: 30, opacity: 0.12 },
          { left: '45%',  top: '90%',  rotate:  -2, delay: '1.3s',  size: 46, opacity: 0.18 },
          { left: '87%',  top: '93%',  rotate:  -7, delay: '0.1s',  size: 34, opacity: 0.14 },
          { left: '12%',  top: '97%',  rotate:  13, delay: '1.8s',  size: 38, opacity: 0.16 },
        ] as { left: string; top: string; rotate: number; delay: string; size: number; opacity: number }[]).map((f, i) => (
          <svg
            key={i}
            viewBox="0 0 40 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              left: f.left,
              top: f.top,
              width: `${f.size}px`,
              height: `${Math.round(f.size * 0.5)}px`,
              transform: `rotate(${f.rotate}deg)`,
              animation: 'float-up-down 5s ease-in-out infinite',
              animationDelay: f.delay,
              opacity: f.opacity,
              borderRadius: '2px',
              overflow: 'hidden',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            }}
          >
            <rect x="0" y="0"      width="40" height="6.67"  fill="#000000" />
            <rect x="0" y="6.67"  width="40" height="6.66"  fill="#EBEBEB" />
            <rect x="0" y="13.33" width="40" height="6.67"  fill="#009639" />
            <polygon points="0,0 16,10 0,20" fill="#CE1126" />
          </svg>
        ))}
      </div>

      <Header />
      <main className="flex-grow" style={{ position: 'relative', zIndex: 1 }}>

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

