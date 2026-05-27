import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterSection } from '../components/ChapterSection';
import { FloatingTimeline } from '../components/FloatingTimeline';
import { ChevronDown, BarChart3, ShieldCheck, Zap, ArrowRight, Brain, Target, Users, Play, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const SECTIONS = [
    { id: 'hero', label: 'Start' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'Process' },
    { id: 'preview', label: 'Demo' },
    { id: 'cta', label: 'Action' }
  ];

  return (
    <div className="relative min-h-screen">
      <FloatingTimeline sections={SECTIONS} />
      
      {/* Hero Chapter */}
      <ChapterSection id="hero" className="min-h-screen flex flex-col justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Transform Your Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
          Discover the true maturity of your project management office with our AI-powered semantic analysis platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/process')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 cursor-pointer"
          >
            See How It Works <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-transparent border border-blue-400/30 hover:bg-blue-900/50 text-white rounded-full font-semibold transition-all cursor-pointer">
            View Sample Report
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <ChevronDown size={32} />
        </div>
      </ChapterSection>

      {/* Powerful Features Chapter */}
      <ChapterSection id="features" className="bg-blue-900/40 backdrop-blur-md">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-blue-200">Everything you need to assess and improve your project management maturity</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Brain size={40} className="text-indigo-400 mb-4" />, title: 'AI-Powered Analysis', desc: 'Advanced AI evaluates your project documentation, identifying quality, completeness, and alignment with PM best practices.' },
            { icon: <BarChart3 size={40} className="text-cyan-400 mb-4" />, title: 'Maturity Scoring', desc: 'Receive comprehensive maturity scores across 8 Performance Domains and 7 Knowledge Areas based on PMBOK 8 standards.' },
            { icon: <Target size={40} className="text-emerald-400 mb-4" />, title: 'Actionable Insights', desc: 'Get specific, actionable recommendations to improve your project management practices and organizational maturity.' },
            { icon: <ShieldCheck size={40} className="text-blue-400 mb-4" />, title: 'Secure & Private', desc: 'Your documents are processed securely with enterprise-grade encryption. All data is kept confidential and private.' },
            { icon: <Zap size={40} className="text-yellow-400 mb-4" />, title: 'Fast Processing', desc: 'Get results in minutes, not days. Our AI processes documents quickly and provides instant feedback on quality and maturity.' },
            { icon: <Users size={40} className="text-purple-400 mb-4" />, title: 'Team Collaboration', desc: 'Share assessment results with your team, track progress over time, and collaborate on improvement initiatives.' }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-blue-900/40 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-800/50 transition-all hover:-translate-y-1">
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-blue-200/80 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </ChapterSection>

      {/* How It Works Chapter */}
      <ChapterSection id="how-it-works" className="bg-blue-950/60 backdrop-blur-lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-blue-200">Simple, fast, and effective - get started in minutes</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
          
          {[
            { step: '1', title: 'Register & Upload', desc: 'Create your account and upload your project documents. We support PDF, DOCX, TXT, and Markdown formats.' },
            { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes your documents, extracts key information, and evaluates quality and completeness.' },
            { step: '3', title: 'Get Results', desc: 'Receive comprehensive maturity scores, quality assessments, and actionable recommendations.' },
            { step: '4', title: 'Take Action', desc: 'Use the insights to improve your PM practices and track your progress over time.' }
          ].map((item, idx) => (
            <div key={idx} className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-blue-900/80 border-2 border-blue-500/50 rounded-full flex items-center justify-center text-4xl font-bold text-blue-300 mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] group-hover:scale-110 group-hover:border-blue-400 group-hover:text-white transition-all z-10 relative backdrop-blur-md">
                {item.step}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
              <p className="text-blue-200/80 leading-relaxed text-sm md:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button 
            onClick={() => {
              window.scrollTo(0,0);
              navigate('/process');
            }}
            className="px-8 py-3 bg-transparent border border-blue-400/50 hover:bg-blue-900/50 text-white rounded-full font-semibold transition-all cursor-pointer"
          >
            View Detailed Journey
          </button>
        </div>
      </ChapterSection>

      {/* Interactive Demo Preview Chapter */}
      <ChapterSection id="preview" className="bg-blue-900/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-4">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium mb-6">
              <Play size={16} /> Interactive Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">See Your Results Before You Start</h2>
            <p className="text-xl text-blue-200 max-w-2xl mb-10">
              Explore an interactive preview of your assessment results with sample data. Preview exactly what your maturity assessment will look like and how actionable the insights are.
            </p>
            <button 
              onClick={() => {
                window.scrollTo(0,0);
                navigate('/demo-journey');
              }}
              className="px-8 py-4 bg-transparent border-2 border-emerald-500 hover:bg-emerald-900/40 text-emerald-300 hover:text-emerald-100 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-3 cursor-pointer"
            >
              <Play fill="currentColor" size={20} /> Try Interactive Demo
            </button>
            <p className="text-sm text-blue-400/60 mt-4 ml-4">Explore full sample results with all 10 tabs and industry-specific examples</p>
          </div>

          {/* Dashboard Mockup Card */}
          <div className="flex-1 w-full">
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl transform hover:scale-[1.02] transition-transform duration-500">
              {/* Glass reflection */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-400" /> Assessment Dashboard
                </h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                </div>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-400 mb-1">Maturity Level</div>
                  <div className="text-2xl font-bold text-cyan-400">3.5</div>
                  <div className="text-xs text-cyan-500/80 mt-1">Defined</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-400 mb-1">Quality Score</div>
                  <div className="text-2xl font-bold text-emerald-400">72%</div>
                  <div className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1"><TrendingUp size={12}/> +5%</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-400 mb-1">Documents</div>
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-blue-500/80 mt-1">Analyzed</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-sm text-slate-400 mb-1">Gaps Found</div>
                  <div className="text-2xl font-bold text-rose-400">8</div>
                  <div className="text-xs text-rose-500/80 mt-1">High Priority</div>
                </div>
              </div>

              {/* Bottom 2 columns */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Top Performance Domains</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Delivery', score: 4.6, color: 'bg-emerald-500' },
                      { name: 'Team', score: 4.2, color: 'bg-cyan-500' },
                      { name: 'Planning', score: 3.5, color: 'bg-blue-500' },
                      { name: 'Stakeholders', score: 3.2, color: 'bg-indigo-500' }
                    ].map(domain => (
                      <div key={domain.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{domain.name}</span>
                          <span className="font-mono text-slate-400">{domain.score}/5.0</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className={`${domain.color} h-1.5 rounded-full`} style={{ width: `${(domain.score / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Key Improvement Areas</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-slate-300 items-start">
                      <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <span>Quality Management Plan needs improvement</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300 items-start">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>Risk Register missing key risks</span>
                    </li>
                    <li className="flex gap-3 text-sm text-slate-300 items-start">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>Stakeholder analysis incomplete</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Overlay button on mockup */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] rounded-2xl cursor-pointer" onClick={() => {
                window.scrollTo(0,0);
                navigate('/demo-journey');
              }}>
                <div className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-xl flex items-center gap-2 transform translate-y-4 hover:translate-y-0 transition-all duration-300">
                  <Play fill="currentColor" size={16} /> Start Interactive Tour
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* CTA Chapter */}
      <ChapterSection id="cta" className="text-center bg-blue-950 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/60 to-blue-800/30 border border-blue-500/40 p-12 md:p-20 rounded-3xl backdrop-blur-md shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to elevate your governance?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Join enterprise leaders who use ADPA to drive predictable, high-quality project outcomes.
          </p>
          <button 
            onClick={() => {
              window.scrollTo(0,0);
              navigate('/process');
            }}
            className="inline-block px-10 py-5 bg-white text-blue-900 hover:bg-blue-50 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] cursor-pointer"
          >
            Explore the Process
          </button>

          {/* Secondary links */}
          <div className="mt-12 pt-8 border-t border-blue-500/20 flex flex-wrap justify-center gap-6 text-sm">
            <button onClick={() => { window.scrollTo(0,0); navigate('/demo-journey'); }}
              className="text-blue-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
              <Play size={13} fill="currentColor" /> Interactive Demo
            </button>
            <button onClick={() => { window.scrollTo(0,0); navigate('/maturity-levels'); }}
              className="text-blue-400 hover:text-white transition-colors cursor-pointer">
              Maturity Levels
            </button>
            <button onClick={() => { window.scrollTo(0,0); navigate('/showcase'); }}
              className="text-blue-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
              ✦ Transition Showcase
            </button>
          </div>
        </div>
      </ChapterSection>
    </div>
  );
};
