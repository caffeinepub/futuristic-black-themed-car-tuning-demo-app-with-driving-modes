import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface TuningSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  isInteger?: boolean;
}

export default function TuningSlider({
  label,
  description,
  value,
  onChange,
  onCommit,
  min,
  max,
  step,
  disabled,
  isInteger = false,
}: TuningSliderProps) {
  const displayValue = isInteger ? value.toFixed(0) : value.toFixed(1);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-foreground font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-cyan-400 tabular-nums min-w-[4rem] text-right">
            {displayValue}
          </span>
          <span className="text-xs text-muted-foreground">/ {max}</span>
        </div>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          onValueCommit={(values) => onCommit(values[0])}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="cursor-pointer"
        />
        
        {/* Visual indicator bars */}
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: 11 }).map((_, i) => {
            const threshold = (i / 10) * max;
            const isActive = value >= threshold;
            return (
              <div
                key={i}
                className={`h-1 w-1 rounded-full transition-colors ${
                  isActive ? 'bg-cyan-400' : 'bg-muted/30'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
