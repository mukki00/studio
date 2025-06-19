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
  return (
    <section id={id} className={`py-16 md:py-24 animate-fade-in ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-4">
            {title && (
              <h2 className={`font-headline text-3xl sm:text-4xl font-bold text-accent mb-3 ${titleClassName}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg text-foreground/80 max-w-2xl mx-auto ${subtitleClassName}`}>
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
