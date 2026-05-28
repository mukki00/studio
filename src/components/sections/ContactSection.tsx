
'use client';

import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { contactFormSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type ContactFormData = z.infer<typeof contactFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Send Message'}
    </Button>
  );
}

export default function ContactSection() {
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    // noop: state-driven toasts handled after submit
  }, []);

  return (
    <Section
      id="contact"
      title="Get In Touch"
      subtitle="Have a project in mind, a question, or just want to say hi? I'd love to hear from you!"
      className="bg-primary/5"
    >
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h3 className="font-headline text-xl font-bold text-accent mb-1">Send a Message</h3>
          <p className="text-sm text-foreground/60 mb-6">
            Fill out the form below and I&apos;ll get back to you as soon as possible.
          </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (values) => {
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(values),
                    });
                    const json = await res.json();
                    if (res.ok && json.success) {
                      toast({ title: 'Success!', description: json.message });
                      form.reset();
                    } else {
                      toast({ title: 'Error', description: json.message || 'Submission failed', variant: 'destructive' });
                    }
                  } catch (err) {
                    console.error('Contact submit error', err);
                    toast({ title: 'Error', description: 'Something went wrong. Please try again later.', variant: 'destructive' });
                  }
                })}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" className="bg-background/50 border-accent/20 focus:border-accent/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" className="bg-background/50 border-accent/20 focus:border-accent/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project or inquiry..."
                          className="min-h-[120px] bg-background/50 border-accent/20 focus:border-accent/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton />
              </form>
            </Form>
        </div>
      </div>
    </Section>
  );
}
