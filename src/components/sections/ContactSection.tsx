
'use client';

import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function ContactSection() {
  return (
    <Section 
      id="contact" 
      title="Get In Touch"
      subtitle="Have a project in mind, a question, or just want to say hi? I'd love to hear from you!"
      className="bg-primary/5"
    >
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-accent">Contact Me</CardTitle>
            <CardDescription>
              The best way to reach me is through email or LinkedIn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="mailto:mohammedhmuksith@gmail.com">
                <Mail className="mr-2 h-5 w-5" /> Email Me
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
               <Link href="https://www.linkedin.com/in/mukki00" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
