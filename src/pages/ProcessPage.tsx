import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterSection } from '../components/ChapterSection';
import { FloatingTimeline } from '../components/FloatingTimeline';
import { Upload, Brain, Target, Lock, BarChart3, ArrowLeft } from 'lucide-react';

export const ProcessPage: React.FC = () => {
  const navigate = useNavigate();

  const SECTIONS = [
    { id: 'intro', label: 'The Process' },
    { id: 'step-1', label: 'Step 1' },
    { id: 'step-2', label: 'Step 2' },
    { id: 'step-3', label: 'Step 3' },
    { id: 'step-4', label: 'Step 4' },
    { id: 'step-5', label: 'Step 5' }
  ];

  return (
    <div className="relative min-h-screen">
      <FloatingTimeline sections={SECTIONS} />
      
      {/* Intro Chapter */}
      <ChapterSection id="intro" className="min-h-screen flex flex-col justify-center text-center">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-10 left-10 flex items-center gap-2 text-blue-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Overview
        </button>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
          How It Works
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
          A seamless 5-step journey from raw project artifacts to actionable intelligence.
        </p>
      </ChapterSection>

      {/* Step 1 */}
      <ChapterSection id="step-1" className="bg-blue-900/60 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto px-8">
          <div className="flex-1 text-left">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
              <Upload size={32} className="text-white" />
            </div>
            <h3 className="text-blue-400 font-bold tracking-widest uppercase mb-2">Step 01</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Register & Upload</h2>
            <p className="text-xl text-blue-200 max-w-2xl">
              Create your secure account and bulk-upload your project artifacts. We support PDF, DOCX, TXT, and Markdown. Our secure zone ensures your confidential data remains private.
            </p>
          </div>
          <div className="flex-1">
            <img 
              src="/images/Gemini_Generated_Image_uaxo9uuaxo9uuaxo.png" 
              alt="Register and Upload" 
              className="rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </ChapterSection>

      {/* Step 2 */}
      <ChapterSection id="step-2" className="bg-blue-900/70 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto px-8">
          <div className="flex-1 text-left">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(79,70,229,0.5)]">
              <Brain size={32} className="text-white" />
            </div>
            <h3 className="text-indigo-400 font-bold tracking-widest uppercase mb-2">Step 02</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">AI Extraction</h2>
            <p className="text-xl text-blue-200 max-w-2xl">
              Our proprietary semantic engine instantly parses your unstructured data, identifying implicit practices, artifacts, and processes without relying solely on what your team self-reports.
            </p>
          </div>
          <div className="flex-1">
            <img 
              src="/images/Gemini_Generated_Image_lm1c4plm1c4plm1c.png" 
              alt="AI Extraction" 
              className="rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-[float_7s_ease-in-out_infinite_reverse]"
            />
          </div>
        </div>
      </ChapterSection>

      {/* Step 3 */}
      <ChapterSection id="step-3" className="bg-blue-900/80 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto px-8">
          <div className="flex-1 text-left">
            <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(8,145,178,0.5)]">
              <BarChart3 size={32} className="text-white" />
            </div>
            <h3 className="text-cyan-400 font-bold tracking-widest uppercase mb-2">Step 03</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Maturity Scoring</h2>
            <p className="text-xl text-blue-200 max-w-2xl">
              We map the extracted insights against our comprehensive maturity framework (Initial to Optimizing), instantly generating a precise score across your entire portfolio.
            </p>
          </div>
          <div className="flex-1">
            <img 
              src="/images/Gemini_Generated_Image_xacsvtxacsvtxacs.png" 
              alt="Maturity Scoring" 
              className="rounded-3xl shadow-[0_0_50px_rgba(8,145,178,0.3)] animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </ChapterSection>

      {/* Step 4 */}
      <ChapterSection id="step-4" className="bg-blue-950/80 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 max-w-6xl mx-auto px-8">
          <div className="flex-1 text-left">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(5,150,105,0.5)]">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-emerald-400 font-bold tracking-widest uppercase mb-2">Step 04</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Actionable Insights</h2>
            <p className="text-xl text-blue-200 max-w-2xl">
              Don't just get a score. Receive a prioritized roadmap of precisely what to fix, tailored to your organization's specific gaps to reach the next maturity tier.
            </p>
          </div>
          <div className="flex-1">
            <img 
              src="/images/Gemini_Generated_Image_rj3lqrrj3lqrrj3l.png" 
              alt="Actionable Insights" 
              className="rounded-3xl shadow-[0_0_50px_rgba(5,150,105,0.3)] animate-[float_7s_ease-in-out_infinite_reverse]"
            />
          </div>
        </div>
      </ChapterSection>

      {/* Step 5 */}
      <ChapterSection id="step-5" className="bg-blue-950/90 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto px-8">
          <div className="flex-1 text-left">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(147,51,234,0.5)]">
              <Lock size={32} className="text-white" />
            </div>
            <h3 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Step 05</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Review & Collaborate</h2>
            <p className="text-xl text-blue-200 max-w-2xl mb-12">
              Share the detailed dashboard securely with your team. Explore your exact maturity score, critical gaps, and collaborate on the roadmap forward.
            </p>
            <button 
              onClick={() => {
                window.scrollTo(0,0);
                navigate('/maturity-levels');
              }}
              className="px-8 py-4 bg-transparent border border-purple-400 hover:bg-purple-900/50 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] cursor-pointer"
            >
              Understanding Maturity Levels
            </button>
          </div>
          <div className="flex-1">
            <img 
              src="/images/Gemini_Generated_Image_w8t7bew8t7bew8t7.png" 
              alt="Review and Collaborate" 
              className="rounded-3xl shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </ChapterSection>
    </div>
  );
};
