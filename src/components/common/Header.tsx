
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, Briefcase, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/common/ThemeToggle';

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
      { threshold: 0.3 } 
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);
  
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const targetId = href.substring(1); // Remove #
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
          const headerOffset = 80; // Adjust as needed for your sticky header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
    } else {
      // For Next.js router links or external links, let default behavior happen or use router.push
      // This example focuses on hash links.
      console.warn(`handleScrollTo called with non-hash href: ${href}`);
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={(e) => { 
            handleScrollTo(e, item.href);
            if (mobile) setIsMobileMenuOpen(false);
          }}
          className={cn(
            "flex items-center gap-2 font-medium transition-colors",
            mobile
              ? "w-full text-base px-3 py-3 rounded-md"
              : "px-4 py-2 text-sm rounded-md",
            activeSection === item.href.substring(1)
              ? mobile
                ? "bg-accent text-accent-foreground font-semibold"
                : "bg-accent/10 text-accent font-semibold"
              : mobile
                ? "text-foreground hover:bg-accent/10 hover:text-accent"
                : "text-foreground hover:bg-accent/5 hover:text-accent"
          )}
          aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, '#about')}
            className="relative inline-block hover:opacity-80 transition-opacity group"
          >
            {/* Corner Ribbon */}
            <div
              className="absolute top-0 left-0 origin-top-left z-10 flex items-center justify-center gap-1 transform -rotate-45 translate-x-[-15px] translate-y-[10px] bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-semibold shadow-md whitespace-nowrap"
            >
              <span>Free Palestine</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 100"
                className="w-3 h-auto"
                aria-hidden="true"
                focusable="false"
              >
                <rect width="200" height="33.33" fill="#000000" />
                <rect y="33.33" width="200" height="33.34" fill="#FFFFFF" />
                <rect y="66.67" width="200" height="33.33" fill="#009639" />
                <polygon points="0,0 100,50 0,100" fill="#CE1126" />
              </svg>
            </div>
            
            {/* Name */}
            <span className="block pl-5 pt-3 text-2xl font-bold text-accent font-headline group-hover:text-accent/90">
              Mohammedh Muksith
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex space-x-1">
              <NavLinks />
            </nav>
            <ThemeToggle className="hidden md:flex" />
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-accent/50 text-accent hover:bg-accent/10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-card p-0">
                  <div className="flex justify-between items-center p-6 border-b border-border">
                     <h2 className="text-xl font-bold text-accent font-headline">Menu</h2>
                     <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-accent hover:bg-accent/10">
                       <X className="h-6 w-6" />
                       <span className="sr-only">Close menu</span>
                     </Button>
                  </div>
                  <nav className="flex flex-col space-y-1 p-4">
                    <NavLinks mobile />
                    <div className="pt-4 border-t border-border mt-4">
                       <ThemeToggle className="w-full flex justify-start"/>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
