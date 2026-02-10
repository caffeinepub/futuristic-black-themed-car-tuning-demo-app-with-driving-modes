import { useGetTuningConfig, useUpdateDriveMode, useUpdateTuningParameters } from '../hooks/useTuningConfig';
import { DriveMode, TuningParameters } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ModeSelector from './ModeSelector';
import TuningSlider from './TuningSlider';
import ErrorBanner from './ErrorBanner';
import { Loader2, Gauge, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CarTuningPanel() {
  const { data: config, isLoading, error, isFetched } = useGetTuningConfig();
  const updateMode = useUpdateDriveMode();
  const updateParams = useUpdateTuningParameters();

  const [localParams, setLocalParams] = useState<TuningParameters>({
    suspensionStiffness: 5.0,
    steeringSensitivity: 5.0,
    throttleResponse: 5.0,
    brakeBias: 5.0,
  });

  useEffect(() => {
    if (config?.tuningParams) {
      setLocalParams(config.tuningParams);
    }
  }, [config]);

  const handleModeChange = async (mode: DriveMode) => {
    await updateMode.mutateAsync(mode);
  };

  const handleParamChange = (param: keyof TuningParameters, value: number) => {
    setLocalParams((prev) => ({ ...prev, [param]: value }));
  };

  const handleParamCommit = async (param: keyof TuningParameters, value: number) => {
    const newParams = { ...localParams, [param]: value };
    await updateParams.mutateAsync(newParams);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load tuning configuration. Please try refreshing the page.';
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
      {/* Mode Selector Card */}
      <Card className="bg-card/40 backdrop-blur-md border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Gauge className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Drive Mode</CardTitle>
              <CardDescription>Select your preferred driving profile</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {updateMode.isError && (
            <ErrorBanner 
              message={updateMode.error instanceof Error ? updateMode.error.message : 'Failed to update drive mode'} 
              className="mb-4"
            />
          )}
          <ModeSelector
            currentMode={config.driveMode}
            onModeChange={handleModeChange}
            disabled={updateMode.isPending}
          />
        </CardContent>
      </Card>

      {/* Tuning Parameters Card */}
      <Card className="bg-card/40 backdrop-blur-md border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-cyan-400">Tuning Parameters</CardTitle>
              <CardDescription>Fine-tune your vehicle's performance characteristics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {updateParams.isError && (
            <ErrorBanner 
              message={updateParams.error instanceof Error ? updateParams.error.message : 'Failed to update parameters'} 
              className="mb-4"
            />
          )}
          
          <TuningSlider
            label="Suspension Stiffness"
            description="Adjust ride comfort vs handling response"
            value={localParams.suspensionStiffness}
            onChange={(value) => handleParamChange('suspensionStiffness', value)}
            onCommit={(value) => handleParamCommit('suspensionStiffness', value)}
            min={0}
            max={10}
            step={0.1}
            disabled={updateParams.isPending}
          />

          <TuningSlider
            label="Steering Sensitivity"
            description="Control steering response and feedback"
            value={localParams.steeringSensitivity}
            onChange={(value) => handleParamChange('steeringSensitivity', value)}
            onCommit={(value) => handleParamCommit('steeringSensitivity', value)}
            min={0}
            max={10}
            step={0.1}
            disabled={updateParams.isPending}
          />

          <TuningSlider
            label="Throttle Response"
            description="Adjust acceleration sensitivity"
            value={localParams.throttleResponse}
            onChange={(value) => handleParamChange('throttleResponse', value)}
            onCommit={(value) => handleParamCommit('throttleResponse', value)}
            min={0}
            max={10}
            step={0.1}
            disabled={updateParams.isPending}
          />

          <TuningSlider
            label="Brake Bias"
            description="Balance front/rear braking distribution"
            value={localParams.brakeBias}
            onChange={(value) => handleParamChange('brakeBias', value)}
            onCommit={(value) => handleParamCommit('brakeBias', value)}
            min={0}
            max={10}
            step={0.1}
            disabled={updateParams.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
