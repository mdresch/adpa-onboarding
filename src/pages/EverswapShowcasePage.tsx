import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   CANVAS PARTICLE BACKGROUND (WebGL-style via Canvas 2D)
───────────────────────────────────────────── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(248,247,242,${0.06 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,247,242,${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    window.addEventListener('resize', () => { resize(); init(); });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ background: 'transparent' }}
    />
  );
};

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR (EverSwap-style bottom bar)
───────────────────────────────────────────── */
const ScrollProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/10 z-50">
      <div className="h-full bg-[#F8F7F2]" style={{ width: `${progress * 100}%` }} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   SIDE NAVIGATION DOTS (EverSwap-style)
───────────────────────────────────────────── */
const SideNav: React.FC<{ 
  sections: { id: string; label: string }[]; 
  active: string;
  onSelect: (id: string) => void;
}> = ({ sections, active, onSelect }) => (
  <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5">
    {sections.map(s => (
      <button
        key={s.id}
        onClick={() => onSelect(s.id)}
        title={s.label}
        className="group flex items-center gap-3 cursor-pointer"
      >
        <span className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${active === s.id ? 'text-[#F8F7F2]' : 'text-[#F8F7F2]/40'}`} style={{ fontFamily: 'serif' }}>
          {s.label}
        </span>
        <div className={`w-2 h-2 rounded-full border transition-all duration-300 ${active === s.id ? 'bg-[#F8F7F2] border-[#F8F7F2] scale-125' : 'bg-transparent border-[#F8F7F2]/30 hover:border-[#F8F7F2]/70'}`} />
      </button>
    ))}
  </nav>
);

/* ─────────────────────────────────────────────
   CINEMATIC SECTION — full-screen horizontally pinned, text reveals on scroll
───────────────────────────────────────────── */
const CinematicSection: React.FC<{
  id: string;
  kicker?: string;
  title: string[];
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  active?: boolean;
}> = ({ id, kicker, title, subtitle, description, children, align = 'center', active }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (active && !animated) {
      const words = titleRefs.current.filter(Boolean);
      if (words.length > 0) {
        gsap.fromTo(words,
          { y: 80, opacity: 0, rotateX: -30 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power4.out',
          }
        );
        setAnimated(true);
      }
    }
  }, [active, animated]);

  const alignClass = align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`skew-section w-screen h-screen flex-shrink-0 scroll-snap-align-start flex flex-col justify-center px-12 md:px-24 py-32 relative z-10 ${alignClass}`}
      style={{ perspective: '1000px' }}
    >
      {kicker && (
        <div className="text-[#F8F7F2]/50 text-xs tracking-[0.3em] uppercase mb-8 font-light" style={{ fontFamily: 'serif' }}>
          {kicker}
        </div>
      )}

      <div className="overflow-hidden" style={{ perspective: '600px' }}>
        <h2 className="flex flex-wrap gap-x-5 gap-y-2" style={{ fontFamily: 'serif', letterSpacing: '-0.02em' }}>
          {title.map((word, i) => (
            <span
              key={i}
              ref={el => { titleRefs.current[i] = el; }}
              className="text-[clamp(3rem,8vw,9rem)] font-light text-[#F8F7F2] leading-none block"
              style={{ opacity: 0, display: 'block', transformStyle: 'preserve-3d' }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {subtitle && (
        <div className="mt-8 text-[#F8F7F2]/60 text-xl md:text-2xl font-light max-w-xl" style={{ fontFamily: 'serif' }}>
          {subtitle}
        </div>
      )}

      {description && (
        <p className="mt-6 text-[#F8F7F2]/40 text-base md:text-lg max-w-lg leading-relaxed font-light">
          {description}
        </p>
      )}

      {children}
    </section>
  );
};

/* ─────────────────────────────────────────────
   TYPEWRITER — classic cursor, letter by letter
───────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';

const Typewriter: React.FC<{ text: string; delay?: number; speed?: number }> = ({ text, delay = 0, speed = 80 }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, delay, speed]);

  return (
    <span ref={ref} style={{ fontFamily: 'serif' }}>
      {displayed}
      <span className={`inline-block w-[2px] h-[0.85em] bg-[#F8F7F2] ml-1 align-middle ${done ? 'animate-[blink_1s_step-end_infinite]' : ''}`} />
    </span>
  );
};

/* ─────────────────────────────────────────────
   GSAP CHAR STAGGER — each letter slides up from below
───────────────────────────────────────────── */
const CharStagger: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chars = container.querySelectorAll('.char');
    gsap.fromTo(chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: container, start: 'top 80%', once: true }
      }
    );
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`} style={{ fontFamily: 'serif' }}>
      <div className="flex flex-wrap">
        {text.split('').map((ch, i) => (
          <span key={i} className="char inline-block" style={{ opacity: 0, whiteSpace: ch === ' ' ? 'pre' : 'normal' }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SCRAMBLE — random chars resolve to final word on scroll
───────────────────────────────────────────── */
const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const [display, setDisplay] = useState(() => text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
  const [resolved, setResolved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !resolved) {
        let iteration = 0;
        const maxIter = text.length * 5;
        const interval = setInterval(() => {
          setDisplay(prev =>
            prev.split('').map((_, idx) => {
              if (idx < Math.floor(iteration / 5)) return text[idx];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('')
          );
          iteration++;
          if (iteration > maxIter) { setDisplay(text); setResolved(true); clearInterval(interval); }
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [text, resolved]);

  return (
    <div ref={ref} className={`font-mono tracking-[0.15em] ${className}`}>
      {display}
    </div>
  );
};

/* ─────────────────────────────────────────────
   3D MATRIX SCENE (React Three Fiber)
───────────────────────────────────────────── */
const Matrix3DObject: React.FC<{ scrollVal: number }> = ({ scrollVal }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  // Generate orbital particles
  const pointsPositions = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 1.8 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08 + scrollVal * 1.5;
      groupRef.current.rotation.x = t * 0.03;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.25;
      coreRef.current.rotation.x = t * 0.12;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.12;
      outerRef.current.rotation.z = -t * 0.08;
    }
  });

  // Scale object based on scrollVal factor (bell curve peaking in the middle)
  const objectScale = useMemo(() => {
    const factor = Math.sin(scrollVal * Math.PI);
    return 1.0 + factor * 1.2;
  }, [scrollVal]);

  return (
    <group ref={groupRef} scale={[objectScale, objectScale, objectScale]}>
      {/* Core Mesh - Dodecahedron */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial 
          color="#F8F7F2" 
          wireframe 
          transparent 
          opacity={0.35 + scrollVal * 0.45} 
        />
      </mesh>

      {/* Outer Wireframe Mesh - Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshBasicMaterial 
          color="#F8F7F2" 
          wireframe 
          transparent 
          opacity={0.12 + scrollVal * 0.25} 
        />
      </mesh>

      {/* Outer glowing nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointsPositions.length / 3}
            args={[pointsPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.035} 
          color="#F8F7F2" 
          transparent 
          opacity={0.35 + scrollVal * 0.45} 
        />
      </points>

      {/* Orbiting rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.4, 0.007, 8, 64]} />
        <meshBasicMaterial color="#F8F7F2" transparent opacity={0.15 + scrollVal * 0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[1.6, 0.005, 8, 64]} />
        <meshBasicMaterial color="#F8F7F2" transparent opacity={0.1 + scrollVal * 0.15} />
      </mesh>
    </group>
  );
};

const Matrix3DCanvas: React.FC<{ scrollVal: number }> = ({ scrollVal }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 rounded-full overflow-hidden transition-opacity duration-[1.2s] ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <Canvas camera={{ position: [0, 0, 3.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <Matrix3DObject scrollVal={scrollVal} />
      </Canvas>
    </div>
  );
};

/* ─────────────────────────────────────────────
   LETTER REVEAL SECTION — full cinematic screen
───────────────────────────────────────────── */
const LetterRevealSection: React.FC = () => (
  <section id="letters" className="w-screen h-screen flex-shrink-0 scroll-snap-align-start flex flex-col justify-center px-12 md:px-24 py-32 relative z-10 gap-8 md:gap-12 overflow-hidden">
    <div className="text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase font-light" style={{ fontFamily: 'serif' }}>
      Letter by Letter
    </div>

    {/* 1 — Typewriter */}
    <div className="flex flex-col gap-4">
      <div className="text-[#F8F7F2]/30 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'serif' }}>I — Typewriter</div>
      <div className="text-[clamp(2rem,5vw,5rem)] font-light text-[#F8F7F2] leading-none">
        <Typewriter text="Governance at Peak." speed={70} />
      </div>
      <div className="text-[clamp(1rem,2vw,1.8rem)] font-light text-[#F8F7F2]/40 leading-none mt-2">
        <Typewriter text="Maturity. Clarity. Direction." delay={1800} speed={55} />
      </div>
    </div>

    {/* 2 — GSAP per-character stagger */}
    <div className="flex flex-col gap-4">
      <div className="text-[#F8F7F2]/30 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'serif' }}>II — GSAP Character Stagger</div>
      <CharStagger
        text="Transform Your Portfolio"
        className="text-[clamp(2rem,5vw,5rem)] font-light text-[#F8F7F2] leading-none"
      />
      <CharStagger
        text="One document upload. Infinite clarity."
        className="text-[clamp(0.9rem,1.8vw,1.5rem)] font-light text-[#F8F7F2]/40 leading-relaxed mt-2"
      />
    </div>

    {/* 3 — Scramble */}
    <div className="flex flex-col gap-4">
      <div className="text-[#F8F7F2]/30 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'serif' }}>III — Cryptographic Scramble</div>
      <ScrambleText
        text="MATURITY DEFINED"
        className="text-[clamp(2rem,5vw,5rem)] font-light text-[#F8F7F2] leading-none"
      />
      <ScrambleText
        text="ADPA AI ASSESSMENT ENGINE"
        className="text-[clamp(0.85rem,1.5vw,1.2rem)] text-[#F8F7F2]/40 leading-none mt-2"
      />
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   FLOATING IMAGE CAROUSEL
───────────────────────────────────────────── */
const CAROUSEL_IMAGES = [
  {
    url: '/images/Gemini_Generated_Image_7s6vgq7s6vgq7s6v.png',
    title: 'Precision Ledger',
    desc: 'Unifying compliance tracking and validation in real-time.',
    meta: {
      score: '98.5%',
      metric: 'Validation Integrity',
      logs: ['Block Checksum: 0x9f82...284a', 'Authority node status: ACTIVE', 'Sync latency: 12ms', 'Consensus rule: RPAS-Aligned']
    }
  },
  {
    url: '/images/Gemini_Generated_Image_8boi0q8boi0q8boi.png',
    title: 'AI Insights',
    desc: 'Deep extraction algorithms mapping standard frameworks.',
    meta: {
      score: '99.1%',
      metric: 'Extraction Confidence',
      logs: ['Entities parsed: 42 categories', 'Framework map: PMBOK v8', 'Provider: Mistral 7B Orchestrated', 'Inference: 842ms']
    }
  },
  {
    url: '/images/Gemini_Generated_Image_ak8nioak8nioak8n.png',
    title: 'Maturity Scaling',
    desc: 'Visualising progression across the capability maturity model.',
    meta: {
      score: 'Level 3.4',
      metric: 'Portfolio Maturity Index',
      logs: ['Governance domain score: 86/100', 'Capability gap delta: -4.2%', 'Assessment target: Level 4.0', 'Audited: 2026-05-27']
    }
  },
  {
    url: '/images/Gemini_Generated_Image_dd9cx9dd9cx9dd9c.png',
    title: 'Collaborative Review',
    desc: 'Ensuring seamless workflow validation between peers.',
    meta: {
      score: '3/3 Approved',
      metric: 'Peer Approvals Chain',
      logs: ['PM Approval: menno@adpa.org', 'PMO Lead Signature: VERIFIED', 'Executive Override: BYPASS_NONE', 'Audit log hash: md5_7a9f...']
    }
  },
  {
    url: '/images/Gemini_Generated_Image_j6msjpj6msjpj6ms.png',
    title: 'Decision Portal',
    desc: 'Empowering stakeholders with actionable intelligence dashboards.',
    meta: {
      score: '+$142k',
      metric: 'Governance ROI Delta',
      logs: ['Risk reduction: -32.8%', 'Action items pending: 5 items', 'Executive override state: STABLE', 'Realtime latency: 45ms']
    }
  }
];

const FloatingCarouselSection: React.FC<{ 
  viewportRef: React.RefObject<HTMLDivElement | null>;
  is3DMode: boolean;
}> = ({ viewportRef, is3DMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -350 : 350;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section 
      id="carousel" 
      className="w-screen h-screen flex-shrink-0 scroll-snap-align-start relative z-10 overflow-hidden flex flex-col justify-center px-12 md:px-24 py-32"
      style={{ 
        perspective: '2000px',
        perspectiveOrigin: '50% 50%'
      }}
    >
      {/* 3D Rotatable Viewport Wrapper for the ENTIRE section content */}
      <div
        ref={viewportRef}
        className="w-full h-full flex flex-col justify-center relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Interactive Gallery Kicker (Flipped with perspective) */}
        <div className="relative h-6 mb-4" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="absolute inset-0 text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase font-light backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            Interactive Gallery
          </div>
          <div 
            className="absolute inset-0 text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase font-light backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            Compliance Auditor
          </div>
        </div>

        {/* Header Title and Narrative + controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 relative z-20" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Dual-face Header (Title & Narrative) */}
          <div className="relative w-full max-w-xl h-32 md:h-28" style={{ transformStyle: 'preserve-3d' }}>
            {/* FRONT HEADER */}
            <div 
              className="absolute inset-0 flex flex-col justify-end backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <h2 className="text-[clamp(2rem,4vw,4.5rem)] font-light text-[#F8F7F2] leading-none mb-3" style={{ fontFamily: 'serif' }}>
                Portfolio Twin
              </h2>
              <p className="text-[#F8F7F2]/40 text-sm leading-relaxed font-light">
                Slide and hover over our governance artifacts to inspect structural metadata, extraction logs, and compliance details.
              </p>
            </div>

            {/* BACK HEADER */}
            <div 
              className="absolute inset-0 flex flex-col justify-end backface-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <h2 className="text-[clamp(2rem,4vw,4.5rem)] font-light text-[#F8F7F2] leading-none mb-3" style={{ fontFamily: 'serif' }}>
                Audit Ledger Twin
              </h2>
              <p className="text-[#F8F7F2]/40 text-sm leading-relaxed font-light">
                Live compliance audit track. Hovering over cards lets you inspect validation checkpoints and real-time security logs.
              </p>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4" style={{ transformStyle: 'preserve-3d' }}>
            <div className="text-[#F8F7F2]/30 text-xs tracking-widest font-mono uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              {is3DMode ? '✦ Audit Viewport 180°' : '✦ Portfolio Viewport 0°'}
            </div>

            {/* Nav Arrows (Flipped with perspective) */}
            <div className="relative w-28 h-12" style={{ transformStyle: 'preserve-3d' }}>
              {/* Front Arrows */}
              <div className="absolute inset-0 flex gap-4 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border border-[#F8F7F2]/10 hover:border-[#F8F7F2]/40 text-[#F8F7F2]/60 hover:text-[#F8F7F2] flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border border-[#F8F7F2]/10 hover:border-[#F8F7F2]/40 text-[#F8F7F2]/60 hover:text-[#F8F7F2] flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none stroke-2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* Back Arrows (Reversed direction buttons for back perspective) */}
              <div className="absolute inset-0 flex gap-4 backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {/* Note: scroll directions are inverted since the coordinates are mirrored */}
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border border-[#F8F7F2]/10 hover:border-[#F8F7F2]/40 text-[#F8F7F2]/60 hover:text-[#F8F7F2] flex items-center justify-center transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border border-[#F8F7F2]/10 hover:border-[#F8F7F2]/40 text-[#F8F7F2]/60 hover:text-[#F8F7F2] flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-current fill-none stroke-2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Track */}
        <div 
          id="carousel-cards-track"
          className="flex gap-8 py-16 px-4 select-none relative"
          style={{ 
            willChange: 'transform',
            transformStyle: 'preserve-3d'
          }}
        >
          {CAROUSEL_IMAGES.map((img, i) => {
            const floatDelay = `${i * 0.4}s`;
            const rotAngle = i % 2 === 0 ? '1.5deg' : '-1.5deg';

            return (
              <div
                key={i}
                className="flex-none w-[280px] md:w-[360px] transition-all duration-700 ease-out"
                style={{
                  transform: `rotate(${rotAngle})`,
                  animation: `float-slow 6s ease-in-out infinite alternate`,
                  animationDelay: floatDelay,
                  perspective: '1200px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Card Outer with 3D perspective */}
                <div 
                  className="relative aspect-[3/4] rounded-sm transition-transform duration-[0.8s] preserve-3d cursor-pointer group select-none"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={(e) => {
                    const cardInner = e.currentTarget;
                    cardInner.style.transform = 'rotateY(180deg)';
                  }}
                  onMouseLeave={(e) => {
                    const cardInner = e.currentTarget;
                    cardInner.style.transform = 'rotateY(0deg)';
                  }}
                >
                  {/* FRONT FACE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-sm overflow-hidden bg-zinc-950 border border-[#F8F7F2]/10 hover:border-[#F8F7F2]/30 shadow-2xl backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img 
                      src={img.url} 
                      alt={img.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
                      <div className="text-xs text-[#F8F7F2]/40 uppercase tracking-widest mb-2 font-mono">0{i + 1}</div>
                      <h3 className="text-[#F8F7F2] text-xl font-light mb-2" style={{ fontFamily: 'serif' }}>{img.title}</h3>
                      <p className="text-[#F8F7F2]/50 text-xs leading-relaxed">
                        {img.desc}
                      </p>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-sm overflow-hidden bg-zinc-950/95 border border-[#F8F7F2]/25 shadow-2xl p-8 flex flex-col justify-between backface-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div>
                      <div className="flex justify-between items-center border-b border-[#F8F7F2]/15 pb-4 mb-6">
                        <span className="text-xs text-[#F8F7F2]/30 tracking-widest uppercase font-mono">0{i + 1} / Ledger Info</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      
                      <h3 className="text-[#F8F7F2] text-lg font-light mb-1" style={{ fontFamily: 'serif' }}>{img.title}</h3>
                      <span className="text-xs text-[#F8F7F2]/40 block mb-6">{img.meta.metric}</span>
                      
                      <div className="space-y-3 font-mono text-[10px] text-[#F8F7F2]/60">
                        {img.meta.logs.map((log, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <span className="text-[#F8F7F2]/30">➔</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#F8F7F2]/10 pt-4 flex flex-col items-start gap-1">
                      <span className="text-[10px] text-[#F8F7F2]/30 uppercase tracking-wider font-mono">Current Status Metric</span>
                      <span className="text-3xl font-light text-[#F8F7F2]" style={{ fontFamily: 'serif' }}>{img.meta.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom tiny progress indicator */}
        <div className="w-full max-w-[200px] h-[1px] bg-[#F8F7F2]/10 mt-8 relative self-center overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            id="carousel-progress-fill"
            className="absolute top-0 bottom-0 left-0 bg-[#F8F7F2]/60 w-[30%] h-full"
            style={{ willChange: 'transform' }}
          />
        </div>
      </div>

      {/* Floating animation keyframe styles */}
      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(8px) rotate(-1deg); }
          100% { transform: translateY(-8px) rotate(1deg); }
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export const EverswapShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);

  const SECTIONS = [
    { id: 'hero',        label: 'Start'       },
    { id: 'one-pool',    label: 'One Pool'     },
    { id: 'ai-engine',   label: 'AI Engine'    },
    { id: 'maturity',    label: 'Maturity'     },
    { id: 'letters',     label: 'Letters'      },
    { id: 'carousel',    label: 'Carousel'     },
    { id: 'for-everyone',label: 'For Everyone' },
    { id: 'zoom-showcase', label: 'Zoom Overview' },
    { id: 'results',     label: 'Results'      },
    { id: 'join',        label: 'Begin'        },
    { id: 'sunrise',     label: 'Sunrise'      },
    { id: 'kpis',        label: 'KPIs'         },
    { id: 'morphic-ui',  label: 'Morphic UI'   },
    { id: 'morphic-dashboard', label: 'Morphic Dashboard' },
  ];

  // GSAP Horizontal Pinning and Viewport Rotation
  useEffect(() => {
    const track = horizontalTrackRef.current;
    const container = horizontalContainerRef.current;
    const viewport = viewportRef.current;
    if (!track || !container || !viewport) return;

    // 4 panels = 3 scroll translations of window width
    const scrollLength = container.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        pin: true,
        scrub: true,
        start: 'top top',
        end: () => `+=${scrollLength + 800}`, // extra scroll distance for the cards slide
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setIs3DMode(self.progress > 0.5);
        }
      }
    });

    // Step 1: Slide to panel 2 (Letters)
    tl.to(container, {
      x: -window.innerWidth,
      ease: 'none',
      duration: 1
    });

    // Step 2: Slide to panel 3 (Carousel)
    tl.to(container, {
      x: -window.innerWidth * 2,
      ease: 'none',
      duration: 1
    });

    // Step 3: Slide the inner carousel cards track horizontally
    const cardsTrack = document.getElementById('carousel-cards-track');
    if (cardsTrack) {
      tl.to(cardsTrack, {
        x: () => {
          const cardsScrollLength = cardsTrack.scrollWidth - window.innerWidth + 200;
          return -Math.max(0, cardsScrollLength);
        },
        ease: 'none',
        duration: 1.5
      });
      
      tl.to(viewport, {
        rotateY: 180,
        rotateX: 6,
        scale: 0.95,
        ease: 'none',
        duration: 1.5
      }, '<');
      
      const progressFill = document.getElementById('carousel-progress-fill');
      if (progressFill) {
        tl.to(progressFill, {
          x: '233%',
          ease: 'none',
          duration: 1.5
        }, '<');
      }
    }

    // Step 4: Slide to panel 4 (For Everyone)
    tl.to(container, {
      x: -window.innerWidth * 3,
      ease: 'none',
      duration: 1
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Zoom Section Animation
  useEffect(() => {
    const trigger = document.querySelector('.zoom-section-trigger');
    const target = document.querySelector('.zoom-target');
    const labels = document.querySelectorAll('.zoom-label');
    const revealContent = document.querySelector('.zoom-reveal-content');
    const hideContent = document.querySelectorAll('.zoom-hide-on-deep');
    const titleKicker = document.querySelector('.zoom-title-kicker');
    const title = document.querySelector('.zoom-title');

    if (!trigger || !target) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: true,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setZoomProgress(self.progress);
        }
      }
    });

    // Phase 1: Zoom In
    tl.to(target, {
      scale: 3.5,
      ease: 'power1.inOut',
      duration: 1.5
    });

    tl.to(labels, {
      opacity: 0,
      y: (i) => i === 0 ? -100 : i === 1 ? 100 : 0,
      x: (i) => i === 2 ? -100 : i === 3 ? 100 : 0,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(hideContent, {
      opacity: 0,
      ease: 'power1.inOut',
      duration: 1.0
    }, '<');

    tl.to(revealContent, {
      opacity: 1,
      scale: 0.35, // Adjust for the scale of the outer target (1 / 3.5 is ~0.28)
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(titleKicker, {
      opacity: 0,
      y: -30,
      ease: 'power1.inOut',
      duration: 1.2
    }, '<');

    tl.to(title, {
      opacity: 0,
      y: -50,
      ease: 'power1.inOut',
      duration: 1.2
    }, '<');

    // Phase 2: Stay at peak zoom
    tl.to({}, { duration: 1.0 });

    // Phase 3: Zoom Out
    tl.to(target, {
      scale: 1,
      ease: 'power1.inOut',
      duration: 1.5
    });

    tl.to(labels, {
      opacity: 1,
      x: 0,
      y: 0,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(hideContent, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(revealContent, {
      opacity: 0,
      scale: 0.75,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(titleKicker, {
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    tl.to(title, {
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
      duration: 1.5
    }, '<');

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Scroll-Velocity Skew Effect
  useEffect(() => {
    const sections = document.querySelectorAll('.skew-section');
    if (!sections.length) return;

    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(sections, "skewY", "deg");
    const clamp = gsap.utils.clamp(-6, 6);

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -400);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });

    gsap.set(sections, { transformOrigin: "center center", force3D: true });

    return () => {
      trigger.kill();
    };
  }, []);

  // Sunrise Pinned Section Animation
  useEffect(() => {
    const trigger = document.querySelector('.sunrise-trigger');
    const overlay = document.querySelector('.sunrise-overlay');
    const canvas = document.querySelector('.particle-canvas');
    const textElements = document.querySelectorAll('.sunrise-text');
    const buttons = document.querySelectorAll('.sunrise-btn');

    if (!trigger || !overlay) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: true,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
      }
    });

    // Phase 1: Sunrise glow rises
    tl.to(overlay, {
      opacity: 1,
      ease: 'power1.inOut',
      duration: 2.0
    });

    if (canvas) {
      tl.to(canvas, {
        opacity: 0,
        ease: 'power1.inOut',
        duration: 1.5
      }, '<');
    }

    // Phase 2: Daylight sets in, text turns black
    tl.to(textElements, {
      color: '#0d0d0c',
      ease: 'power1.inOut',
      duration: 2.0
    }, '<0.2');

    tl.to(buttons, {
      color: '#0d0d0c',
      borderColor: 'rgba(13, 13, 12, 0.2)',
      ease: 'power1.inOut',
      duration: 2.0
    }, '<');

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // KPI Vertical Carousel Animation
  useEffect(() => {
    const trigger = document.querySelector('.kpi-trigger');
    const track = document.querySelector('.kpi-vertical-track');
    const cards = document.querySelectorAll('.kpi-card');

    if (!trigger || !track || !cards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: true,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.5}`,
        invalidateOnRefresh: true,
      }
    });

    cards.forEach((_card, index) => {
      if (index === 0) return;

      // Translate the vertical track upwards
      // Note: card aspect ratio / height is translated
      tl.to(track, {
        y: () => {
          // Slide upwards by the card height plus gap
          const gap = 24;
          const slideDistance = -index * (cards[0].clientHeight + gap);
          return slideDistance;
        },
        duration: 1.0,
        ease: 'power1.inOut'
      });

      // Highlight the active card
      tl.to(cards[index], {
        scale: 1.05,
        opacity: 1,
        borderColor: 'rgba(13, 13, 12, 0.4)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)',
        duration: 1.0,
        ease: 'power1.inOut'
      }, '<');

      // Dim the previous card
      tl.to(cards[index - 1], {
        scale: 0.95,
        opacity: 0.25,
        borderColor: 'rgba(13, 13, 12, 0.1)',
        boxShadow: 'none',
        duration: 1.0,
        ease: 'power1.inOut'
      }, '<');
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Morphic UI Rise and Sink Animation
  useEffect(() => {
    const trigger = document.querySelector('.morphic-trigger');
    const cards = document.querySelectorAll('.morphic-card');

    if (!trigger || !cards.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: true,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.0}`,
        invalidateOnRefresh: true,
      }
    });

    // Phase 1: Rise from the canvas
    tl.to(cards, {
      y: 10,
      scale: 0.99,
      opacity: 0.8,
      borderColor: 'rgba(13, 13, 12, 0.03)',
      boxShadow: '6px 6px 12px rgba(13, 13, 12, 0.03), -6px -6px 12px rgba(255, 255, 255, 0.9)',
      stagger: 0.2,
      duration: 1.2,
      ease: 'power2.out'
    });

    // Phase 2: Pop out further, rotate left-to-right, and bounce!
    tl.to(cards, {
      y: -25, // Lift higher for floating feel
      scale: 1.06,
      opacity: 1,
      rotation: (i) => i === 0 ? -3.5 : i === 1 ? 0.5 : 3.5,
      borderColor: 'rgba(13, 13, 12, 0.08)',
      boxShadow: '24px 24px 48px rgba(13, 13, 12, 0.07), -24px -24px 48px rgba(255, 255, 255, 1.0)',
      stagger: 0.15,
      duration: 1.5,
      ease: 'back.out(2.5)' // elastic pop
    });

    // Phase 2.5: Active floating hover (sinusoidal offset wandering while user scrolls)
    tl.to(cards, {
      y: (i) => i % 2 === 0 ? -32 : -18,
      rotation: (i) => i === 0 ? -4.5 : i === 1 ? -0.5 : 4.5,
      duration: 1.5,
      ease: 'sine.inOut'
    });

    tl.to(cards, {
      y: -25,
      rotation: (i) => i === 0 ? -3.5 : i === 1 ? 0.5 : 3.5,
      duration: 1.5,
      ease: 'sine.inOut'
    });

    // Phase 2.75: Macro Zoom In (cards grow and fill the screen, header fades out)
    const header = document.querySelector('.morphic-trigger .morphic-header');
    
    tl.to(cards, {
      scale: 2.3,
      y: 0,
      rotation: 0,
      borderColor: 'rgba(13, 13, 12, 0.15)',
      boxShadow: '40px 40px 80px rgba(13, 13, 12, 0.1), -40px -40px 80px rgba(255, 255, 255, 1.0)',
      stagger: 0.1,
      duration: 1.8,
      ease: 'power2.inOut'
    });

    if (header) {
      tl.to(header, {
        opacity: 0,
        y: -30,
        duration: 1.8,
        ease: 'power2.inOut'
      }, '<');
    }

    // Hold zoomed in
    tl.to({}, { duration: 1.0 });

    // Phase 2.8: Zoom Out (shrink back to floating sizes, header fades in)
    tl.to(cards, {
      scale: 1.06,
      y: -25,
      rotation: (i) => i === 0 ? -3.5 : i === 1 ? 0.5 : 3.5,
      borderColor: 'rgba(13, 13, 12, 0.08)',
      boxShadow: '24px 24px 48px rgba(13, 13, 12, 0.07), -24px -24px 48px rgba(255, 255, 255, 1.0)',
      stagger: 0.1,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    if (header) {
      tl.to(header, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      }, '<');
    }

    // Phase 3: Settle, rotate back straight, and sink back into the canvas
    tl.to(cards, {
      y: 50,
      scale: 0.96,
      opacity: 0,
      rotation: 0,
      borderColor: 'rgba(13, 13, 12, 0.0)',
      boxShadow: '0px 0px 0px rgba(13,13,12,0), 0px 0px 0px rgba(255,255,255,0)',
      stagger: 0.15,
      duration: 2.0,
      ease: 'power2.in'
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Morphic Dashboard Rise and Sink Animation
  useEffect(() => {
    const trigger = document.querySelector('.dash-trigger');
    const board = document.querySelector('.dash-board');
    const tabs = document.querySelectorAll('.dash-tab');
    const maturityCard = document.querySelector('.dash-card-maturity');
    const checkpointsCard = document.querySelector('.dash-card-checkpoints');
    const progressFill = document.querySelector('.dash-progress-fill');

    if (!trigger || !board || !tabs.length) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        pin: true,
        scrub: true,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3.0}`, // slightly longer scroll distance for rich sequencing
        invalidateOnRefresh: true,
      }
    });

    // Phase 1: Dashboard rises from the flat canvas
    tl.to(board, {
      y: 0,
      scale: 1,
      opacity: 1,
      borderColor: 'rgba(13, 13, 12, 0.05)',
      boxShadow: '16px 16px 32px rgba(13, 13, 12, 0.04), -16px -16px 32px rgba(255, 255, 255, 0.95)',
      duration: 1.5,
      ease: 'power2.out'
    });

    // Phase 2: Tabs on the left sidebar pop out one-by-one
    tabs.forEach((tab) => {
      tl.to(tab, {
        scale: 1.05,
        borderColor: 'rgba(13, 13, 12, 0.06)',
        boxShadow: '6px 6px 12px rgba(13, 13, 12, 0.03), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        backgroundColor: '#F8F7F2',
        duration: 0.5,
        ease: 'back.out(2.0)'
      });
    });

    // Phase 2.1: Maturity Card pops out and zooms in
    if (maturityCard) {
      tl.to(maturityCard, {
        scale: 1.0,
        y: 0,
        opacity: 1,
        borderColor: 'rgba(13, 13, 12, 0.05)',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.02), -4px -4px 10px #fff',
        duration: 0.8,
        ease: 'back.out(1.8)'
      });
    }

    // Phase 2.2: Checkpoints Card pops out and zooms in
    if (checkpointsCard) {
      tl.to(checkpointsCard, {
        scale: 1.0,
        y: 0,
        opacity: 1,
        borderColor: 'rgba(13, 13, 12, 0.05)',
        boxShadow: '4px 4px 10px rgba(0,0,0,0.02), -4px -4px 10px #fff',
        duration: 0.8,
        ease: 'back.out(1.8)'
      }, '-=0.4'); // slightly overlap with maturity card pop
    }

    // Phase 2.3: Progress Bar fills up from 0% to 90%
    if (progressFill) {
      tl.to(progressFill, {
        width: '90%',
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // Hold dashboard fully visible and loaded
    tl.to({}, { duration: 1.5 });

    // Phase 3: Reset components (sinking tabs, cards, and clearing progress)
    if (progressFill) {
      tl.to(progressFill, {
        width: '0%',
        duration: 0.8,
        ease: 'power2.in'
      });
    }

    if (maturityCard || checkpointsCard) {
      tl.to([maturityCard, checkpointsCard].filter(Boolean), {
        scale: 0.95,
        y: 10,
        opacity: 0,
        borderColor: 'rgba(13, 13, 12, 0.0)',
        boxShadow: 'none',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.in'
      }, '<');
    }

    tl.to(tabs, {
      scale: 1.0,
      borderColor: 'rgba(13, 13, 12, 0.0)',
      boxShadow: 'inset 0 0 0 rgba(0,0,0,0), inset 0 0 0 rgba(0,0,0,0)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.in'
    }, '<');

    // Phase 4: Full dashboard sinks back into the canvas
    tl.to(board, {
      y: 50,
      scale: 0.97,
      opacity: 0,
      borderColor: 'rgba(13, 13, 12, 0.0)',
      boxShadow: '0px 0px 0px rgba(13,13,12,0), 0px 0px 0px rgba(255,255,255,0)',
      duration: 1.5,
      ease: 'power2.in'
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Track scroll position to update progress and determine active section
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? scrolled / totalHeight : 0);

      const allSectionIds = SECTIONS.map(s => s.id);
      let currentActive = 'hero';

      for (const id of allSectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        if (['maturity', 'letters', 'carousel', 'for-everyone'].includes(id)) {
          // Horizontal panel intersection check: active if center is in view horizontally
          if (rect.left >= -window.innerWidth / 2 && rect.left <= window.innerWidth / 2) {
            currentActive = id;
            break;
          }
        } else {
          // Vertical block check: active if center is in view vertically
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial trigger check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (['maturity', 'letters', 'carousel', 'for-everyone'].includes(id)) {
      // Pin transitions scroll math
      const track = horizontalTrackRef.current;
      const container = horizontalContainerRef.current;
      if (!track || !container) return;

      const trackTop = track.offsetTop;
      const sectionIdx = ['maturity', 'letters', 'carousel', 'for-everyone'].indexOf(id);
      const scrollLength = container.scrollWidth - window.innerWidth;
      const step = scrollLength / 3; // 4 sections = 3 steps

      window.scrollTo({
        top: trackTop + sectionIdx * step + 2, // minor buffer to trigger scroll calculation
        behavior: 'smooth'
      });
    } else {
      // Vertical scrolling
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animate the "for everyone" cards when it becomes active
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardsAnimated, setCardsAnimated] = useState(false);
  useEffect(() => {
    if (activeSection === 'for-everyone' && !cardsAnimated) {
      const cards = cardRefs.current.filter(Boolean);
      gsap.fromTo(cards,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
      setCardsAnimated(true);
    }
  }, [activeSection, cardsAnimated]);

  return (
    <div className="relative min-h-screen bg-[#0d0d0c]">
      {/* Canvas background */}
      <ParticleCanvas />

      {/* Sunrise Daylight Overlay */}
      <div 
        className="sunrise-overlay fixed inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-1000"
        style={{ 
          background: 'radial-gradient(circle at 50% 120%, #ff8c42 0%, #ffd0a3 30%, #F8F7F2 70%)',
        }}
      />

      {/* Scroll progress */}
      <ScrollProgressBar progress={scrollProgress} />

      {/* Side nav */}
      <SideNav sections={SECTIONS} active={activeSection} onSelect={handleSelectSection} />

      {/* Back button */}
      <button
        onClick={() => navigate('/showcase')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#F8F7F2]/40 hover:text-[#F8F7F2] transition-colors text-sm cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Showcase
      </button>

      {/* ─── VERTICAL SECTIONS ─── */}
      <CinematicSection
        id="hero"
        kicker="Governance at Peak."
        title={['ADPA']}
        subtitle="Scroll down to start"
        align="center"
        active={activeSection === 'hero'}
      >
        <div className="mt-16 flex gap-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-[#F8F7F2]/20 text-[#F8F7F2]/60 hover:border-[#F8F7F2]/60 hover:text-[#F8F7F2] text-sm tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: 'serif' }}
          >
            Launch Platform
          </button>
        </div>
      </CinematicSection>

      <CinematicSection
        id="one-pool"
        title={['One', 'Assessment.']}
        subtitle="Assess. Score. Improve."
        description="ADPA unifies document analysis, maturity scoring, and actionable recommendations through a single AI assessment engine."
        align="left"
        active={activeSection === 'one-pool'}
      />

      <CinematicSection
        id="ai-engine"
        kicker="Where intelligence"
        title={['Flows']}
        subtitle="Deeper analysis, cleaner insights."
        description="Smoother extraction, more efficient scoring, and better intelligence across your entire document portfolio."
        align="right"
        active={activeSection === 'ai-engine'}
      >
        {/* Animated grid lines (EverSwap diamond motif) */}
        <div className="mt-16 relative w-48 h-48 self-end">
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-20 animate-[spin_30s_linear_infinite]">
            <line x1="100" y1="0" x2="200" y2="100" stroke="#F8F7F2" strokeWidth="0.5"/>
            <line x1="200" y1="100" x2="100" y2="200" stroke="#F8F7F2" strokeWidth="0.5"/>
            <line x1="100" y1="200" x2="0" y2="100" stroke="#F8F7F2" strokeWidth="0.5"/>
            <line x1="0" y1="100" x2="100" y2="0" stroke="#F8F7F2" strokeWidth="0.5"/>
            <line x1="100" y1="0" x2="100" y2="200" stroke="#F8F7F2" strokeWidth="0.3"/>
            <line x1="0" y1="100" x2="200" y2="100" stroke="#F8F7F2" strokeWidth="0.3"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="#F8F7F2" strokeWidth="0.3"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="#F8F7F2" strokeWidth="0.5"/>
          </svg>
        </div>
      </CinematicSection>

      {/* ─── PINNED HORIZONTAL SECTION ─── */}
      <div ref={horizontalTrackRef} className="relative w-full h-[400vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center">
          <div
            ref={horizontalContainerRef}
            className="flex flex-row w-[400vw] h-full items-center"
            style={{ willChange: 'transform' }}
          >
            {/* Maturity */}
            <CinematicSection
              id="maturity"
              title={['ReDe', 'fined']}
              subtitle="A new model for governance excellence."
              description="Five maturity levels. Eight performance domains. One coherent path from Initial chaos to Optimizing mastery."
              align="center"
              active={activeSection === 'maturity'}
            >
              {/* Maturity level pills */}
              <div className="mt-16 flex gap-4 flex-wrap justify-center">
                {['Initial', 'Managed', 'Defined', 'Quantitatively', 'Optimizing'].map((level, i) => (
                  <div
                    key={level}
                    className="border border-[#F8F7F2]/10 px-5 py-2 text-sm text-[#F8F7F2]/50 hover:text-[#F8F7F2] hover:border-[#F8F7F2]/40 transition-all cursor-default"
                    style={{ fontFamily: 'serif', animationDelay: `${i * 0.1}s` }}
                  >
                    {i + 1}. {level}
                  </div>
                ))}
              </div>
            </CinematicSection>

            {/* Letters */}
            <LetterRevealSection />

            {/* Floating Carousel */}
            <FloatingCarouselSection viewportRef={viewportRef} is3DMode={is3DMode} />

            {/* For Everyone */}
            <section id="for-everyone" className="w-screen h-screen flex-shrink-0 flex flex-col justify-center px-12 md:px-24 py-32 relative z-10 overflow-hidden">
              <div className="text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase mb-12 font-light" style={{ fontFamily: 'serif' }}>
                Made for EVERyone
              </div>
              <div className="grid md:grid-cols-3 gap-12 max-w-6xl">
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 76 77" className="w-16 h-16 opacity-70">
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 0.7 36)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 36.3 0.5)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 40.4 0.7)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 75.9 36.4)" fill="#F8F7F2" opacity="0.3"/>
                        <circle cx="38" cy="38" r="8" fill="#F8F7F2" opacity="0.8"/>
                      </svg>
                    ),
                    title: 'Project Managers',
                    desc: 'Upload documents and receive comprehensive maturity scores with targeted improvement paths.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 76 77" className="w-16 h-16 opacity-70">
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 0.7 36)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 36.3 0.5)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 40.4 0.7)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 75.9 36.4)" fill="#F8F7F2" opacity="0.3"/>
                        <rect x="30" y="30" width="16" height="16" fill="#F8F7F2" opacity="0.8" transform="rotate(45 38 38)"/>
                      </svg>
                    ),
                    title: 'PMO Leaders',
                    desc: 'Benchmark your portfolio against PMBOK 8 standards and identify systemic capability gaps.',
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 76 77" className="w-16 h-16 opacity-70">
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 0.7 36)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(0.706 0.708 -0.706 0.708 36.3 0.5)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 40.4 0.7)" fill="#F8F7F2" opacity="0.3"/>
                        <rect width="56" height="1" transform="matrix(-0.706 0.708 -0.706 -0.708 75.9 36.4)" fill="#F8F7F2" opacity="0.3"/>
                        <polygon points="38,26 50,50 26,50" fill="#F8F7F2" opacity="0.8"/>
                      </svg>
                    ),
                    title: 'Executives',
                    desc: 'Get ROI projections, risk reduction estimates, and strategic improvement roadmaps.',
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    ref={el => { cardRefs.current[i] = el; }}
                    className="flex flex-col gap-6 opacity-0"
                  >
                    {item.icon}
                    <div>
                      <h3 className="text-[#F8F7F2] text-2xl font-light mb-3" style={{ fontFamily: 'serif' }}>{item.title}</h3>
                      <p className="text-[#F8F7F2]/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ─── ZOOM SHOWCASE SECTION (PINNED VERTICAL) ─── */}
      <div id="zoom-showcase" className="zoom-section-trigger relative w-full h-[300vh] bg-[#0d0d0c] overflow-hidden">
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden">
          {/* Background subtle grid/particles that also react to zoom */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,247,242,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
          
          {/* Zoom Element (A premium detailed circular/diamond hub showing multidimensional capabilities) */}
          <div className="zoom-target relative w-80 h-80 md:w-96 md:h-96 border border-[#F8F7F2]/10 rounded-full flex items-center justify-center bg-zinc-950/80 backdrop-blur-md shadow-2xl z-20">
            {/* 3D Canvas rendering the morphing/rotating matrix object */}
            <Matrix3DCanvas scrollVal={zoomProgress} />

            {/* Inner ring */}
            <div className="absolute inset-4 border border-dashed border-[#F8F7F2]/15 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-12 border border-[#F8F7F2]/5 rounded-full" />
            
            {/* Center Content / Graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-xs text-[#F8F7F2]/40 tracking-[0.4em] uppercase mb-4 font-mono font-light zoom-hide-on-deep">
                Core Engine
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-[#F8F7F2] tracking-wider mb-2 zoom-hide-on-deep" style={{ fontFamily: 'serif' }}>
                ADPA MATRIX
              </h3>
              
              {/* Detailed specs revealed on zoom */}
              <div className="zoom-reveal-content opacity-0 scale-75 flex flex-col items-center gap-4 transition-all duration-300">
                <div className="w-12 h-[1px] bg-[#F8F7F2]/50 my-2" />
                <span className="text-[10px] text-[#F8F7F2]/40 font-mono tracking-widest uppercase">Deep Audit Focus Point</span>
                <p className="text-[#F8F7F2]/80 text-xs max-w-[240px] leading-relaxed font-light">
                  Extracting governance checkpoints, structural integrity, and multi-layered compliance benchmarks in real-time.
                </p>
                <div className="flex gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-emerald-400">99.8%</span>
                    <span className="text-[8px] text-[#F8F7F2]/30 uppercase font-mono">Accuracy</span>
                  </div>
                  <div className="w-[1px] h-6 bg-[#F8F7F2]/10" />
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-[#F8F7F2]/80">5 Layers</span>
                    <span className="text-[8px] text-[#F8F7F2]/30 uppercase font-mono">Analysis</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Surrounding floating labels that disperse as we zoom in */}
            <div className="zoom-label absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-[#F8F7F2]/10 px-3 py-1 text-[9px] font-mono text-[#F8F7F2]/60 tracking-widest uppercase rounded">
              Compliance Layer
            </div>
            <div className="zoom-label absolute -bottom-12 left-1/2 -translate-x-1/2 bg-zinc-950/90 border border-[#F8F7F2]/10 px-3 py-1 text-[9px] font-mono text-[#F8F7F2]/60 tracking-widest uppercase rounded">
              Risk Assessment
            </div>
            <div className="zoom-label absolute top-1/2 -left-16 -translate-y-1/2 bg-zinc-950/90 border border-[#F8F7F2]/10 px-3 py-1 text-[9px] font-mono text-[#F8F7F2]/60 tracking-widest uppercase rounded">
              Maturity Index
            </div>
            <div className="zoom-label absolute top-1/2 -right-16 -translate-y-1/2 bg-zinc-950/90 border border-[#F8F7F2]/10 px-3 py-1 text-[9px] font-mono text-[#F8F7F2]/60 tracking-widest uppercase rounded">
              ROI Delta
            </div>
          </div>

          {/* Large Title overlays background */}
          <div className="absolute inset-x-0 top-24 flex flex-col items-center text-center px-6 z-10 pointer-events-none">
            <span className="zoom-title-kicker text-[#F8F7F2]/30 text-xs tracking-[0.4em] uppercase font-light mb-4" style={{ fontFamily: 'serif' }}>
              Transitioning to Results
            </span>
            <h2 className="zoom-title text-[clamp(2rem,5vw,5.5rem)] font-light text-[#F8F7F2] leading-tight" style={{ fontFamily: 'serif' }}>
              Deep Dive Analytics
            </h2>
          </div>
        </div>
      </div>

      {/* ─── VERTICAL SECTIONS CONT. ─── */}
      <section id="results" className="skew-section w-full h-screen flex flex-col justify-center px-12 md:px-24 py-32 relative z-10 overflow-hidden">
        <div className="max-w-4xl">
          <div className="text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase mb-16 font-light" style={{ fontFamily: 'serif' }}>
            One Assessment. Every Dimension.
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,7rem)] font-light text-[#F8F7F2] leading-none mb-12" style={{ fontFamily: 'serif' }}>
            One Assessment<br/>Every Function
          </h2>
          <p className="text-[#F8F7F2]/40 text-lg mb-16 max-w-lg leading-relaxed font-light">
            Building a more intelligent foundation for organisational governance and project maturity.
          </p>
          <button
            onClick={() => navigate('/demo-journey')}
            className="group flex items-center gap-4 border border-[#F8F7F2]/20 hover:border-[#F8F7F2]/60 px-8 py-4 text-[#F8F7F2]/60 hover:text-[#F8F7F2] transition-all cursor-pointer"
            style={{ fontFamily: 'serif' }}
          >
            <span className="tracking-widest uppercase text-sm">Try Interactive Demo</span>
            <svg viewBox="0 0 34 34" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C26.4 0 34 7.6 34 17C34 26.4 26.4 34 17 34C7.6 34 0 26.4 0 17C0 7.6 7.6 0 17 0ZM13.5 14V15.5H17.4C17.6 15.5 17.7 15.8 17.6 15.9L13.5 20L14.6 21.0L18.6 17.0C18.8 16.9 19 17.0 19 17.2V21.0H20.5V14.6C20.5 14.3 20.2 14 19.9 14H13.5Z"/>
            </svg>
          </button>
        </div>
      </section>

      <section id="join" className="skew-section w-full h-screen flex flex-col justify-center px-12 md:px-24 py-32 relative z-10 items-center text-center overflow-hidden">
        <div className="text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase mb-8 font-light" style={{ fontFamily: 'serif' }}>
          Stay close to the summit
        </div>
        <h2 className="text-[clamp(3rem,8vw,9rem)] font-light text-[#F8F7F2] leading-none mb-16" style={{ fontFamily: 'serif', letterSpacing: '-0.03em' }}>
          Begin with<br/>ADPA
        </h2>
        <div className="flex gap-6">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 border border-[#F8F7F2]/20 text-[#F8F7F2]/60 hover:border-[#F8F7F2]/50 hover:text-[#F8F7F2] text-sm tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: 'serif' }}
          >
            Onboarding
          </button>
          <button
            onClick={() => navigate('/showcase')}
            className="px-8 py-3 border border-[#F8F7F2]/20 text-[#F8F7F2]/60 hover:border-[#F8F7F2]/50 hover:text-[#F8F7F2] text-sm tracking-widest uppercase transition-all cursor-pointer"
            style={{ fontFamily: 'serif' }}
          >
            Showcase
          </button>
        </div>
      </section>

      {/* ─── SUNRISE DAYLIGHT SECTION (PINNED VERTICAL) ─── */}
      <div id="sunrise" className="sunrise-trigger relative w-full h-[250vh] overflow-hidden">
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center text-center px-12 md:px-24 py-32 overflow-hidden">
          <div className="max-w-4xl flex flex-col items-center">
            <span className="sunrise-text text-[#F8F7F2]/40 text-xs tracking-[0.3em] uppercase mb-8 font-light" style={{ fontFamily: 'serif' }}>
              Summit Achieved
            </span>
            <h2 className="sunrise-text text-[clamp(2.5rem,6vw,7rem)] font-light text-[#F8F7F2] leading-none mb-12" style={{ fontFamily: 'serif', letterSpacing: '-0.02em' }}>
              A New Day for<br />Governance.
            </h2>
            <p className="sunrise-text text-[#F8F7F2]/45 text-lg mb-16 max-w-lg leading-relaxed font-light">
              With ADPA, clarity is no longer a distant peak. Step into a brighter, optimized, and fully-transparent portfolio maturity lifecycle today.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="sunrise-btn px-8 py-3 border border-[#F8F7F2]/20 text-[#F8F7F2]/60 hover:border-black/60 hover:text-[#0d0d0c] text-sm tracking-widest uppercase transition-all cursor-pointer rounded-full"
                style={{ fontFamily: 'serif' }}
              >
                Reset Journey
              </button>
              <button
                onClick={() => navigate('/')}
                className="sunrise-btn px-8 py-3 border border-[#F8F7F2]/20 text-[#F8F7F2]/60 hover:border-black/60 hover:text-[#0d0d0c] text-sm tracking-widest uppercase transition-all cursor-pointer rounded-full"
                style={{ fontFamily: 'serif' }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI VERTICAL CAROUSEL SECTION (PINNED VERTICAL) ─── */}
      <div id="kpis" className="kpi-trigger relative w-full h-[250vh] overflow-hidden">
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center px-12 md:px-24 py-32 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl w-full items-center">
            
            {/* Left side: Heading */}
            <div className="flex flex-col items-start max-w-md">
              <span className="sunrise-text text-[#0d0d0c]/50 text-xs tracking-[0.3em] uppercase mb-6 font-light" style={{ fontFamily: 'serif' }}>
                Peak Objectives Achieved
              </span>
              <h2 className="sunrise-text text-[clamp(2rem,4.5vw,4.5rem)] font-light text-[#0d0d0c] leading-tight mb-8" style={{ fontFamily: 'serif', letterSpacing: '-0.02em' }}>
                Surpassing All Expectations.
              </h2>
              <p className="sunrise-text text-[#0d0d0c]/60 text-base md:text-lg mb-12 leading-relaxed font-light">
                Our core extraction engines, compliance validators, and risk indices operate in perfect alignment to deliver peerless results across all dimensions.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="sunrise-btn px-6 py-2.5 border border-[#0d0d0c]/20 text-[#0d0d0c]/60 hover:border-black hover:text-[#0d0d0c] text-xs tracking-widest uppercase transition-all cursor-pointer rounded-full"
                  style={{ fontFamily: 'serif' }}
                >
                  Restart Journey
                </button>
              </div>
            </div>

            {/* Right side: Vertical Carousel viewport */}
            <div className="relative h-[320px] md:h-[400px] w-full flex items-center justify-center overflow-hidden">
              <div className="kpi-vertical-track flex flex-col gap-6 w-full max-w-md select-none" style={{ willChange: 'transform' }}>
                {[
                  {
                    metric: "10x",
                    label: "Ingestion Speed",
                    title: "Audit Velocity",
                    desc: "Analyze and map standard PMO templates, project charters, and governance documents in under 30 seconds."
                  },
                  {
                    metric: "99.8%",
                    label: "Precision Rate",
                    title: "Semantic Accuracy",
                    desc: "Accurately parse text patterns and cross-reference checkpoints with PMBOK 8 guidelines."
                  },
                  {
                    metric: "-32%",
                    label: "Risk Delta",
                    title: "Governance Gaps",
                    desc: "Instantly detect missing approvals, compliance anomalies, and critical project risk vectors."
                  },
                  {
                    metric: "+$142k",
                    label: "Savings Index",
                    title: "ROI Delta",
                    desc: "Drastically reduce reporting latency, peer review loops, and administrative operational overhead."
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="kpi-card border rounded-lg p-8 flex flex-col justify-between aspect-[3/1.8] bg-white transition-all duration-700 ease-out"
                    style={{
                      transform: idx === 0 ? 'scale(1.05)' : 'scale(0.95)',
                      opacity: idx === 0 ? 1 : 0.25,
                      borderColor: idx === 0 ? 'rgba(13, 13, 12, 0.4)' : 'rgba(13, 13, 12, 0.1)',
                      boxShadow: idx === 0 ? '0 20px 40px -15px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-3xl md:text-4xl font-light text-[#0d0d0c]" style={{ fontFamily: 'serif' }}>{item.metric}</span>
                        <span className="text-[10px] text-[#0d0d0c]/40 font-mono uppercase tracking-wider">{item.label}</span>
                      </div>
                      <span className="text-xs text-[#0d0d0c]/30 font-mono font-light">0{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-[#0d0d0c] text-lg font-light mb-2" style={{ fontFamily: 'serif' }}>{item.title}</h4>
                      <p className="text-[#0d0d0c]/50 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MORPHIC UI RISE AND SINK SECTION (PINNED VERTICAL) ─── */}
      <div id="morphic-ui" className="morphic-trigger relative w-full h-[300vh] overflow-hidden">
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center px-12 md:px-24 py-32 overflow-hidden">
          {/* Subtle header */}
          <div className="morphic-header text-center max-w-xl mb-16">
            <span className="text-[#0d0d0c]/40 text-xs tracking-[0.3em] uppercase mb-4 block" style={{ fontFamily: 'serif' }}>
              Tactile Ecosystem
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-light text-[#0d0d0c] leading-tight" style={{ fontFamily: 'serif', letterSpacing: '-0.01em' }}>
              Physical Interface Evolution
            </h2>
          </div>

          {/* Neumorphic Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
            
            {/* Widget 1: Audit Rules */}
            <div
              className="morphic-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-1000 bg-[#F8F7F2]"
              style={{
                transform: 'translateY(50px) scale(0.97)',
                opacity: 0,
                border: '1px solid rgba(13, 13, 12, 0.0)',
                boxShadow: '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)',
                height: '320px'
              }}
            >
              <div>
                <h3 className="text-lg font-light text-[#0d0d0c] mb-6" style={{ fontFamily: 'serif' }}>Semantic Checkpoints</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Verify PMO Executive Signatures', done: true },
                    { label: 'Check PMBOK v8 Integrity Hash', done: true },
                    { label: 'Analyze Risk Register Coherence', done: false }
                  ].map((rule, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded flex items-center justify-center border border-[#0d0d0c]/15 bg-[#F8F7F2]"
                        style={{
                          boxShadow: rule.done ? 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px #fff' : 'none'
                        }}
                      >
                        {rule.done && <span className="text-[10px] text-[#0d0d0c]/60">✓</span>}
                      </div>
                      <span className="text-xs text-[#0d0d0c]/60 font-light">{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-[#0d0d0c]/30 font-mono tracking-widest uppercase">AUDIT ENGINE</span>
            </div>

            {/* Widget 2: Maturity Metric */}
            <div
              className="morphic-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-1000 bg-[#F8F7F2]"
              style={{
                transform: 'translateY(50px) scale(0.97)',
                opacity: 0,
                border: '1px solid rgba(13, 13, 12, 0.0)',
                boxShadow: '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)',
                height: '320px'
              }}
            >
              <div>
                <h3 className="text-lg font-light text-[#0d0d0c] mb-4" style={{ fontFamily: 'serif' }}>Maturity Index</h3>
                <div className="flex flex-col items-center justify-center py-4">
                  <div 
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center bg-[#F8F7F2] border border-[#0d0d0c]/5 relative"
                    style={{
                      boxShadow: '8px 8px 16px rgba(0,0,0,0.03), -8px -8px 16px #fff, inset 3px 3px 6px rgba(0,0,0,0.02), inset -3px -3px 6px #fff'
                    }}
                  >
                    <span className="text-3xl font-light text-[#0d0d0c]" style={{ fontFamily: 'serif' }}>3.8</span>
                    <span className="text-[8px] text-[#0d0d0c]/40 font-mono tracking-wider uppercase">Level</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-[#0d0d0c]/40 font-mono uppercase tracking-wider">
                <span>INDEX SCALE</span>
                <span className="text-emerald-500">OPTIMIZING</span>
              </div>
            </div>

            {/* Widget 3: Recommendations / Actions */}
            <div
              className="morphic-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-1000 bg-[#F8F7F2]"
              style={{
                transform: 'translateY(50px) scale(0.97)',
                opacity: 0,
                border: '1px solid rgba(13, 13, 12, 0.0)',
                boxShadow: '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)',
                height: '320px'
              }}
            >
              <div>
                <h3 className="text-lg font-light text-[#0d0d0c] mb-6" style={{ fontFamily: 'serif' }}>Active Directives</h3>
                <div className="space-y-3">
                  {[
                    'Optimize Scope Log',
                    'Remediate Sync Latency',
                    'Publish Audit Manifest'
                  ].map((act, aIdx) => (
                    <div 
                      key={aIdx}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#0d0d0c]/5 text-xs text-[#0d0d0c]/70 bg-[#F8F7F2] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                      style={{
                        boxShadow: '4px 4px 10px rgba(0,0,0,0.02), -4px -4px 10px #fff'
                      }}
                    >
                      {act}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#0d0d0c]/30 font-mono tracking-widest uppercase">DIRECTIVES</span>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs font-semibold text-[#0d0d0c]/60 hover:text-black transition-colors"
                >
                  Restart ➔
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── MORPHIC DASHBOARD SECTION (PINNED VERTICAL) ─── */}
      <div id="morphic-dashboard" className="dash-trigger relative w-full h-[300vh] overflow-hidden">
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center px-12 md:px-24 py-20 overflow-hidden">
          {/* Subtle header */}
          <div className="text-center max-w-xl mb-10">
            <span className="text-[#0d0d0c]/40 text-xs tracking-[0.3em] uppercase mb-2 block" style={{ fontFamily: 'serif' }}>
              Deep Integration
            </span>
            <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-[#0d0d0c] leading-tight" style={{ fontFamily: 'serif', letterSpacing: '-0.01em' }}>
              Sample Project Assessment
            </h2>
          </div>

          {/* Neumorphic Full Dashboard */}
          <div 
            className="dash-board w-full max-w-5xl rounded-3xl bg-[#F8F7F2] p-8 flex gap-8 transition-all duration-[1.2s] border border-transparent"
            style={{
              transform: 'translateY(50px) scale(0.97)',
              opacity: 0,
              boxShadow: '0 0 0 rgba(0,0,0,0), 0 0 0 rgba(0,0,0,0)',
              height: '480px'
            }}
          >
            {/* Sidebar on the Left */}
            <div className="w-60 flex flex-col gap-5 border-r border-[#0d0d0c]/5 pr-6 justify-between py-2">
              <div className="flex flex-col gap-3">
                <div className="text-[9px] text-[#0d0d0c]/30 font-mono tracking-widest uppercase mb-2 pl-2">NAVIGATION</div>
                {[
                  { label: "Overview", icon: "📊" },
                  { label: "Scorecard", icon: "🏆" },
                  { label: "Compliance", icon: "🛡️" },
                  { label: "Directives", icon: "📋" }
                ].map((tab, tIdx) => (
                  <div
                    key={tIdx}
                    className="dash-tab w-full py-3 px-4 rounded-xl border border-transparent bg-[#F8F7F2] text-left text-xs text-[#0d0d0c]/60 font-light flex items-center gap-3 transition-all duration-[0.8s] cursor-pointer"
                    style={{
                      boxShadow: 'none',
                      transform: 'scale(1.0)',
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </div>
                ))}
              </div>

              <div className="pl-2 flex flex-col gap-1">
                <span className="text-[8px] text-[#0d0d0c]/30 font-mono">AUDIT VERIFIER</span>
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM READY
                </span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6 py-2">
              <div className="flex justify-between items-center border-b border-[#0d0d0c]/5 pb-4">
                <div className="flex flex-col">
                  <h4 className="text-[#0d0d0c] text-lg font-light" style={{ fontFamily: 'serif' }}>E-Commerce Core Upgrade</h4>
                  <span className="text-[10px] text-[#0d0d0c]/40 font-mono">ID: PROJECT-DE-2026</span>
                </div>
                <div 
                  className="px-3 py-1 rounded bg-[#F8F7F2] text-[9px] font-mono text-emerald-600 border border-[#0d0d0c]/5"
                  style={{ boxShadow: '2px 2px 5px rgba(0,0,0,0.02), -2px -2px 5px #fff' }}
                >
                  AUDIT: COMPLETE
                </div>
              </div>

              {/* Score card and details */}
              <div className="grid grid-cols-2 gap-6">
                <div 
                  className="dash-card-maturity rounded-xl p-5 border border-transparent bg-[#F8F7F2] opacity-0 transition-all duration-[0.8s]"
                  style={{
                    transform: 'scale(0.95) translateY(10px)',
                    boxShadow: 'none'
                  }}
                >
                  <span className="text-[9px] text-[#0d0d0c]/30 font-mono uppercase tracking-wider block mb-2">Overall Maturity</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-light text-[#0d0d0c]" style={{ fontFamily: 'serif' }}>Level 3.6</span>
                    <span className="text-xs text-emerald-600 font-medium mb-1">Defined</span>
                  </div>
                </div>

                <div 
                  className="dash-card-checkpoints rounded-xl p-5 border border-transparent bg-[#F8F7F2] opacity-0 transition-all duration-[0.8s]"
                  style={{
                    transform: 'scale(0.95) translateY(10px)',
                    boxShadow: 'none'
                  }}
                >
                  <span className="text-[9px] text-[#0d0d0c]/30 font-mono uppercase tracking-wider block mb-2">Checkpoints Passed</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-light text-[#0d0d0c]" style={{ fontFamily: 'serif' }}>42 / 45</span>
                    <span className="text-xs text-[#0d0d0c]/40 mb-1">(93%)</span>
                  </div>
                </div>
              </div>

              {/* Progress bar / Domain breakdown */}
              <div 
                className="rounded-xl p-5 border border-[#0d0d0c]/5 bg-[#F8F7F2] flex flex-col gap-3"
                style={{ boxShadow: '4px 4px 10px rgba(0,0,0,0.02), -4px -4px 10px #fff' }}
              >
                <div className="flex justify-between text-[10px] text-[#0d0d0c]/55 font-mono">
                  <span>GOVERNANCE & PMO PERFORMANCE</span>
                  <span>90% MATCH</span>
                </div>
                <div 
                  className="w-full h-3 rounded-full bg-[#F8F7F2] p-[1.5px] border border-[#0d0d0c]/5"
                  style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05), inset -2px -2px 4px #fff' }}
                >
                  <div 
                    className="dash-progress-fill h-full bg-emerald-500/80 rounded-full shadow-lg" 
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
