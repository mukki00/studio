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
