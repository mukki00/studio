'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { incrementCvDownloads, getCvDownloads } from '@/app/actions';

export default function DownloadCvButton() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const initialCount = await getCvDownloads();
        setCount(initialCount);
      } catch (error) {
        console.error("Failed to fetch CV download count:", error);
        setCount(0); // Default to 0 on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchCount();
  }, []);

  const handleClick = () => {
    // Optimistically update the UI
    setCount(prevCount => (prevCount !== null ? prevCount + 1 : 1));
    // Call the server action to update the database in the background
    incrementCvDownloads();
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleClick}>
        <Link href="/Mohamed_Muksith_Tech_Lead_Resume.pdf" download="Mohamed_Muksith_Tech_Lead_Resume.pdf">
          <Download className="mr-2 h-5 w-5" />
          Download CV
        </Link>
      </Button>
      <p className="text-sm h-5"> {/* Set a fixed height to prevent layout shift */}
        {isLoading ? (
          <span className="flex items-center text-foreground/70">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading downloads...
          </span>
        ) : (
          <>
            <span className="font-bold text-accent">
              {(count ?? 0).toLocaleString()}
            </span>
            <span className="font-semibold text-foreground/90">
              {' '}
              visitors have downloaded my CV—feel free to take a look.
            </span>
          </>
        )}
      </p>
    </div>
  );
}
