import Section from '@/components/common/Section';
import BlogPostCard from '@/components/cards/BlogPostCard';

const blogPosts = [
  {
    title: 'Mastering Asynchronous JavaScript',
    excerpt: 'Dive deep into Promises, async/await, and common pitfalls in asynchronous JavaScript programming. Essential tips for cleaner code.',
    date: 'October 26, 2023',
    slug: 'mastering-async-javascript',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code screen',
    category: 'JavaScript',
  },
  {
    title: 'The Future of Web Development with AI',
    excerpt: 'Exploring how AI is shaping the future of web development, from automated coding to intelligent user experiences.',
    date: 'November 15, 2023',
    slug: 'future-of-web-dev-ai',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'artificial intelligence',
    category: 'Web Development',
  },
  {
    title: 'A Guide to Building Accessible Web Apps',
    excerpt: 'Practical advice and best practices for creating web applications that are usable by everyone, including people with disabilities.',
    date: 'December 05, 2023',
    slug: 'guide-accessible-web-apps',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'inclusive design',
    category: 'Accessibility',
  },
];

export default function BlogSection() {
  return (
    <Section 
      id="blog" 
      title="Latest Blog Posts"
      subtitle="Insights, Tutorials, and Musings on Technology and Development"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} {...post} />
        ))}
      </div>
    </Section>
  );
}
