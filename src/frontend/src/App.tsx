import { useState, useEffect } from 'react';
import CarTuningPanel from './components/CarTuningPanel';
import ScooterTuningPanel from './components/ScooterTuningPanel';
import OilChangePanel from './components/OilChangePanel';
import FuelInjectionPanel from './components/FuelInjectionPanel';
import ThrottlePanel from './components/ThrottlePanel';
import TopIconCarouselMenu, { defaultCarouselItems } from './components/TopIconCarouselMenu';
import SectionPlaceholderPanel from './components/SectionPlaceholderPanel';
import { getSelectedSection, setSelectedSection } from './utils/urlParams';

export default function App() {
  const [selectedSection, setSelectedSectionState] = useState<string>(() => getSelectedSection());

  useEffect(() => {
    setSelectedSection(selectedSection);
  }, [selectedSection]);

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSectionState(sectionId);
  };

  const renderMainContent = () => {
    switch (selectedSection) {
      case 'tuning':
        return <CarTuningPanel />;
      case 'scooter-tuning':
        return <ScooterTuningPanel />;
      case 'oil-change':
        return <OilChangePanel />;
      case 'fuel-injection':
        return <FuelInjectionPanel />;
      case 'throttle':
        return <ThrottlePanel />;
      case 'fuel':
        return <SectionPlaceholderPanel title="Fuel Management" description="Monitor fuel consumption and efficiency" />;
      default:
        return <CarTuningPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/generated/hud-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/car-icon.dim_512x512.png" 
                alt="Car" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-cyan-400 tracking-wider">
                  NEXUS TUNING
                </h1>
                <p className="text-xs text-muted-foreground">Advanced Vehicle Control System</p>
              </div>
            </div>
          </div>
        </header>

        {/* Top Icon Carousel Menu */}
        <TopIconCarouselMenu
          items={defaultCarouselItems}
          selectedId={selectedSection}
          onSelect={handleSectionSelect}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {renderMainContent()}
        </main>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 bg-black/40 backdrop-blur-md mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
