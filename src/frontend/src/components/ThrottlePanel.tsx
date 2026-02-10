import { useGetThrottleSetting, useSaveThrottleSetting } from '../hooks/useThrottleSetting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TuningSlider from './TuningSlider';
import ErrorBanner from './ErrorBanner';
import { Loader2, Gauge } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThrottlePanel() {
  const { data: throttleValue, isLoading, error, isFetched } = useGetThrottleSetting();
  const saveSetting = useSaveThrottleSetting();

  const [localValue, setLocalValue] = useState<number>(5);

  useEffect(() => {
    if (throttleValue !== undefined) {
      setLocalValue(throttleValue);
    }
  }, [throttleValue]);

  const handleValueChange = (value: number) => {
    setLocalValue(value);
  };

  const handleValueCommit = async (value: number) => {
    try {
      await saveSetting.mutateAsync(value);
    } catch (err) {
      // Error is handled by mutation error state
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load throttle setting. Please try refreshing the page.';
    return <ErrorBanner message={errorMessage} />;
  }

  if (!isFetched || throttleValue === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="bg-card/40 backdrop-blur-md border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Throttle Control</CardTitle>
              <CardDescription>Adjust throttle response sensitivity (1-10)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveSetting.isError && (
            <ErrorBanner 
              message={saveSetting.error instanceof Error ? saveSetting.error.message : 'Failed to update throttle setting'} 
              className="mb-4"
            />
          )}
          
          <TuningSlider
            label="Throttle Sensitivity"
            description="Control how responsive the throttle is to input"
            value={localValue}
            onChange={handleValueChange}
            onCommit={handleValueCommit}
            min={1}
            max={10}
            step={1}
            disabled={saveSetting.isPending}
            isInteger
          />
        </CardContent>
      </Card>
    </div>
  );
}
