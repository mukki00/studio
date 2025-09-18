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
        {/* SEO-optimized introduction */}
        <section className="px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Mohamedh Muksith</h1>
          <h2 className="text-2xl font-semibold mb-4">Full Stack Developer & Software Architect</h2>
          <p className="max-w-2xl mx-auto text-lg">
            Welcome! I am Mohamedh Muksith, a passionate Full Stack Developer and Software Architect. Explore my portfolio, projects, and blog to learn more about my expertise in building scalable software solutions.
          </p>
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
