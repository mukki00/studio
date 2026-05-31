import Section from '@/components/common/Section';
import BlogPostCard from '@/components/cards/BlogPostCard';
import { PenLine } from 'lucide-react';

const blogPosts: Array<{
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  imageUrl: string;
  imageHint?: string;
  category: string;
}> = [
  // Blog posts will be added here in the future
];

export default function BlogSection() {
  return (
    <Section 
      id="blog" 
      title="Latest Blog Posts"
      subtitle="Insights, Tutorials, and Musings on Technology and Development"
    >
      {blogPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center max-w-lg mx-auto">
          {/* Palestinian theme corner decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute top-4 right-4 flex gap-1.5 opacity-30">
            {[36, 30, 24].map((w, i) => (
              <svg key={i} viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg" style={{ width: `${w}px`, height: `${Math.round(w*0.5)}px`, transform: `rotate(${[-6,4,-8][i]}deg)`, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
                <rect x="0" y="0"      width="40" height="6.67" fill="#000000"/>
                <rect x="0" y="6.67"  width="40" height="6.66" fill="#EBEBEB"/>
                <rect x="0" y="13.33" width="40" height="6.67" fill="#009639"/>
                <polygon points="0,0 16,10 0,20" fill="#CE1126"/>
              </svg>
            ))}
          </div>
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <PenLine className="h-7 w-7 text-accent" />
          </div>
          <h3 className="font-headline text-xl font-semibold text-accent">Coming Soon</h3>
          <p className="text-sm text-foreground/65 leading-relaxed">
            I&apos;m working on articles about cloud architecture, full-stack development, and AI. Stay tuned!
          </p>
          <div aria-hidden="true" className="flex items-center gap-2 opacity-40 mt-1">
            <span className="text-xl">🍉</span>
            <span className="text-xs text-foreground/50 italic">From the River to the Sea</span>
            <span className="text-xl">🕊️</span>
          </div>
        </div>
      )}
    </Section>
  );
}
