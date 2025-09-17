import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muksith.com'), // Replace with your actual domain
  title: {
    default: 'Mohammedh Muksith | Personal Portfolio',
    template: '%s | Mohammedh Muksith',
  },
  description: 'A personal portfolio website showcasing projects, blog posts, and skills of Mohammedh Muksith, a Tech Lead.',
  keywords: ['portfolio', 'personal website', 'developer', 'Tech Lead', 'Mohammedh Muksith', 'projects', 'blog', 'Angular', 'React', 'Node.js'],
  creator: 'Mohammedh Muksith',
  authors: [{ name: 'Mohammedh Muksith', url: 'https://muksith.com' }], // Replace with your actual domain
  icons: {
    icon: '/profile.ico',
    shortcut: '/profile.ico',
    apple: '/profile.ico'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Muksith",
              "url": "https://muksith.dev",
              "jobTitle": "Tech Lead | Full Stack Engineer",
              "sameAs": [
                "https://www.linkedin.com/in/your-profile",
                "https://github.com/mukki00"
              ]
            }
            `
          }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
