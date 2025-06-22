'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye } from 'lucide-react';
import { incrementCvDownloads } from '@/app/actions';

interface DownloadCvButtonProps {
  initialCount: number;
}

export default function DownloadCvButton({ initialCount }: DownloadCvButtonProps) {
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    // Optimistically update the UI
    setCount(prevCount => prevCount + 1);
    // Call the server action to update the database in the background
    incrementCvDownloads();
  };

  return (
    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground relative" onClick={handleClick}>
      <Link href="/Mohammedh_Muksith_CV.pdf" download="Mohammedh_Muksith_CV.pdf">
        <Download className="mr-2 h-5 w-5" />
        Download CV
        <Badge variant="secondary" className="ml-3 bg-primary/20 text-primary flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {count.toLocaleString()}
        </Badge>
      </Link>
    </Button>
  );
}
