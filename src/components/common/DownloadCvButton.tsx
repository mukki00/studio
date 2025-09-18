
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DownloadCvButton() {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/cv');
        if (res.ok) {
          const json = await res.json();
          setDownloadCount(json.count ?? 0);
        } else {
          setDownloadCount(0);
        }
      } catch (err) {
        console.error('Error fetching download count', err);
        setDownloadCount(0);
      }
    }
    fetchCount();
  }, []);

  const handleDownload = async () => {
    // Optimistically update the UI
    setDownloadCount(prevCount => (prevCount !== null ? prevCount + 1 : 1));
    // Then call the server to increment the count
    try {
      await fetch('/api/cv', { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing download count', err);
    }
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
