import { useGetFuelInjectionSettings, useSaveFuelInjectionSettings } from '../hooks/useFuelInjectionSettings';
import { FuelInjectionSettings } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TuningSlider from './TuningSlider';
import ErrorBanner from './ErrorBanner';
import { Loader2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FuelInjectionPanel() {
  const { data: settings, isLoading, error, isFetched } = useGetFuelInjectionSettings();
  const saveSettings = useSaveFuelInjectionSettings();

  const [localSettings, setLocalSettings] = useState<FuelInjectionSettings>({
    amount: 50,
    pressure: 500,
    temperature: 50,
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleParamChange = (param: keyof FuelInjectionSettings, value: number) => {
    setLocalSettings((prev) => ({ ...prev, [param]: value }));
  };

  const handleParamCommit = async (param: keyof FuelInjectionSettings, value: number) => {
    const newSettings = { ...localSettings, [param]: value };
    await saveSettings.mutateAsync(newSettings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load fuel injection settings. Please try refreshing the page.';
    return <ErrorBanner message={errorMessage} />;
  }

  if (!isFetched || !settings) {
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
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Fuel Injection Settings</CardTitle>
              <CardDescription>Configure fuel injection parameters for optimal performance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveSettings.isError && (
            <ErrorBanner 
              message={saveSettings.error instanceof Error ? saveSettings.error.message : 'Failed to update fuel injection settings'} 
              className="mb-4"
            />
          )}
          
          <TuningSlider
            label="Injection Amount"
            description="Amount of fuel injected per cycle"
            value={localSettings.amount}
            onChange={(value) => handleParamChange('amount', value)}
            onCommit={(value) => handleParamCommit('amount', value)}
            min={0}
            max={100}
            step={1}
            disabled={saveSettings.isPending}
            isInteger
          />

          <TuningSlider
            label="Injection Pressure"
            description="Fuel injection pressure in bar"
            value={localSettings.pressure}
            onChange={(value) => handleParamChange('pressure', value)}
            onCommit={(value) => handleParamCommit('pressure', value)}
            min={0}
            max={1000}
            step={10}
            disabled={saveSettings.isPending}
            isInteger
          />

          <TuningSlider
            label="Operating Temperature"
            description="Target fuel temperature in Celsius"
            value={localSettings.temperature}
            onChange={(value) => handleParamChange('temperature', value)}
            onCommit={(value) => handleParamCommit('temperature', value)}
            min={-20}
            max={120}
            step={1}
            disabled={saveSettings.isPending}
            isInteger
          />
        </CardContent>
      </Card>
    </div>
  );
}
