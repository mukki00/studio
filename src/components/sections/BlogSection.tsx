import Section from '@/components/common/Section';
import BlogPostCard from '@/components/cards/BlogPostCard';

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
        <div className="text-center text-foreground/70">
          <p>More blog posts coming soon. Stay tuned!</p>
        </div>
      )}
    </Section>
  );
}
