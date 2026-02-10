import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBannerProps {
  message: string;
  className?: string;
}

export default function ErrorBanner({ message, className }: ErrorBannerProps) {
  return (
    <Alert variant="destructive" className={cn('bg-destructive/10 border-destructive/30', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
