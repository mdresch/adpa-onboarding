import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft, Zap, Layers, MousePointer, Move, Eye, Sparkles,
  RefreshCw, Play, Pause, ChevronRight, Star, Box, Circle,
  Triangle, Hexagon, Clock, ArrowRight, Check, X
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   ATOM: tiny reusable demo card
───────────────────────────────────────────────────────────────────────────── */
const DemoCard: React.FC<{ title: string; tag: string; tagColor?: string; children: React.ReactNode }> = ({
  title, tag, tagColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30', children
}) => (
  <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-slate-200">{title}</h3>
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColor}`}>{tag}</span>
    </div>
    <div className="flex-1 flex items-center justify-center min-h-[140px]">
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────────── */
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color?: string }> = ({
  icon, title, subtitle, color = 'text-blue-400'
}) => (
  <div className="mb-10">
    <div className={`flex items-center gap-3 mb-3 ${color}`}>
      {icon}
      <span className="font-bold tracking-widest uppercase text-sm">{title}</span>
    </div>
    <p className="text-slate-400 text-sm max-w-xl">{subtitle}</p>
    <div className="mt-4 h-px bg-gradient-to-r from-blue-500/30 to-transparent" />
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   HOVER DEMOS
───────────────────────────────────────────────────────────────────────────── */
const HoverSection: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
    {/* Scale + Glow */}
    <DemoCard title="Scale + Glow" tag="CSS :hover" tagColor="bg-blue-500/20 text-blue-300 border-blue-500/30">
      <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-125 hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]">
        <Star size={28} />
      </div>
    </DemoCard>

    {/* Lift + Border Reveal */}
    <DemoCard title="Lift + Border" tag="CSS :hover">
      <div className="w-40 h-16 rounded-xl bg-slate-800 border-2 border-transparent flex items-center justify-center text-slate-400 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500 hover:text-cyan-400 hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] font-medium">
        Hover Me
      </div>
    </DemoCard>

    {/* Glossy Overlay */}
    <DemoCard title="Glossy Reveal" tag="CSS :hover">
      <div className="relative w-36 h-20 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 cursor-pointer overflow-hidden group flex items-center justify-center text-white font-semibold">
        <span className="relative z-10">Hover</span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </div>
    </DemoCard>

    {/* Icon Rotate */}
    <DemoCard title="Icon Spin" tag="CSS :hover">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 cursor-pointer group">
        <RefreshCw size={28} className="transition-transform duration-700 group-hover:rotate-[360deg]" />
      </div>
    </DemoCard>

    {/* Magnetic-feel scale */}
    <DemoCard title="Tilt 3D" tag="CSS perspective">
      <div
        className="w-36 h-20 rounded-xl bg-gradient-to-br from-rose-600/80 to-pink-700 flex items-center justify-center text-white font-semibold cursor-pointer"
        style={{ transformStyle: 'preserve-3d', perspective: '400px' }}
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          const x = ((e.clientY - r.top) / r.height - 0.5) * 20;
          const y = ((e.clientX - r.left) / r.width - 0.5) * -20;
          el.style.transform = `rotateX(${x}deg) rotateY(${y}deg) scale(1.05)`;
        }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateX(0) rotateY(0) scale(1)'; }}
      >
        Tilt Me
      </div>
    </DemoCard>

    {/* Shimmer */}
    <DemoCard title="Shimmer Sweep" tag="CSS animation">
      <div className="relative w-40 h-14 rounded-xl bg-slate-700 overflow-hidden flex items-center justify-center text-slate-300 font-medium cursor-pointer">
        Loading…
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
    </DemoCard>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   CLICK / STATE DEMOS
───────────────────────────────────────────────────────────────────────────── */
const StateSection: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [toggled, setToggled] = useState(false);
  const [count, setCount] = useState(0);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [morphed, setMorphed] = useState(false);

  const toggleCheck = (i: number) => setChecked(prev => prev.map((v, j) => j === i ? !v : v));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {/* Sliding Tab Bar */}
      <DemoCard title="Sliding Tab Bar" tag="React state" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <div className="relative flex bg-slate-800 rounded-lg p-1 gap-1">
          {['Day', 'Week', 'Month'].map((label, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer relative z-10 ${tab === i ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {label}
            </button>
          ))}
          <div className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(33.33%-4px)] bg-blue-600 rounded-md shadow-lg transition-transform duration-300"
            style={{ transform: `translateX(${tab * 100}%)` }} />
        </div>
      </DemoCard>

      {/* Toggle Switch */}
      <DemoCard title="Smooth Toggle" tag="React state" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => setToggled(!toggled)}
            className={`w-14 h-7 rounded-full cursor-pointer transition-all duration-300 relative ${toggled ? 'bg-emerald-500 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${toggled ? 'left-8' : 'left-1'}`} />
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${toggled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {toggled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </DemoCard>

      {/* Animated Counter */}
      <DemoCard title="Ripple Button" tag="React state" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl font-bold text-white font-mono">{count}</div>
          <button onClick={() => setCount(c => c + 1)}
            className="relative px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium overflow-hidden group cursor-pointer active:scale-95 transition-transform">
            <span className="relative z-10">Increment</span>
            <span className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 rounded-full transition-transform duration-300" />
          </button>
        </div>
      </DemoCard>

      {/* Checkbox List */}
      <DemoCard title="Check Reveal" tag="CSS + state" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <div className="flex flex-col gap-2 w-full">
          {['Risk Register', 'Quality Plan', 'Stakeholder Map'].map((item, i) => (
            <div key={i} onClick={() => toggleCheck(i)}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${checked[i] ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}`}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                {checked[i] && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <span className={`text-sm transition-colors duration-300 ${checked[i] ? 'text-emerald-400 line-through opacity-60' : 'text-slate-300'}`}>{item}</span>
            </div>
          ))}
        </div>
      </DemoCard>

      {/* Morph Shape */}
      <DemoCard title="Morph Shape" tag="CSS transition" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-700 transition-all duration-700 cursor-pointer flex items-center justify-center text-white"
            style={{ borderRadius: morphed ? '50%' : '12px', transform: morphed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            onClick={() => setMorphed(!morphed)}
          >
            <Box size={28} />
          </div>
          <span className="text-xs text-slate-500">Click to morph</span>
        </div>
      </DemoCard>

      {/* Accordion-style expand */}
      <AccordionDemo />
    </div>
  );
};

const AccordionDemo: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <DemoCard title="Smooth Accordion" tag="CSS max-height" tagColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
      <div className="w-full flex flex-col gap-1">
        {['Overview', 'Gaps', 'Actions'].map((label, i) => (
          <div key={i} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-200 font-medium cursor-pointer hover:bg-slate-750 transition-colors">
              {label}
              <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-90' : ''}`} />
            </button>
            <div className={`transition-all duration-400 overflow-hidden ${open === i ? 'max-h-20' : 'max-h-0'}`}>
              <p className="text-xs text-slate-400 px-4 pb-3">Sample content for the {label} section goes here.</p>
            </div>
          </div>
        ))}
      </div>
    </DemoCard>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   GSAP SCROLL DEMOS
───────────────────────────────────────────────────────────────────────────── */
const ScrollSection: React.FC = () => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const staggerRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Counter animation
    if (counterRef.current) {
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: 3.5,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function () {
              if (counterRef.current) counterRef.current.textContent = this.targets()[0].val.toFixed(1);
            }
          });
        }
      });
    }

    // Progress bar fill
    if (barRef.current) {
      gsap.fromTo(barRef.current, { width: '0%' }, {
        width: '72%',
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: barRef.current, start: 'top 90%', once: true }
      });
    }

    // Stagger cards
    if (staggerRef.current) {
      const cards = staggerRef.current.querySelectorAll('.stagger-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: staggerRef.current, start: 'top 85%', once: true }
        }
      );
    }

    // Fade + Slide from left
    if (fadeRef.current) {
      const items = fadeRef.current.querySelectorAll('.fade-item');
      gsap.fromTo(items,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: fadeRef.current, start: 'top 85%', once: true }
        }
      );
    }
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {/* Counter */}
      <DemoCard title="Count-Up on Scroll" tag="GSAP" tagColor="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
        <div className="flex flex-col items-center gap-1">
          <span ref={counterRef} className="text-6xl font-bold text-cyan-400 tabular-nums">0.0</span>
          <span className="text-slate-500 text-xs">Maturity Score</span>
        </div>
      </DemoCard>

      {/* Progress bar fill */}
      <DemoCard title="Bar Fill on Scroll" tag="GSAP" tagColor="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
        <div className="w-full flex flex-col gap-3">
          <div className="text-xs text-slate-400 flex justify-between"><span>Quality Score</span><span>72%</span></div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div ref={barRef} className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.6)]" style={{ width: '0%' }} />
          </div>
        </div>
      </DemoCard>

      {/* Stagger */}
      <DemoCard title="Stagger Reveal" tag="GSAP" tagColor="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
        <div ref={staggerRef} className="flex gap-2">
          {['1','2','3','4'].map(n => (
            <div key={n} className="stagger-card w-12 h-12 bg-violet-600/50 border border-violet-500/40 rounded-lg flex items-center justify-center text-violet-300 font-bold opacity-0">
              {n}
            </div>
          ))}
        </div>
      </DemoCard>

      {/* Slide from left */}
      <DemoCard title="Slide-In Cascade" tag="GSAP" tagColor="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
        <div ref={fadeRef} className="flex flex-col gap-2 w-full">
          {['Planning', 'Delivery', 'Quality'].map(label => (
            <div key={label} className="fade-item flex items-center gap-2 opacity-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </DemoCard>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   GEOMETRIC / CSS KEYFRAME ANIMATIONS (from maturity page)
───────────────────────────────────────────────────────────────────────────── */
const GeometricSection: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
    {/* Spinning dashed orbit */}
    <DemoCard title="Spinning Orbit" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-blue-500/40 rounded-full animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-3 border border-blue-400/30 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
        <Circle size={30} className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
      </div>
    </DemoCard>

    {/* Pulse ring */}
    <DemoCard title="Sonar Pulse" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-emerald-500/15 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center">
          <Zap size={18} className="text-emerald-400" />
        </div>
      </div>
    </DemoCard>

    {/* Float */}
    <DemoCard title="Float Drift" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/80 to-purple-700 flex items-center justify-center text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]"
        style={{ animation: 'float 3s ease-in-out infinite' }}>
        <Hexagon size={28} />
      </div>
    </DemoCard>

    {/* Gradient text animation */}
    <DemoCard title="Gradient Text Flow" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-[length:200%_100%] animate-[gradientShift_3s_ease_infinite]">
        ADPA
      </div>
    </DemoCard>

    {/* Rotating border */}
    <DemoCard title="Conic Border" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: 'conic-gradient(from var(--angle, 0deg), #3b82f6, #8b5cf6, #06b6d4, #3b82f6)', animation: 'rotateConic 2s linear infinite' }}>
        <div className="absolute inset-0.5 rounded-full bg-slate-900 flex items-center justify-center">
          <Triangle size={22} className="text-violet-400" />
        </div>
      </div>
    </DemoCard>

    {/* Particle dots */}
    <DemoCard title="Orbiting Particles" tag="CSS keyframe" tagColor="bg-amber-500/20 text-amber-300 border-amber-500/30">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="absolute w-2 h-2 rounded-full bg-cyan-400"
            style={{
              animation: `orbit 3s linear infinite`,
              animationDelay: `${i * -0.5}s`,
              transformOrigin: '0 40px',
              left: '50%',
              top: '50%',
              opacity: 1 - i * 0.15
            }}
          />
        ))}
        <Star size={20} className="text-cyan-300" />
      </div>
    </DemoCard>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE TRANSITION DEMO (simulated)
