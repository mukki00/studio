'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
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
    <div className="flex flex-col items-start gap-2">
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleClick}>
        <Link href="/Mohammedh_Muksith_CV.pdf" download="Mohammedh_Muksith_CV.pdf">
          <Download className="mr-2 h-5 w-5" />
          Download CV
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{count.toLocaleString()}</span> visitors have downloaded my CV—feel free to take a look.
      </p>
    </div>
  );
}
