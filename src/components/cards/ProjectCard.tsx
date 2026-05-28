import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string[];
  liveLink?: string;
  repoLink?: string;
  clickCount?: number;
  onLiveLinkClick?: () => void;
}

export default function ProjectCard({ title, description, imageUrl, tags, liveLink, repoLink, clickCount = 0, onLiveLinkClick }: ProjectCardProps) {
  return (
    <div className="glass-card card-swim flex flex-col h-full overflow-hidden rounded-2xl">
      {/* Image */}
      <div className="aspect-video relative overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <h3 className="font-headline text-lg font-bold text-accent leading-tight">{title}</h3>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="skill-badge text-xs">{tag}</span>
          ))}
        </div>

        <p className="text-sm text-foreground/75 leading-relaxed flex-grow">{description}</p>

        <div className="flex gap-2 pt-1">
          {liveLink && (
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
              onClick={() => {
                onLiveLinkClick?.();
                window.open(liveLink, '_blank', 'noopener,noreferrer');
              }}
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live Demo
            </Button>
          )}
          {repoLink && (
            <Button asChild variant="outline" size="sm" className="flex-1 border-accent/40 text-accent hover:bg-accent/10 text-xs">
              <Link href={repoLink} target="_blank" rel="noopener noreferrer">
                <Github className="mr-1.5 h-3.5 w-3.5" /> Repo
              </Link>
            </Button>
          )}
        </div>

        {liveLink && clickCount > 0 && (
          <p className="text-center text-xs text-accent/70 border-t border-border/40 pt-2">
            🚀 {clickCount} {clickCount === 1 ? 'visit' : 'visits'} so far
          </p>
        )}
      </div>
    </div>
  );
}
