
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import WhatsAppButton from '@/components/common/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Mohammedh Muksith | Personal Portfolio',
  description: 'A personal portfolio website showcasing projects, blog posts, and skills.',
  keywords: ['portfolio', 'personal website', 'developer', 'projects', 'blog'],
  icons: {
    icon: '/profile.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <div className="clouds-background" aria-hidden="true">
          <div className="cloud-base cloud1"></div>
          <div className="cloud-base cloud2"></div>
          <div className="cloud-base cloud3"></div>
          <div className="cloud-base cloud4"></div>
          <div className="cloud-base cloud5"></div>
        </div>
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
