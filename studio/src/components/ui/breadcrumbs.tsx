import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-muted-foreground', className)}>
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-3 w-3" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-colors max-w-[150px] truncate">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium max-w-[200px] truncate" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
