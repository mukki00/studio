'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, Briefcase, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '#about', label: 'About', icon: User },
  { href: '#projects', label: 'Projects', icon: Briefcase },
  { href: '#blog', label: 'Blog', icon: FileText },
  { href: '#contact', label: 'Contact', icon: Send },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Adjust threshold as needed
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);
  
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={(e) => handleScrollTo(e, item.href)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${activeSection === item.href.substring(1) ? 'bg-primary/20 text-accent' : 'text-foreground hover:text-accent hover:bg-primary/10'}
            ${mobile ? 'w-full text-base' : ''}
          `}
          aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" onClick={(e) => handleScrollTo(e, '#about')} className="text-2xl font-bold text-accent font-headline">
            Mohammedh Muksith
          </Link>
          <nav className="hidden md:flex space-x-2">
            <NavLinks />
          </nav>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-accent" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-accent font-headline">Menu</h2>
                   <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                     <X className="h-6 w-6 text-accent" />
                     <span className="sr-only">Close menu</span>
                   </Button>
                </div>
                <nav className="flex flex-col space-y-3">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
