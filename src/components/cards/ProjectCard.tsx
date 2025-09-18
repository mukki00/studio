import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  tags: string[];
  liveLink?: string;
  repoLink?: string;
}

export default function ProjectCard({ title, description, imageUrl, imageHint, tags, liveLink, repoLink }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={imageHint || 'project technology'}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-bold mb-3 text-accent font-headline">{title}</CardTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-foreground/80 text-sm leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3">
        {liveLink && (
          <Button asChild variant="default" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={liveLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Live Link
            </Link>
          </Button>
        )}
        {repoLink && (
          <Button asChild variant="outline" className="flex-1 border-accent text-accent hover:bg-accent/10 hover:text-accent">
            <Link href={repoLink} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Repository
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
