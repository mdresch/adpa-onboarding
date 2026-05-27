import React, { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';

interface FloatingTimelineProps {
  sections: { id: string; label: string }[];
}

export const FloatingTimeline: React.FC<FloatingTimelineProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently in view
      let currentSection = sections[0].id;
      let minDistance = Infinity;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Distance from the center of the screen
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      setActiveId(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`, { duration: 1.5, offset: 0 });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center justify-end w-32 cursor-pointer"
            aria-label={`Scroll to ${label}`}
          >
            <span 
              className={`absolute right-6 mr-2 text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'opacity-100 translate-x-0 text-white' 
                  : 'opacity-0 translate-x-4 text-blue-200 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {label}
            </span>
            <div 
              className={`rounded-full transition-all duration-300 shadow-lg shadow-blue-900/50 ${
                isActive 
                  ? 'w-4 h-4 bg-white scale-100' 
                  : 'w-2 h-2 bg-blue-400/50 scale-100 group-hover:scale-150 group-hover:bg-blue-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
