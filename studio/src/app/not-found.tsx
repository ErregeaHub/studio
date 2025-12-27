import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertCircle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Oops! The content you are looking for has been moved, deleted, or never existed in the first place.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button asChild className="flex-1 rounded-full font-bold uppercase tracking-wider">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1 rounded-full font-bold uppercase tracking-wider">
          <Link href="/discover">
            <Search className="mr-2 h-4 w-4" />
            Discover
          </Link>
        </Button>
      </div>

      <div className="mt-12">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
          RedRAW Content Platform
        </p>
      </div>
    </div>
  );
}
