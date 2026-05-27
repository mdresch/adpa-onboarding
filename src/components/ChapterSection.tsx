import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const ChapterSection: React.FC<ChapterSectionProps> = ({ children, id, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    // Sticky stacking and fade down effect as the next section scrolls over
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        pinSpacing: false, // Allows the next section to scroll over it
      }
    });

    // As you scroll past it, it scales down and fades slightly into the background
    tl.to(content, {
      scale: 0.9,
      opacity: 0.2,
      y: -50,
      ease: 'none'
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id={id} 
      className={`h-screen flex items-center justify-center relative z-10 ${className}`}
    >
      <div ref={contentRef} className="w-full max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
};
