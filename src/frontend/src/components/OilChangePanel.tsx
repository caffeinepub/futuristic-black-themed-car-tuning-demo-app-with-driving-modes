import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Droplet } from 'lucide-react';

export default function OilChangePanel() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-card/40 backdrop-blur-md border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Droplet className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Oil Change Status</CardTitle>
              <CardDescription>Current oil condition and maintenance status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-6 rounded-lg bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-12 w-12 text-green-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-1">Oil Status: OK</h3>
              <p className="text-muted-foreground">
                Your oil is in good condition. No action needed at this time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