───────────────────────────────────────────────────────────────────────────── */
const PageTransitionSection: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const trigger = (type: string) => {
    setActive(type);
    setVisible(true);
    setTimeout(() => setVisible(false), 1400);
  };

  const overlayClass = (() => {
    if (!visible) return 'opacity-0 pointer-events-none';
    switch (active) {
      case 'fade': return 'opacity-100 bg-slate-950';
      case 'slide': return 'opacity-100 bg-blue-950 translate-x-0';
      case 'zoom': return 'opacity-100 bg-slate-950 scale-100';
      case 'curtain': return 'opacity-100 bg-indigo-950 translate-y-0';
      default: return 'opacity-0 pointer-events-none';
    }
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'fade', label: 'Fade Out/In', icon: Eye, desc: 'Classic cross-fade', color: 'border-blue-500/40 hover:bg-blue-900/20' },
          { key: 'slide', label: 'Slide Push', icon: ArrowRight, desc: 'Horizontal push', color: 'border-cyan-500/40 hover:bg-cyan-900/20' },
          { key: 'zoom', label: 'Zoom Through', icon: Move, desc: 'Scale to black', color: 'border-violet-500/40 hover:bg-violet-900/20' },
          { key: 'curtain', label: 'Curtain Drop', icon: Layers, desc: 'Vertical wipe', color: 'border-emerald-500/40 hover:bg-emerald-900/20' },
        ].map(({ key, label, icon: Icon, desc, color }) => (
          <button key={key} onClick={() => trigger(key)}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-900/50 border ${color} transition-all duration-300 cursor-pointer group`}>
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon size={22} className="text-slate-300" />
            </div>
            <div className="text-center">
              <div className="text-slate-200 font-medium text-sm">{label}</div>
              <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Overlay simulator */}
      <div className="relative h-32 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
        <span className="text-slate-500 text-sm">↑ Click a transition above to preview ↑</span>
        <div className={`absolute inset-0 flex items-center justify-center text-white font-bold text-lg transition-all duration-700 ${
          active === 'slide' ? `translate-x-full ${visible ? '!translate-x-0' : ''}` :
          active === 'zoom' ? `scale-0 ${visible ? '!scale-100' : ''}` :
          active === 'curtain' ? `-translate-y-full ${visible ? '!translate-y-0' : ''}` :
          ''
        } ${overlayClass}`}>
          ✦ Transitioning…
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLASSMORPHISM DEMOS
───────────────────────────────────────────────────────────────────────────── */
const GlassSection: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {/* Basic glass card */}
    <div className="relative rounded-2xl overflow-hidden h-48">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-700 opacity-60" />
      <div className="relative h-full bg-white/10 border border-white/20 backdrop-blur-md p-5 flex flex-col justify-between">
        <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Glassmorphism</span>
        <div>
          <div className="text-2xl font-bold text-white mb-1">Standard Glass</div>
          <div className="text-white/60 text-sm">bg-white/10 + backdrop-blur-md</div>
        </div>
      </div>
    </div>

    {/* Frosted deep */}
    <div className="relative rounded-2xl overflow-hidden h-48">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-600 opacity-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M0 0h30v30H0zm30 30h30v30H30z\'/%3E%3C/g%3E%3C/svg%3E')]" />
      <div className="relative h-full bg-white/5 border border-white/10 backdrop-blur-2xl p-5 flex flex-col justify-between">
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Deep Frost</span>
        <div>
          <div className="text-2xl font-bold text-white mb-1">Heavy Blur</div>
          <div className="text-white/50 text-sm">backdrop-blur-2xl + pattern overlay</div>
        </div>
      </div>
    </div>

    {/* Neon glow glass */}
    <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-950">
      <div className="absolute top-4 left-4 w-32 h-32 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-4 right-4 w-24 h-24 bg-violet-600/30 rounded-full blur-2xl" />
      <div className="relative h-full bg-white/5 border border-white/10 backdrop-blur-md p-5 flex flex-col justify-between shadow-[inset_0_0_20px_rgba(255,255,255,0.03)]">
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Neon Ambient</span>
        <div>
          <div className="text-2xl font-bold text-white mb-1">Glow Glass</div>
          <div className="text-white/50 text-sm">Ambient glow orbs + frosted border</div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LOADING / SKELETON DEMOS
───────────────────────────────────────────────────────────────────────────── */
const LoadingSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setLoading(false); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const reset = () => { setLoading(true); setProgress(0); };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Skeleton */}
      <DemoCard title="Skeleton Loader" tag="CSS animate-pulse" tagColor="bg-rose-500/20 text-rose-300 border-rose-500/30">
        <div className="w-full space-y-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2" />
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded animate-pulse" />
          <div className="h-2 bg-slate-700 rounded animate-pulse w-4/5" />
          <div className="h-2 bg-slate-700 rounded animate-pulse w-2/3" />
        </div>
      </DemoCard>

      {/* Spinner variants */}
      <DemoCard title="Spinner Variants" tag="CSS keyframe" tagColor="bg-rose-500/20 text-rose-300 border-rose-500/30">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
          <div className="w-8 h-8 border-4 border-transparent border-b-cyan-400 border-r-cyan-400 rounded-full animate-spin" />
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </DemoCard>

      {/* Progress bar with callback */}
      <DemoCard title="Progress → Reveal" tag="React state" tagColor="bg-rose-500/20 text-rose-300 border-rose-500/30">
        {loading ? (
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Analyzing documents…</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-[fadeUp_0.5s_ease_forwards]">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <span className="text-emerald-400 text-sm font-medium">Analysis Complete!</span>
            <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer mt-1">↺ replay</button>
          </div>
        )}
      </DemoCard>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export const ShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes gradientShift { 0%{background-position:0%} 50%{background-position:100%} 100%{background-position:0%} }
      @keyframes rotateConic { to{--angle:360deg} }
      @keyframes orbit { from{transform:rotate(0deg) translateX(32px)} to{transform:rotate(360deg) translateX(32px)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const sections = [
    { id: 'hover', icon: <MousePointer size={18} />, title: 'Hover Transitions', subtitle: 'CSS :hover, transforms, and interactive micro-animations on cursor contact.', color: 'text-blue-400' },
    { id: 'state', icon: <Zap size={18} />, title: 'State Transitions', subtitle: 'React useState-driven transitions: tabs, toggles, accordions, morphs.', color: 'text-emerald-400' },
    { id: 'scroll', icon: <Move size={18} />, title: 'Scroll Animations (GSAP)', subtitle: 'GSAP ScrollTrigger — count-up, bar fill, stagger reveal, cascade slide-in.', color: 'text-fuchsia-400' },
    { id: 'geometric', icon: <Sparkles size={18} />, title: 'Geometric & Keyframe', subtitle: 'CSS @keyframe animations: orbits, pulses, floats, conic gradients, particles.', color: 'text-amber-400' },
    { id: 'pagetrans', icon: <Layers size={18} />, title: 'Page Transitions', subtitle: 'Simulated full-page transition overlays: fade, slide, zoom, curtain.', color: 'text-violet-400' },
    { id: 'glass', icon: <Eye size={18} />, title: 'Glassmorphism Depths', subtitle: 'Three levels of frosted glass: standard, deep-frost, and ambient neon glow.', color: 'text-cyan-400' },
    { id: 'loading', icon: <Clock size={18} />, title: 'Loading & Skeletons', subtitle: 'Skeleton loaders, spinner variants, and a progress-to-reveal sequence.', color: 'text-rose-400' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      {/* Sticky header */}
      <div ref={headerRef} className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400" />
            <span className="font-semibold text-sm text-slate-200">Transition Showcase</span>
          </div>
          <div className="flex items-center gap-2">
            {sections.map(s => (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className="w-1.5 h-1.5 rounded-full bg-slate-700 hover:bg-blue-400 transition-colors cursor-pointer" title={s.title} />
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-10 text-center py-24 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
          <Play size={14} fill="currentColor" /> Live Interactive Demos
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
          Transition Showcase
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Every animation technique available in the current stack — all live, all interactive.
        </p>

        {/* Jump links */}
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 cursor-pointer bg-slate-900/60 border-slate-700 hover:border-slate-500 ${s.color}`}>
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* All demo sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 space-y-24">
        {/* Hover */}
        <div id="hover">
          <SectionHeader icon={<MousePointer size={18} />} title="Hover Transitions" subtitle="CSS :hover, transforms, and interactive micro-animations on cursor contact." color="text-blue-400" />
          <HoverSection />
        </div>

        {/* State */}
        <div id="state">
          <SectionHeader icon={<Zap size={18} />} title="State Transitions" subtitle="React useState-driven transitions: tabs, toggles, accordions, morphs and ripples." color="text-emerald-400" />
          <StateSection />
        </div>

        {/* GSAP Scroll */}
        <div id="scroll">
          <SectionHeader icon={<Move size={18} />} title="Scroll Animations (GSAP)" subtitle="GSAP ScrollTrigger — count-up, bar fill, stagger reveal, and cascade slide-in on enter." color="text-fuchsia-400" />
          <ScrollSection />
        </div>

        {/* Geometric */}
        <div id="geometric">
          <SectionHeader icon={<Sparkles size={18} />} title="Geometric & Keyframe" subtitle="CSS @keyframe animations: spinning orbits, sonar pulses, floats, conic gradients, and particle systems." color="text-amber-400" />
          <GeometricSection />
        </div>

        {/* Page Transitions */}
        <div id="pagetrans">
          <SectionHeader icon={<Layers size={18} />} title="Page Transitions" subtitle="Simulated full-page transition overlays. Click each type to see the effect." color="text-violet-400" />
          <PageTransitionSection />
        </div>

        {/* Glass */}
        <div id="glass">
          <SectionHeader icon={<Eye size={18} />} title="Glassmorphism Depths" subtitle="Three glassmorphism levels — standard frosted, deep frost with patterns, and ambient neon glow." color="text-cyan-400" />
          <GlassSection />
        </div>

        {/* Loading */}
        <div id="loading">
          <SectionHeader icon={<Clock size={18} />} title="Loading States & Skeletons" subtitle="Skeleton loaders, spinner variants, and a live progress-to-completion sequence." color="text-rose-400" />
          <LoadingSection />
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-10 border-t border-slate-800">
          <p className="text-slate-500 mb-6">Want to use any of these in the main experience?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] cursor-pointer">
              ← Back to Onboarding
            </button>
            <button
              onClick={() => navigate('/cinematic')}
              className="px-8 py-3 rounded-full border border-slate-600 hover:border-white/40 text-slate-300 hover:text-white font-semibold transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <span className="text-base">✦</span> EverSwap-Style Cinematic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
