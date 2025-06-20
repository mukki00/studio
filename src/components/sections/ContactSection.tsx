
'use client';

import { useEffect, useActionState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm, type ContactFormState } from '@/app/actions';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().optional().refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
    message: "Invalid phone number format. (e.g., +1234567890)"
  }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

const initialState: ContactFormState = {
  message: '',
  success: false,
};

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" /> Send Message
        </>
      )}
    </Button>
  );
}

export default function ContactSection() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Error!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        form.reset();
      }
    }
  }, [state, toast, form]);
  
  useEffect(() => {
    if (state.issues) {
      state.issues.forEach(issue => {
        const fieldName = issue.toLowerCase().includes("name") ? "name" :
                          issue.toLowerCase().includes("email") ? "email" :
                          issue.toLowerCase().includes("phone") ? "phoneNumber" :
                          issue.toLowerCase().includes("message") ? "message" : null;
        if (fieldName) {
          form.setError(fieldName as keyof ContactFormData, { type: "server", message: issue });
        }
      });
    }
    if (state.fields && !state.success) { 
       Object.entries(state.fields).forEach(([key, value]) => {
         form.setValue(key as keyof ContactFormData, value);
       });
    }
  }, [state.issues, state.fields, state.success, form]);

  const handleValidSubmit = (validatedData: ContactFormData) => {
    const formData = new FormData();
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Section 
      id="contact" 
      title="Get In Touch"
      subtitle="Have a project in mind, a question, or just want to say hi? I'd love to hear from you!"
      className="bg-primary/5"
    >
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-headline text-accent">Contact Me</CardTitle>
            <CardDescription className="text-center">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleValidSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-foreground/90">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm ${form.formState.errors.name ? 'border-destructive' : 'border-input'}`}
                        />
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
                      <FormLabel className="block text-sm font-medium text-foreground/90">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm ${form.formState.errors.email ? 'border-destructive' : 'border-input'}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-foreground/90">Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="+1234567890" 
                          {...field} 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm ${form.formState.errors.phoneNumber ? 'border-destructive' : 'border-input'}`}
                        />
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
                      <FormLabel className="block text-sm font-medium text-foreground/90">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Your message..." 
                          {...field} 
                          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-accent focus:border-accent sm:text-sm ${form.formState.errors.message ? 'border-destructive' : 'border-input'}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <SubmitButton pending={isPending} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
