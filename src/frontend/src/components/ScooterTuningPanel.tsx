import { useGetScooterTuningConfig, useSaveScooterTuningConfig } from '../hooks/useScooterTuningConfig';
import { ScooterTuning } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TuningSlider from './TuningSlider';
import ErrorBanner from './ErrorBanner';
import { Loader2, Bike } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScooterTuningPanel() {
  const { data: config, isLoading, error, isFetched } = useGetScooterTuningConfig();
  const saveConfig = useSaveScooterTuningConfig();

  const [localConfig, setLocalConfig] = useState<ScooterTuning>({
    maxSpeed: 60,
    acceleration: 5.0,
    handling: 50,
    weight: 100,
  });

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleParamChange = (param: keyof ScooterTuning, value: number) => {
    setLocalConfig((prev) => ({ ...prev, [param]: value }));
  };

  const handleParamCommit = async (param: keyof ScooterTuning, value: number) => {
    const newConfig = { ...localConfig, [param]: value };
    await saveConfig.mutateAsync(newConfig);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load scooter tuning configuration. Please try refreshing the page.';
    return <ErrorBanner message={errorMessage} />;
  }

  if (!isFetched || !config) {
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
              <Bike className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Scooter Performance Settings</CardTitle>
              <CardDescription>Configure your scooter's performance characteristics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveConfig.isError && (
            <ErrorBanner 
              message={saveConfig.error instanceof Error ? saveConfig.error.message : 'Failed to update scooter settings'} 
              className="mb-4"
            />
          )}
          
          <TuningSlider
            label="Max Speed"
            description="Maximum speed limit in kph"
            value={localConfig.maxSpeed}
            onChange={(value) => handleParamChange('maxSpeed', value)}
            onCommit={(value) => handleParamCommit('maxSpeed', value)}
            min={1}
            max={100}
            step={1}
            disabled={saveConfig.isPending}
            isInteger
          />

          <TuningSlider
            label="Acceleration"
            description="Acceleration rate in m/s²"
            value={localConfig.acceleration}
            onChange={(value) => handleParamChange('acceleration', value)}
            onCommit={(value) => handleParamCommit('acceleration', value)}
            min={0.1}
            max={10}
            step={0.1}
            disabled={saveConfig.isPending}
          />

          <TuningSlider
            label="Handling"
            description="Steering responsiveness and stability"
            value={localConfig.handling}
            onChange={(value) => handleParamChange('handling', value)}
            onCommit={(value) => handleParamCommit('handling', value)}
            min={1}
            max={100}
            step={1}
            disabled={saveConfig.isPending}
            isInteger
          />

          <TuningSlider
            label="Weight"
            description="Vehicle weight in kg (affects performance)"
            value={localConfig.weight}
            onChange={(value) => handleParamChange('weight', value)}
            onCommit={(value) => handleParamCommit('weight', value)}
            min={1}
            max={200}
            step={1}
            disabled={saveConfig.isPending}
            isInteger
          />
        </CardContent>
      </Card>
    </div>
  );
}
