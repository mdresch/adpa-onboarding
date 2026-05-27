import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterSection } from '../components/ChapterSection';
import { FloatingTimeline } from '../components/FloatingTimeline';
import { ChevronDown, Circle, Triangle, Square, Pentagon, Hexagon, ArrowLeft } from 'lucide-react';

export const MaturityLevelsPage: React.FC = () => {
  const navigate = useNavigate();

  const SECTIONS = [
    { id: 'intro', label: 'Overview' },
    { id: 'level-1', label: 'Level 1' },
    { id: 'level-2', label: 'Level 2' },
    { id: 'level-3', label: 'Level 3' },
    { id: 'level-4', label: 'Level 4' },
    { id: 'level-5', label: 'Level 5' }
  ];

  return (
    <div className="relative min-h-screen">
      <FloatingTimeline sections={SECTIONS} />
      
      {/* Intro Chapter */}
      <ChapterSection id="intro" className="min-h-screen flex flex-col justify-center text-center">
        <button 
          onClick={() => navigate('/process')}
          className="absolute top-10 left-10 flex items-center gap-2 text-blue-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Process
        </button>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
          The 5 Levels of Maturity
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
          From ad-hoc processes to continuous optimization. Understand the journey to project management excellence.
        </p>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <ChevronDown size={32} />
        </div>
      </ChapterSection>

      {/* Level 1: Initial */}
      <ChapterSection id="level-1" className="bg-blue-900/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-blue-400 font-bold tracking-widest uppercase mb-2">Level 1</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Initial</h2>
            <p className="text-xl text-blue-200 mb-6">
              Processes are usually ad-hoc, and the organization usually does not provide a stable environment. Success in these organizations depends on the competence and heroics of the people in the organization and not on the use of proven processes.
            </p>
            <ul className="text-blue-300 space-y-2">
              <li>• Unpredictable outcomes</li>
              <li>• Reactive management style</li>
              <li>• Heavy reliance on individual heroes</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <Circle size={100} className="text-blue-400" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Level 2: Managed */}
      <ChapterSection id="level-2" className="bg-blue-900/50 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-indigo-400 font-bold tracking-widest uppercase mb-2">Level 2</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Managed</h2>
            <p className="text-xl text-blue-200 mb-6">
              Projects have ensured that requirements are managed and that processes are planned, performed, measured, and controlled. The discipline helps ensure that existing practices are retained during times of stress.
            </p>
            <ul className="text-blue-300 space-y-2">
              <li>• Project-level discipline</li>
              <li>• Basic project management controls</li>
              <li>• Repeatable previous successes</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/40 rounded-full animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-4 border border-dashed border-indigo-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
              <Triangle size={100} className="text-indigo-400" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Level 3: Defined */}
      <ChapterSection id="level-3" className="bg-blue-900/60 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-cyan-400 font-bold tracking-widest uppercase mb-2">Level 3</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Defined</h2>
            <p className="text-xl text-blue-200 mb-6">
              Processes are well characterized and understood, and are described in standards, procedures, tools, and methods. The organization's set of standard processes is established and improved over time.
            </p>
            <ul className="text-blue-300 space-y-2">
              <li>• Organizational standards</li>
              <li>• Proactive management style</li>
              <li>• Tailored standard processes</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-full animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-4 border border-cyan-400/40 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              <div className="absolute inset-8 border border-dashed border-cyan-300/30 rounded-full animate-[spin_14s_linear_infinite]" />
              <Square size={100} className="text-cyan-400" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Level 4: Quantitatively Managed */}
      <ChapterSection id="level-4" className="bg-blue-950/70 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-emerald-400 font-bold tracking-widest uppercase mb-2">Level 4</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Quantitatively Managed</h2>
            <p className="text-xl text-blue-200 mb-6">
              Quantitative objectives for quality and process performance are established and used as criteria in managing processes. Quantitative data is based on the needs of the customer, end users, organization, and process implementers.
            </p>
            <ul className="text-blue-300 space-y-2">
              <li>• Data-driven control</li>
              <li>• Statistical process measurement</li>
              <li>• Predictable performance</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-emerald-500/60 rounded-full animate-[spin_5s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-emerald-400/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-8 border border-emerald-300/40 rounded-full animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-12 border border-dashed border-emerald-200/30 rounded-full animate-[spin_16s_linear_infinite_reverse]" />
              <Pentagon size={100} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Level 5: Optimizing */}
      <ChapterSection id="level-5" className="bg-blue-950/90 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Level 5</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Optimizing</h2>
            <p className="text-xl text-blue-200 mb-6">
              An organization continually improves its processes based on a quantitative understanding of the common causes of variation inherent in processes. Focus is on continually improving performance through incremental and innovative technological improvements.
            </p>
            <ul className="text-blue-300 space-y-2">
              <li>• Continuous improvement</li>
              <li>• Innovation driven</li>
              <li>• Agile adaptation to change</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-purple-500/80 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-purple-400/60 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
              <div className="absolute inset-8 border-2 border-purple-300/50 rounded-full animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-12 border-2 border-purple-200/40 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              <div className="absolute inset-16 border border-dashed border-purple-100/30 rounded-full animate-[spin_12s_linear_infinite]" />
              <Hexagon size={100} className="text-purple-400" />
            </div>
          </div>
        </div>
      </ChapterSection>
    </div>
  );
};
