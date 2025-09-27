import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { PT_Sans } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"
const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muksith.dev'),
  title: {
    default: 'Mohammedh Muksith | Personal Portfolio',
    template: '%s | Mohammedh Muksith',
  },
  description: 'A personal portfolio website showcasing projects, blog posts, and skills of Mohammedh Muksith, a Tech Lead.',
  keywords: ['portfolio', 'personal website', 'developer', 'Tech Lead', 'Mohammedh Muksith', 'projects', 'blog', 'Angular', 'React', 'Node.js'],
  creator: 'Mohammedh Muksith',
  authors: [{ name: 'Mohammedh Muksith', url: 'https://muksith.dev' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicon.ico',
      }
    ]
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
          <Analytics />
          <Toaster />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
