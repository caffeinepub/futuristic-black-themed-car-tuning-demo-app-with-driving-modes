import { Settings, Droplet, Fuel, Bike, Gauge, Zap } from 'lucide-react';
import { useHorizontalDragScroll } from '../hooks/useHorizontalDragScroll';

export interface CarouselMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TopIconCarouselMenuProps {
  items: CarouselMenuItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function TopIconCarouselMenu({ items, selectedId, onSelect }: TopIconCarouselMenuProps) {
  const scrollRef = useHorizontalDragScroll<HTMLDivElement>();

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border-b border-cyan-500/20">
      <div
        ref={scrollRef}
        className="carousel-container flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedId === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-label={item.label}
              aria-current={isSelected ? 'page' : undefined}
              className={`
                flex flex-col items-center justify-center gap-2 px-6 py-3 rounded-lg
                transition-all duration-200 flex-shrink-0 min-w-[100px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                ${
                  isSelected
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-glow'
                    : 'bg-card/40 border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-400/40'
                }
              `}
            >
              <Icon className={`h-6 w-6 ${isSelected ? 'text-cyan-400' : 'text-cyan-500/70'}`} />
              <span className={`text-xs font-medium whitespace-nowrap ${isSelected ? 'text-cyan-400' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const defaultCarouselItems: CarouselMenuItem[] = [
  { id: 'tuning', label: 'Tuning', icon: Settings },
  { id: 'scooter-tuning', label: 'Scooter Tuning', icon: Bike },
  { id: 'oil-change', label: 'Oil Change', icon: Droplet },
  { id: 'fuel-injection', label: 'Fuel Injection', icon: Zap },
  { id: 'fuel', label: 'Fuel', icon: Fuel },
  { id: 'throttle', label: 'Throttle', icon: Gauge },
];
