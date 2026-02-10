import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface SectionPlaceholderPanelProps {
  title: string;
  description: string;
}

export default function SectionPlaceholderPanel({ title, description }: SectionPlaceholderPanelProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-card/40 backdrop-blur-md border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This feature is not yet available. Check back soon for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
