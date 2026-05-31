import type React from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function Section({ id, title, subtitle, children, className = '', titleClassName = '', subtitleClassName = '' }: SectionProps) {
  const titleId = title ? `${id}-title` : undefined;

  return (
    <section 
      id={id} 
      className={`ocean-section py-16 md:py-24 animate-fade-in ${className}`}
      aria-labelledby={titleId}
    >
      {/* Drifting ambient orbs — purely decorative */}
      <div aria-hidden="true" className="ocean-orb-1" />
      <div aria-hidden="true" className="ocean-orb-2" />

      {/* Palestinian theme ambient decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {/* Mini flags */}
        {([
          { left: '2%',  top: '12%', w: 36, rotate: -9,  delay: '0s',   opacity: 0.18 },
          { right: '4%', top: '28%', w: 44, rotate:  7,  delay: '1.4s', opacity: 0.15 },
          { left: '55%', top: '68%', w: 30, rotate: -5,  delay: '2.2s', opacity: 0.13 },
          { right:'20%', top: '82%', w: 40, rotate: 12,  delay: '0.8s', opacity: 0.16 },
          { left: '30%', top: '42%', w: 28, rotate: -13, delay: '1.9s', opacity: 0.11 },
        ] as { left?: string; right?: string; top: string; w: number; rotate: number; delay: string; opacity: number }[]).map((f, i) => (
          <svg key={i} viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" style={{
            position: 'absolute', left: f.left, right: f.right, top: f.top,
            width: `${f.w}px`, height: `${Math.round(f.w * 0.5)}px`,
            opacity: f.opacity, transform: `rotate(${f.rotate}deg)`,
            animation: 'float-up-down 6s ease-in-out infinite', animationDelay: f.delay,
            borderRadius: '2px', overflow: 'hidden',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.12))',
          }}>
            <rect x="0" y="0"      width="40" height="6.67" fill="#000000" />
            <rect x="0" y="6.67"  width="40" height="6.66" fill="#EBEBEB" />
            <rect x="0" y="13.33" width="40" height="6.67" fill="#009639" />
            <polygon points="0,0 16,10 0,20" fill="#CE1126" />
          </svg>
        ))}
        {/* Watermelons */}
        <span style={{ position: 'absolute', left: '7%',  top: '58%', fontSize: '1.3rem', opacity: 0.20, animation: 'float-up-down 7s ease-in-out infinite', animationDelay: '1.1s', userSelect: 'none' }}>🍉</span>
        <span style={{ position: 'absolute', right: '9%', top: '18%', fontSize: '1.1rem', opacity: 0.16, animation: 'float-up-down 8s ease-in-out infinite', animationDelay: '2.6s', userSelect: 'none' }}>🍉</span>
        {/* Olive leaf watermark */}
        <div style={{ position: 'absolute', right: '-1%', top: '44%', width: '52px', opacity: 0.07, transform: 'rotate(-20deg) scaleX(-1)', animation: 'olive-sway 10s ease-in-out infinite', transformOrigin: 'bottom center' }}>
          <svg viewBox="0 0 60 130" xmlns="http://www.w3.org/2000/svg" fill="#009639">
            <path d="M30,130 Q27,100 22,76 Q16,50 10,24" stroke="#009639" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="21" cy="96"  rx="13" ry="5"   transform="rotate(-32 21 96)"/>
            <ellipse cx="17" cy="70"  rx="12" ry="4.5" transform="rotate(-22 17 70)"/>
            <ellipse cx="13" cy="46"  rx="11" ry="4"   transform="rotate(-12 13 46)"/>
            <ellipse cx="28" cy="112" rx="10" ry="4"   transform="rotate(18 28 112)"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: '-1%', top: '20%', width: '48px', opacity: 0.07, transform: 'rotate(15deg)', animation: 'olive-sway 11s ease-in-out infinite reverse', transformOrigin: 'bottom center' }}>
          <svg viewBox="0 0 60 130" xmlns="http://www.w3.org/2000/svg" fill="#009639">
            <path d="M30,130 Q27,100 22,76 Q16,50 10,24" stroke="#009639" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="21" cy="96"  rx="13" ry="5"   transform="rotate(-32 21 96)"/>
            <ellipse cx="17" cy="70"  rx="12" ry="4.5" transform="rotate(-22 17 70)"/>
            <ellipse cx="13" cy="46"  rx="11" ry="4"   transform="rotate(-12 13 46)"/>
          </svg>
        </div>
        {/* Keffiyeh-inspired corner accent — top-right */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', opacity: 0.05 }}>
          <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            {[0,8,16,24,32,40,48,56,64,72].map(y => <line key={y} x1="0" y1={y} x2="80" y2={y} stroke="#009639" strokeWidth="1"/>)}
            {[0,8,16,24,32,40,48,56,64,72].map(x => <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#CE1126" strokeWidth="0.5"/>)}
          </svg>
        </div>
      </div>

      <div className="ocean-section-content container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-4">
            {title && (
              <h2 
                id={titleId}
                className={`section-title-wave font-headline text-3xl sm:text-4xl font-bold text-accent mb-3 ${titleClassName}`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg text-foreground/80 max-w-2xl mx-auto mt-4 ${subtitleClassName}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
