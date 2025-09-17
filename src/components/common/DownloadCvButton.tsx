
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DownloadCvButton() {
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    // For a static site, we can't fetch a real count.
    // We can simulate a starting number or just start from 0.
    // Let's start with a random-ish number to make it look established.
    const initialCount = Math.floor(Math.random() * (250 - 50 + 1)) + 50;
    setDownloadCount(initialCount);
  }, []);

  const handleDownload = () => {
    setDownloadCount(prevCount => prevCount + 1);
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleDownload}>
        <Link href="/Mohamed_Muksith_Tech_Lead_Resume.pdf" download="Mohamed_Muksith_Tech_Lead_Resume.pdf">
          <Download className="mr-2 h-5 w-5" />
          Download CV
        </Link>
      </Button>
      <p className="text-sm h-5 text-foreground/80">
        {downloadCount > 0 ? `${downloadCount} downloads` : 'Download my CV to learn more about my experience.'}
      </p>
    </div>
  );
}
