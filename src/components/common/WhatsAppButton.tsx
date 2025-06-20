
'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function WhatsAppButton() {
  const phoneNumber = "94789299383"; // International format without '+' or leading zeros
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-7 w-7" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Chat on WhatsApp</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
