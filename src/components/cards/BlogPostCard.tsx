import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays } from 'lucide-react';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  imageUrl: string;
  imageHint?: string;
  category: string;
}

export default function BlogPostCard({ title, excerpt, date, slug, imageUrl, imageHint, category }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/blog/${slug}`} className="block aspect-video relative overflow-hidden group" aria-label={`Read more about ${title}`}>
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={imageHint || 'article topic'}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <div className="mb-3 flex justify-between items-center text-xs text-muted-foreground">
          <Badge variant="outline" className="border-accent text-accent bg-accent/10">{category}</Badge>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {date}
          </span>
        </div>
        <CardTitle className="text-xl lg:text-2xl font-bold mb-3 font-headline">
          <Link href={`/blog/${slug}`} className="hover:text-accent transition-colors">
            {title}
          </Link>
        </CardTitle>
        <p className="text-foreground/80 text-sm leading-relaxed mb-4">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="text-accent hover:text-accent/90 p-0">
          <Link href={`/blog/${slug}`} aria-label={`Read more about ${title}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
