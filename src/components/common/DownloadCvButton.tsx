
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDownloadCount, incrementDownloadCount } from '@/app/actions';

export default function DownloadCvButton() {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const count = await getDownloadCount();
      setDownloadCount(count);
    }
    fetchCount();
  }, []);

  const handleDownload = async () => {
    // Optimistically update the UI
    setDownloadCount(prevCount => (prevCount !== null ? prevCount + 1 : 1));
    // Then call the server to increment the count
    await incrementDownloadCount();
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleDownload}>
        <Link href="/Mohamed_Muksith_Tech_Lead_Resume.pdf" download="Mohamed_Muksith_Tech_Lead_Resume.pdf">
          <Download className="mr-2 h-5 w-5" />
          Download CV
        </Link>
      </Button>
      <p className="text-sm h-5 font-bold text-accent">
        {downloadCount !== null ? 
            `${downloadCount} visitors have downloaded my CV—feel free to take a look.` 
            : 'Loading download count...'
        }
      </p>
    </div>
  );
}
