import { DriveMode } from '../backend';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Building2, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: DriveMode;
  onModeChange: (mode: DriveMode) => void;
  disabled?: boolean;
}

export default function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  const modes = [
    {
      value: DriveMode.sports,
      label: 'Sports',
      icon: Zap,
      description: 'Maximum performance',
    },
    {
      value: DriveMode.classic,
      label: 'Classic',
      icon: Sparkles,
      description: 'Balanced comfort',
    },
    {
      value: DriveMode.city,
      label: 'City',
      icon: Building2,
      description: 'Efficient cruising',
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs 
        value={currentMode} 
        onValueChange={(value) => onModeChange(value as DriveMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-background/50 border border-cyan-500/20 p-1">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.value;
            return (
              <TabsTrigger
                key={mode.value}
                value={mode.value}
                disabled={disabled}
                className={`
                  relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500
                  data-[state=active]:text-black data-[state=active]:font-semibold
                  transition-all duration-200
                  ${isActive ? 'shadow-lg shadow-cyan-500/50' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-1 py-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs sm:text-sm">{mode.label}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Mode Description */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {modes.find((m) => m.value === currentMode)?.description}
        </p>
      </div>
    </div>
  );
}
