
import { Hand } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/10 text-primary-foreground py-8 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-foreground/80 flex items-center justify-center">
          &copy; {currentYear} Mohammedh Muksith. All rights reserved.
        </p>
        <p className="text-xs text-foreground/60 mt-2 flex items-center justify-center gap-1">
          Free Palestine <Hand className="w-4 h-4 text-green-500" />
        </p>
      </div>
    </footer>
  );
}
