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
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
            <PenLine className="h-7 w-7 text-accent" />
          </div>
          <h3 className="font-headline text-xl font-semibold text-accent">Coming Soon</h3>
          <p className="text-sm text-foreground/65 leading-relaxed">
            I&apos;m working on articles about cloud architecture, full-stack development, and AI. Stay tuned!
          </p>
        </div>
      )}
    </Section>
  );
}
