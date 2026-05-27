import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChapterSection } from '../components/ChapterSection';
import { FloatingTimeline } from '../components/FloatingTimeline';
import { 
  ArrowLeft, ChevronDown, LayoutDashboard, Compass, Files, AlertCircle, Lightbulb, 
  BarChart, TrendingUp, Grid, Shield, CheckSquare, Play, RefreshCw, Layers,
  FileText, AlertTriangle, ArrowRight, CircleDashed, Clock
} from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const TOUR_STEPS = [
  {
    tab: 'Overview',
    highlightSelector: 'maturity-card',
    featureName: "Executive Maturity Scorecard",
    description: "Aggregates overall organization PMBOK maturity and critical action counts for leadership review.",
  },
  {
    tab: 'Maturity Journey',
    highlightSelector: 'current-state-badge',
    featureName: "Dynamic Progression Tracker",
    description: "Visualizes the current CMMI level status and calculates the strategic gap to reach the next tier.",
  },
  {
    tab: 'Documents',
    highlightSelector: 'audit-table',
    featureName: "Continuous Artifact Audits",
    description: "Semantic parser scans and grades incoming templates on clarity, governance, and completeness.",
  },
  {
    tab: 'Gaps',
    highlightSelector: 'gap-list',
    featureName: "Compliance Gap Analysis",
    description: "Flags missing processes (like quantitative risk models) and ranks severity exposure.",
  },
  {
    tab: 'Recommendations',
    highlightSelector: 'rec-grid',
    featureName: "AI-Generated Action Items",
    description: "Synthesizes contextual remediation recommendations based on best practices and standards.",
  },
  {
    tab: 'Benchmarks',
    highlightSelector: 'bench-bars',
    featureName: "Industry Competitiveness Index",
    description: "Benchmarks your performance against industry averages and top-quartile leaders.",
  },
  {
    tab: 'ROI',
    highlightSelector: 'roi-cards',
    featureName: "Value Realization Modeler",
    description: "Projects financial and time savings based on reduced project waste and higher delivery success.",
  },
  {
    tab: 'Performance Domains',
    highlightSelector: 'domain-grid',
    featureName: "PMBOK 8 Domain Breakdown",
    description: "Granular breakdown of scores across stakeholders, planning, team delivery, and uncertainty management.",
  },
  {
    tab: 'Quality Analysis',
    highlightSelector: 'quality-rings',
    featureName: "Structural Quality Analysis",
    description: "Detailed compliance score checking across grammar, clarity, readability, and structural governance.",
  },
  {
    tab: 'Action Plan',
    highlightSelector: 'sprint-board',
    featureName: "Sequenced Milestone Board",
    description: "Automatically compiles recommendations into timeboxed agile sprint milestones.",
  },
  {
    tab: 'Baseline Comparison',
    highlightSelector: 'baseline-center',
    featureName: "Semantic Version Baseline Control",
    description: "Performs differential entity matching to detect scope drift across project life-cycle versions.",
  }
];

export const DemoJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(true);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [isDashboardInView, setIsDashboardInView] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const dashboardRef = useRef<HTMLDivElement>(null);

  const isHighlighted = (tourKey: string) => {
    return isTourActive && TOUR_STEPS[tourStepIndex]?.highlightSelector === tourKey;
  };

  useEffect(() => {
    if (!isTourActive) {
      setIsDashboardInView(false);
      return;
    }

    const el = dashboardRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=4500',
      pin: true,
      pinSpacing: true,
      scrub: true,
      onToggle: (self) => {
        setIsDashboardInView(self.isActive);
      },
      onUpdate: (self) => {
        const progress = self.progress;
        const totalSteps = TOUR_STEPS.length;
        const step = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
        setTourStepIndex(step);
        setActiveTab(TOUR_STEPS[step].tab);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [isTourActive]);

  useEffect(() => {
    let intervalId: any;
    if (!isTourActive || !isDashboardInView) {
      setStreamedText("");
      setIsHighlightActive(false);
      return;
    }

    setIsHighlightActive(false);
    setStreamedText("");

    const targetText = TOUR_STEPS[tourStepIndex]?.description || "";

    const startDelay = setTimeout(() => {
      setIsHighlightActive(true);
      
      let charIndex = 0;
      intervalId = setInterval(() => {
        if (charIndex < targetText.length) {
          setStreamedText(prev => prev + targetText.charAt(charIndex));
          charIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 15);
    }, 1000); // 1s delay before popout & typewriter

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, [tourStepIndex, isTourActive, isDashboardInView]);

  // Baseline states
  const [projectText, setProjectText] = useState(
    `Project Hermes: Upgrade our e-commerce portal to React/Next.js.\n\nStakeholders: PM Menno, Lead Dev Sarah, VP Jane.\n\nRisks: 3rd party API integration delay, legacy database migration latency.\n\nDeliverables: responsive catalog page, Stripe payment gateway integration, checkout flow optimization.\n\nQuality Metrics: Page load time < 1.5s, checkout success rate > 99%.`
  );
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Baselines storage
  const [baselines, setBaselines] = useState<Array<{
    name: string;
    timestamp: string;
    stakeholders: string[];
    risks: string[];
    deliverables: string[];
    metrics: string[];
  }>>([
    {
      name: "Initial Assessment",
      timestamp: "14:10",
      stakeholders: ["PM Menno", "Lead Dev Sarah", "VP Jane"],
      risks: ["3rd party API integration delay", "Legacy database migration latency"],
      deliverables: ["Responsive catalog page", "Stripe payment gateway integration"],
      metrics: ["Page load time < 1.5s"]
    }
  ]);

  const [activeBaselineIdx, setActiveBaselineIdx] = useState(0);
  const [referenceBaselineIdx, setReferenceBaselineIdx] = useState(0);

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const text = projectText;
      const lines = text.split('\n');
      const extractedStakeholders: string[] = [];
      const extractedRisks: string[] = [];
      const extractedDeliverables: string[] = [];
      const extractedMetrics: string[] = [];

      const addUnique = (arr: string[], item: string) => {
        const clean = item.trim().replace(/^[•\-\*\d\.\s➔✓+]+/, '').trim();
        if (clean && clean.length > 2 && !arr.some(x => x.toLowerCase() === clean.toLowerCase())) {
          arr.push(clean);
        }
      };

      lines.forEach(line => {
        const lower = line.toLowerCase();

        if (lower.includes('stakeholder')) {
          const parts = line.split(/stakeholders?:?/i);
          if (parts[1]) {
            parts[1].split(/[,;|]/).forEach(s => addUnique(extractedStakeholders, s));
          }
        } else if (lower.includes('risk')) {
          const parts = line.split(/risks?:?/i);
          if (parts[1]) {
            parts[1].split(/[,;|]/).forEach(s => addUnique(extractedRisks, s));
          }
        } else if (lower.includes('deliverable')) {
          const parts = line.split(/deliverables?:?/i);
          if (parts[1]) {
            parts[1].split(/[,;|]/).forEach(s => addUnique(extractedDeliverables, s));
          }
        } else if (lower.includes('metric') || lower.includes('kpi') || lower.includes('target') || lower.includes('load time') || lower.includes('success rate')) {
          const parts = line.split(/(?:metrics?|kpis?|targets?):?/i);
          const targetStr = parts[1] || line;
          targetStr.split(/[,;|]/).forEach(s => {
            if (s.trim().length > 3) addUnique(extractedMetrics, s);
          });
        } else {
          // Heuristics for natural text
          const shPatterns = [
            /(?:pm|project manager|dev|developer|vp|lead|sponsor|owner|stakeholder|architect|manager)\s+(?:is|named|called|includes?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:joins|joined|is the|serves as|acts as|to stakeholders)/gi
          ];
          shPatterns.forEach(regex => {
            let match;
            while ((match = regex.exec(line)) !== null) {
              addUnique(extractedStakeholders, match[1]);
            }
          });

          const metricPatterns = [
            /[a-zA-Z\s]+(?:<|>|=|<=|>=|under|above|less than|greater than)\s*\d+(?:\.\d+)?(?:%|s|ms|fps)?/gi
          ];
          metricPatterns.forEach(regex => {
            let match;
            while ((match = regex.exec(line)) !== null) {
              addUnique(extractedMetrics, match[0]);
            }
          });

          if (line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
            const itemContent = line.trim().replace(/^[-*•\d\.\s]+/, '');
            if (lower.includes('delay') || lower.includes('latency') || lower.includes('failure') || lower.includes('burnout') || lower.includes('risk')) {
              addUnique(extractedRisks, itemContent);
            } else if (lower.includes('catalog') || lower.includes('integration') || lower.includes('optimization') || lower.includes('support') || lower.includes('engine') || lower.includes('deliverable')) {
              addUnique(extractedDeliverables, itemContent);
            } else if (lower.includes('%') || lower.includes('<') || lower.includes('>') || lower.includes('ms')) {
              addUnique(extractedMetrics, itemContent);
            }
          }
        }
      });

      if (extractedStakeholders.length === 0) extractedStakeholders.push("PM Menno", "Lead Dev Sarah");
      if (extractedRisks.length === 0) extractedRisks.push("API Integration Delay");
      if (extractedDeliverables.length === 0) extractedDeliverables.push("Core Portal Features");
      if (extractedMetrics.length === 0) extractedMetrics.push("Page load time < 1.5s");

      const newBaseline = {
        name: `Baseline v${baselines.length + 1}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stakeholders: extractedStakeholders,
        risks: extractedRisks,
        deliverables: extractedDeliverables,
        metrics: extractedMetrics
      };

      setBaselines([...baselines, newBaseline]);
      setActiveBaselineIdx(baselines.length);
      setIsExtracting(false);
    }, 1500);
  };

  const SECTIONS = [
    { id: 'intro', label: 'Start Tour' },
    { id: 'tab-1', label: 'Overview' },
    { id: 'tab-2', label: 'Journey' },
    { id: 'tab-3', label: 'Documents' },
    { id: 'tab-4', label: 'Gaps' },
    { id: 'tab-5', label: 'Recommendations' },
    { id: 'tab-6', label: 'Benchmarks' },
    { id: 'tab-7', label: 'ROI' },
    { id: 'tab-8', label: 'Domains' },
    { id: 'tab-9', label: 'Quality' },
    { id: 'tab-10', label: 'Action Plan' },
    { id: 'dashboard', label: 'Interactive Tool' }
  ];

  const TABS = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Maturity Journey', icon: Compass },
    { name: 'Documents', icon: Files },
    { name: 'Gaps', icon: AlertCircle },
    { name: 'Recommendations', icon: Lightbulb },
    { name: 'Benchmarks', icon: BarChart },
    { name: 'ROI', icon: TrendingUp },
    { name: 'Performance Domains', icon: Grid },
    { name: 'Quality Analysis', icon: Shield },
    { name: 'Action Plan', icon: CheckSquare },
    { name: 'Baseline Comparison', icon: Layers }
  ];

  const renderOverview = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Executive Overview</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className={`bg-slate-800 rounded-lg p-5 border border-slate-700 transition-all duration-300 ${
          isHighlighted('maturity-card') 
            ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.06] -translate-y-2 z-50 relative bg-slate-750' 
            : ''
        }`}>
          <div className="text-sm text-slate-400 mb-2">Overall Maturity</div>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-white">3.5</div>
            <div className="text-sm text-cyan-400 mb-1">Defined</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Quality Score</div>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-white">72%</div>
            <div className="text-sm text-emerald-400 mb-1 flex items-center gap-1"><TrendingUp size={14}/> Top Quartile</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Critical Gaps</div>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-rose-400">8</div>
            <div className="text-sm text-slate-400 mb-1">Items require attention</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
          <div className="text-slate-400 text-sm mb-4 font-medium uppercase tracking-widest">Performance Radar</div>
          <div className="w-48 h-48 rounded-full border border-slate-700 relative flex items-center justify-center">
             <div className="absolute inset-4 rounded-full border border-slate-700"></div>
             <div className="absolute inset-8 rounded-full border border-slate-700"></div>
             <div className="absolute inset-12 rounded-full border border-slate-700"></div>
             <Grid size={40} className="text-blue-500/20 absolute" />
             <svg className="absolute inset-0 w-full h-full text-blue-500/40" viewBox="0 0 100 100">
               <polygon points="50,10 80,30 90,60 60,90 20,70 10,40" fill="currentColor" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
             </svg>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
           <div className="text-slate-400 text-sm mb-4 font-medium uppercase tracking-widest">Priority Actions</div>
           <div className="space-y-4">
             {[
               { title: 'Update Quality Management Plan', priority: 'High', color: 'text-rose-400' },
               { title: 'Establish Formal Risk Register', priority: 'High', color: 'text-rose-400' },
               { title: 'Define Stakeholder Matrix', priority: 'Medium', color: 'text-amber-400' },
               { title: 'Standardize Reporting Cadence', priority: 'Medium', color: 'text-amber-400' },
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-3 p-3 rounded bg-slate-900/50 border border-slate-700/50">
                 <AlertCircle size={16} className={`${item.color} shrink-0 mt-0.5`} />
                 <div>
                   <div className="text-sm text-slate-200">{item.title}</div>
                   <div className="text-xs text-slate-500">{item.priority} Priority</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderMaturityJourney = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Maturity Journey</h2>
      <div className="bg-slate-800 rounded-lg p-10 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-700 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-10 right-[40%] h-1 bg-cyan-500 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
        
        <div className="flex justify-between relative z-10">
          {[
            { level: 1, name: 'Initial', active: true },
            { level: 2, name: 'Managed', active: true },
            { level: 3, name: 'Defined', active: true, current: true },
            { level: 4, name: 'Quantitatively Managed', active: false },
            { level: 5, name: 'Optimizing', active: false }
          ].map((stage, i) => (
            <div key={i} className="flex flex-col items-center gap-4 w-32 text-center">
              <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-slate-900 transition-all duration-300 ${stage.current ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : stage.active ? 'border-cyan-500/50' : 'border-slate-700'} ${
                isHighlighted('current-state-badge') && stage.current
                  ? 'ring-4 ring-blue-500 shadow-[0_0_45px_rgba(59,130,246,0.7)] scale-[1.25] z-50 relative bg-slate-850'
                  : ''
              }`}>
                {stage.current ? <Compass size={20} className="text-cyan-400 animate-pulse" /> : <span className={`font-bold ${stage.active ? 'text-cyan-500' : 'text-slate-600'}`}>{stage.level}</span>}
              </div>
              <div>
                <div className={`font-semibold ${stage.current ? 'text-cyan-400' : stage.active ? 'text-slate-300' : 'text-slate-500'}`}>{stage.name}</div>
                {stage.current && <div className="text-xs text-cyan-500/80 mt-1">Current State</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 bg-cyan-950/30 border border-cyan-900/50 rounded-lg p-6">
        <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2"><ArrowRight size={16}/> Path to Level 4</h4>
        <p className="text-slate-300 text-sm leading-relaxed">To reach "Quantitatively Managed", the organization must establish measurable quality goals and quantitative process control metrics across all delivery units.</p>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Analyzed Documents</h2>
      <div className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 ${
        isHighlighted('audit-table') 
          ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.03] z-50 relative bg-slate-750' 
          : ''
      }`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/50 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Document Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Quality Score</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {[
              { name: 'Project Charter_v2.pdf', type: 'Initiation', score: 92, status: 'Excellent', color: 'emerald' },
              { name: 'Risk_Register_Q3.xlsx', type: 'Planning', score: 45, status: 'Needs Work', color: 'rose' },
              { name: 'Stakeholder_Matrix.docx', type: 'Planning', score: 68, status: 'Adequate', color: 'amber' },
              { name: 'Quality_Mgmt_Plan.pdf', type: 'Planning', score: 30, status: 'Poor', color: 'rose' },
              { name: 'Communication_Plan.pdf', type: 'Execution', score: 85, status: 'Good', color: 'emerald' },
            ].map((doc, i) => (
              <tr key={i} className="hover:bg-slate-800/80 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 text-slate-200">
                  <FileText size={16} className={`text-${doc.color}-400`} />
                  {doc.name}
                </td>
                <td className="px-6 py-4 text-slate-400">{doc.type}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-${doc.color}-500`} style={{ width: `${doc.score}%` }}></div>
                    </div>
                    <span className="text-slate-300 font-mono">{doc.score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${doc.color}-500/10 text-${doc.color}-400 border border-${doc.color}-500/20`}>
                    {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGaps = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Identified Gaps</h2>
      <div className={`grid gap-4 transition-all duration-300 ${
        isHighlighted('gap-list') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.02] z-50 relative' 
          : ''
      }`}>
        {[
          { title: 'Missing Quantitative Risk Analysis', domain: 'Risk Management', severity: 'High', desc: 'The current risk register only utilizes qualitative metrics. PMBOK requires quantitative impact analysis for high-priority risks.', icon: AlertTriangle, color: 'rose' },
          { title: 'Incomplete Stakeholder Engagement Plan', domain: 'Stakeholder Management', severity: 'High', desc: 'Key external stakeholders are missing from the engagement matrix, risking project delays during the approval phase.', icon: AlertTriangle, color: 'rose' },
          { title: 'Undefined Quality Metrics', domain: 'Quality Management', severity: 'Medium', desc: 'The Quality Management Plan lacks specific, measurable acceptance criteria for deliverables.', icon: AlertCircle, color: 'amber' },
          { title: 'Resource Histogram Outdated', domain: 'Resource Management', severity: 'Low', desc: 'Resource allocation charts do not reflect the recent scope changes approved in Change Request #4.', icon: CircleDashed, color: 'blue' }
        ].map((gap, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 flex gap-4 items-start hover:border-slate-600 transition-colors">
            <div className={`mt-1 p-2 rounded-lg bg-${gap.color}-500/10`}>
              <gap.icon size={20} className={`text-${gap.color}-400`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-200 text-lg">{gap.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${gap.color}-500/10 text-${gap.color}-400 border border-${gap.color}-500/20`}>
                  {gap.severity} Severity
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-3">{gap.desc}</p>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Domain: {gap.domain}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">AI Recommendations</h2>
      <div className={`grid md:grid-cols-2 gap-6 transition-all duration-300 ${
        isHighlighted('rec-grid') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.02] z-50 relative' 
          : ''
      }`}>
        {[
          { title: 'Implement Monte Carlo Simulation', effort: 'High Effort', impact: 'High Impact', desc: 'Upgrade risk analysis by implementing Monte Carlo simulations to quantify schedule and cost risk exposure.', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
          { title: 'Create Unified Stakeholder Matrix', effort: 'Low Effort', impact: 'High Impact', desc: 'Consolidate all stakeholder communication preferences into a single, accessible matrix.', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
          { title: 'Define Standard Quality Baselines', effort: 'Medium Effort', impact: 'Medium Impact', desc: 'Establish clear, measurable quality baselines for all Phase 2 deliverables before execution begins.', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
          { title: 'Automate Resource Reporting', effort: 'Medium Effort', impact: 'Low Impact', desc: 'Connect the resource allocation spreadsheet to a BI dashboard for real-time visibility.', bg: 'bg-slate-800', border: 'border-slate-700' }
        ].map((rec, i) => (
          <div key={i} className={`rounded-lg p-6 border ${rec.border} ${rec.bg}`}>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-slate-900/50 rounded text-xs text-slate-300 font-medium">{rec.effort}</span>
              <span className="px-2 py-1 bg-slate-900/50 rounded text-xs text-emerald-400 font-medium">{rec.impact}</span>
            </div>
            <h3 className="font-semibold text-slate-200 text-lg mb-2">{rec.title}</h3>
            <p className="text-slate-400 text-sm">{rec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBenchmarks = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Industry Benchmarks</h2>
      <div className={`bg-slate-800 rounded-lg p-8 border border-slate-700 transition-all duration-300 ${
        isHighlighted('bench-bars') 
          ? 'ring-4 ring-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] scale-[1.03] z-50 relative bg-slate-750' 
          : ''
      }`}>
        <div className="space-y-8">
          {[
            { label: 'Overall PM Maturity', you: 72, industry: 58, top: 85 },
            { label: 'Risk Management Rigor', you: 45, industry: 60, top: 90 },
            { label: 'Agile Delivery Adoption', you: 88, industry: 65, top: 95 },
            { label: 'Quality Assurance Control', you: 50, industry: 55, top: 80 }
          ].map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-200 font-medium">{metric.label}</span>
              </div>
              <div className="space-y-2">
                {/* You */}
                <div className="flex items-center gap-4">
                  <div className="w-24 text-xs text-cyan-400 font-medium text-right">Your Score</div>
                  <div className="flex-1 bg-slate-900 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${metric.you}%` }}></div>
                  </div>
                  <div className="w-8 text-xs font-mono text-slate-400">{metric.you}%</div>
                </div>
                {/* Industry Average */}
                <div className="flex items-center gap-4">
                  <div className="w-24 text-xs text-slate-500 font-medium text-right">Industry Avg</div>
                  <div className="flex-1 bg-slate-900 rounded-full h-1.5">
                    <div className="bg-slate-600 h-1.5 rounded-full" style={{ width: `${metric.industry}%` }}></div>
                  </div>
                  <div className="w-8 text-xs font-mono text-slate-500">{metric.industry}%</div>
                </div>
                {/* Top Performers */}
                <div className="flex items-center gap-4">
                  <div className="w-24 text-xs text-emerald-500/70 font-medium text-right">Top 10%</div>
                  <div className="flex-1 bg-slate-900 rounded-full h-1.5">
                    <div className="bg-emerald-500/50 h-1.5 rounded-full" style={{ width: `${metric.top}%` }}></div>
                  </div>
                  <div className="w-8 text-xs font-mono text-slate-500">{metric.top}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderROI = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Predicted ROI</h2>
      <p className="text-slate-400 mb-8">Estimated financial and operational impact of implementing the top 3 recommendations over a 12-month period.</p>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
        isHighlighted('roi-cards') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.03] z-50 relative' 
          : ''
      }`}>
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800 rounded-lg p-6 border border-emerald-500/30 text-center">
          <div className="text-emerald-400 mb-2 flex justify-center"><TrendingUp size={24} /></div>
          <div className="text-sm text-slate-400 mb-1">Estimated Cost Savings</div>
          <div className="text-4xl font-bold text-white mb-2">$124K</div>
          <div className="text-xs text-emerald-500">Based on reduced rework</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-800 rounded-lg p-6 border border-blue-500/30 text-center">
          <div className="text-blue-400 mb-2 flex justify-center"><Clock size={24} /></div>
          <div className="text-sm text-slate-400 mb-1">Time to Value</div>
          <div className="text-4xl font-bold text-white mb-2">3 Mo</div>
          <div className="text-xs text-blue-400">Payback period</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 rounded-lg p-6 border border-indigo-500/30 text-center">
          <div className="text-indigo-400 mb-2 flex justify-center"><Shield size={24} /></div>
          <div className="text-sm text-slate-400 mb-1">Risk Reduction</div>
          <div className="text-4xl font-bold text-white mb-2">45%</div>
          <div className="text-xs text-indigo-400">Lower compliance failure probability</div>
        </div>
      </div>
    </div>
  );

  const renderDomains = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Performance Domains (PMBOK 8)</h2>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
        isHighlighted('domain-grid') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.02] z-50 relative' 
          : ''
      }`}>
        {[
          { name: 'Stakeholders', score: 3.2, color: 'indigo' },
          { name: 'Team', score: 4.2, color: 'cyan' },
          { name: 'Dev Approach & Life Cycle', score: 4.8, color: 'emerald' },
          { name: 'Planning', score: 3.5, color: 'blue' },
          { name: 'Project Work', score: 4.0, color: 'teal' },
          { name: 'Delivery', score: 4.6, color: 'emerald' },
          { name: 'Measurement', score: 2.8, color: 'rose' },
          { name: 'Uncertainty', score: 2.5, color: 'rose' }
        ].map((domain, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-5 border border-slate-700 hover:bg-slate-750 transition-colors">
            <h3 className="text-slate-300 font-medium text-sm h-10 mb-4">{domain.name}</h3>
            <div className="flex items-end justify-between mb-2">
              <span className={`text-3xl font-bold text-${domain.color}-400`}>{domain.score}</span>
              <span className="text-xs text-slate-500 pb-1">/ 5.0</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div className={`bg-${domain.color}-500 h-1.5 rounded-full`} style={{ width: `${(domain.score / 5) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuality = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Quality Analysis</h2>
      <div className={`grid md:grid-cols-3 gap-6 mb-8 transition-all duration-300 ${
        isHighlighted('quality-rings') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.03] z-50 relative' 
          : ''
      }`}>
        {[
          { label: 'Clarity & Readability', score: 85, color: 'text-blue-400', ring: 'border-blue-500' },
          { label: 'Completeness', score: 62, color: 'text-amber-400', ring: 'border-amber-500' },
          { label: 'Structural Governance', score: 90, color: 'text-emerald-400', ring: 'border-emerald-500' }
        ].map((q, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col items-center text-center">
            <div className={`w-32 h-32 rounded-full border-8 ${q.ring} border-t-transparent border-l-transparent flex items-center justify-center mb-4 transform -rotate-45`}>
              <div className="transform rotate-45">
                <span className={`text-3xl font-bold ${q.color}`}>{q.score}%</span>
              </div>
            </div>
            <h3 className="text-slate-200 font-medium">{q.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActionPlan = () => (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Action Plan (Sprints)</h2>
      <div className={`flex gap-6 overflow-x-auto pb-4 transition-all duration-300 ${
        isHighlighted('sprint-board') 
          ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.4)] scale-[1.02] z-50 relative' 
          : ''
      }`}>
        {/* Sprint 1 */}
        <div className="min-w-[300px] flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <h3 className="font-semibold text-slate-200">Sprint 1: Immediate</h3>
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Next 14 Days</span>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 border-l-4 border-l-rose-500 text-sm text-slate-200">
              Update Quality Management Plan metrics
            </div>
            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 border-l-4 border-l-rose-500 text-sm text-slate-200">
              Establish formal quantitative Risk Register
            </div>
          </div>
        </div>
        
        {/* Sprint 2 */}
        <div className="min-w-[300px] flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <h3 className="font-semibold text-slate-200">Sprint 2: Short-term</h3>
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Days 15 - 30</span>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 border-l-4 border-l-amber-500 text-sm text-slate-200">
              Define comprehensive Stakeholder Matrix
            </div>
            <div className="bg-slate-700/50 p-3 rounded border border-slate-600 border-l-4 border-l-amber-500 text-sm text-slate-200">
              Standardize reporting cadence for Phase 2
            </div>
          </div>
        </div>

        {/* Backlog */}
        <div className="min-w-[300px] flex-1 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed p-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-2">
            <h3 className="font-semibold text-slate-400">Backlog</h3>
            <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">Future</span>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-3 rounded border border-slate-700 border-l-4 border-l-blue-500 text-sm text-slate-400">
              Automate resource reporting dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBaselineComparison = () => {
    const base1 = baselines[referenceBaselineIdx] || baselines[0];
    const base2 = baselines[activeBaselineIdx] || baselines[0];

    const SCENARIOS = [
      {
        name: "Initial Concept",
        text: "Project Hermes: Upgrade our e-commerce portal to React/Next.js.\n\nStakeholders: PM Menno, Lead Dev Sarah, VP Jane.\n\nRisks: 3rd party API integration delay, legacy database migration latency.\n\nDeliverables: responsive catalog page, Stripe payment gateway integration.\n\nQuality Metrics: Page load time < 1.5s, checkout success rate > 99%."
      },
      {
        name: "Scope Creep Update",
        text: "Project Hermes Update: PM Menno, Lead Dev Sarah, VP Jane, Architect Alex. QA Lead Dave has joined to ensure standard conformance.\n\nRisks: 3rd party API integration delay, legacy database migration latency, search indexing failures, team burnout due to tight deadlines.\n\nDeliverables: responsive catalog page, Stripe payment gateway integration, checkout flow optimization, multi-language support, loyalty points engine.\n\nQuality Metrics: Page load time < 1.0s, checkout success rate > 99.5%, test coverage > 85%."
      },
      {
        name: "Mitigation & Descoping",
        text: "Project Hermes Descoping: Stakeholders include PM Menno, Lead Dev Sarah, VP Jane, Architect Alex, QA Lead Dave, and Release Manager John.\n\nRisks: legacy database migration latency, team burnout.\n\nDeliverables: responsive catalog page, Stripe payment gateway, checkout flow optimization. Removed multi-language support and loyalty points engine for Phase 1.\n\nQuality Metrics: Page load time < 1.5s, checkout success rate > 99%."
      }
    ];

    // Compute metrics comparison
    const addedStakeholders = base2.stakeholders.filter(s => !base1.stakeholders.includes(s));
    const removedStakeholders = base1.stakeholders.filter(s => !base2.stakeholders.includes(s));

    const addedRisks = base2.risks.filter(r => !base1.risks.includes(r));
    const removedRisks = base1.risks.filter(r => !base2.risks.includes(r));

    const addedDeliverables = base2.deliverables.filter(d => !base1.deliverables.includes(d));
    const removedDeliverables = base1.deliverables.filter(d => !base2.deliverables.includes(d));

    const addedMetrics = base2.metrics.filter(m => !base1.metrics.includes(m));
    const removedMetrics = base1.metrics.filter(m => !base2.metrics.includes(m));

    const totalChangesCount = 
      addedStakeholders.length + removedStakeholders.length +
      addedRisks.length + removedRisks.length +
      addedDeliverables.length + removedDeliverables.length +
      addedMetrics.length + removedMetrics.length;

    const driftSeverity = 
      totalChangesCount === 0 ? "Stable" :
      totalChangesCount <= 3 ? "Minor Drift" :
      totalChangesCount <= 7 ? "Moderate Scope Drift" : "Severe Scope Drift";

    const driftColor = 
      totalChangesCount === 0 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
      totalChangesCount <= 3 ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
      totalChangesCount <= 7 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
      "text-rose-400 border-rose-500/30 bg-rose-500/10";

    return (
      <div className="animate-fade-in-up text-left space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Semantic Entity Extraction & Baselines</h2>
            <p className="text-slate-400 text-sm">
              Paste project text or load scenarios. Our AI parses and compares entities to track baseline deviations automatically.
            </p>
          </div>
          <div className="flex gap-2">
            {SCENARIOS.map((scen, idx) => (
              <button
                key={idx}
                onClick={() => setProjectText(scen.text)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
              >
                Load "{scen.name}"
              </button>
            ))}
          </div>
        </div>

        {/* Text Input block */}
        <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/60 shadow-xl">
          <label className="block text-slate-400 text-xs font-mono uppercase tracking-wider mb-2 font-medium">Unstructured Project Specification</label>
          <textarea
            value={projectText}
            onChange={(e) => setProjectText(e.target.value)}
            className="w-full h-36 bg-slate-900/90 border border-slate-700 rounded-lg p-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-sans mb-4 transition-all"
            placeholder="Describe your project, stakeholders, deliverables, and quality criteria in plain paragraphs..."
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-mono">Length: {projectText.length} characters</span>
            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Extracting Entities...
                </>
              ) : (
                <>
                  <Layers size={14} /> Extract & Create Baseline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analytics deviation card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`rounded-xl border p-4 flex flex-col justify-between ${driftColor}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider opacity-85">Deviation Index</span>
            <span className="text-2xl font-bold mt-2">{driftSeverity}</span>
            <span className="text-xs opacity-75 mt-1">{totalChangesCount} variance indicators</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Stakeholders Change</span>
            <span className="text-2xl font-bold text-slate-200 mt-2">
              +{addedStakeholders.length} / -{removedStakeholders.length}
            </span>
            <span className="text-xs text-slate-500 mt-1">Active: {base2.stakeholders.length} total</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Risk Profile Change</span>
            <span className="text-2xl font-bold text-slate-200 mt-2">
              +{addedRisks.length} / -{removedRisks.length}
            </span>
            <span className="text-xs text-slate-500 mt-1">Active: {base2.risks.length} total</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Deliverables Change</span>
            <span className="text-2xl font-bold text-slate-200 mt-2">
              +{addedDeliverables.length} / -{removedDeliverables.length}
            </span>
            <span className="text-xs text-slate-500 mt-1">Active: {base2.deliverables.length} total</span>
          </div>
        </div>

        {/* Matrix comparison selector bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Reference A:</span>
            <select
              value={referenceBaselineIdx}
              onChange={(e) => setReferenceBaselineIdx(Number(e.target.value))}
              className="bg-slate-850 border border-slate-750 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none cursor-pointer"
            >
              {baselines.map((b, i) => (
                <option key={i} value={i}>{b.name} ({b.timestamp})</option>
              ))}
            </select>
          </div>
          <div className="text-slate-600 text-xs font-mono">VS</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Comparison B:</span>
            <select
              value={activeBaselineIdx}
              onChange={(e) => setActiveBaselineIdx(Number(e.target.value))}
              className="bg-slate-850 border border-slate-750 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none cursor-pointer"
            >
              {baselines.map((b, i) => (
                <option key={i} value={i}>{b.name} ({b.timestamp})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className={`grid md:grid-cols-2 gap-6 transition-all duration-300 ${
          isHighlighted('baseline-center') 
            ? 'ring-4 ring-blue-500/50 p-4 bg-slate-850 rounded-xl shadow-[0_0_45px_rgba(59,130,246,0.5)] scale-[1.02] z-50 relative' 
            : ''
        }`}>
          {/* Reference Column */}
          <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <div>
                <h3 className="font-semibold text-slate-300 text-sm">Reference: {base1.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono">Extracted timestamp: {base1.timestamp}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono uppercase">Ref A</span>
            </div>

            <div className="space-y-5">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Stakeholders</span>
                <div className="flex flex-wrap gap-1.5">
                  {base1.stakeholders.map((s, idx) => {
                    const isRemoved = !base2.stakeholders.includes(s);
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded border transition-all ${
                          isRemoved
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400/70 line-through'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        {s} {isRemoved && "(-)"}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Extracted Risks</span>
                <div className="space-y-1.5">
                  {base1.risks.map((r, idx) => {
                    const isRemoved = !base2.risks.includes(r);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isRemoved ? 'text-rose-400/60 line-through' : 'text-slate-400'
                        }`}
                      >
                        <span className={`${isRemoved ? 'text-rose-400/50' : 'text-rose-400'} mt-0.5`}>➔</span>
                        <span>{r}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Deliverables</span>
                <div className="space-y-1.5">
                  {base1.deliverables.map((d, idx) => {
                    const isRemoved = !base2.deliverables.includes(d);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isRemoved ? 'text-rose-400/60 line-through' : 'text-slate-400'
                        }`}
                      >
                        <span className={`${isRemoved ? 'text-rose-400/50' : 'text-cyan-400'} mt-0.5`}>➔</span>
                        <span>{d}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Quality Baselines</span>
                <div className="space-y-1.5">
                  {base1.metrics.map((m, idx) => {
                    const isRemoved = !base2.metrics.includes(m);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isRemoved ? 'text-rose-400/60 line-through' : 'text-slate-400'
                        }`}
                      >
                        <span className="text-emerald-400/80 mt-0.5">✓</span>
                        <span>{m}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Column */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-blue-500/20 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-4">
              <div>
                <h3 className="font-semibold text-cyan-400 text-sm">Comparison: {base2.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono">Extracted timestamp: {base2.timestamp}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-[10px] text-blue-400 font-mono uppercase">Comp B</span>
            </div>

            <div className="space-y-5">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Stakeholders</span>
                <div className="flex flex-wrap gap-1.5">
                  {base2.stakeholders.map((s, idx) => {
                    const isNew = !base1.stakeholders.includes(s);
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded border transition-all ${
                          isNew
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        {s} {isNew && "✦"}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Extracted Risks</span>
                <div className="space-y-1.5">
                  {base2.risks.map((r, idx) => {
                    const isNew = !base1.risks.includes(r);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isNew ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        <span className={`${isNew ? 'text-emerald-400' : 'text-rose-400'} mt-0.5`}>➔</span>
                        <span>{r} {isNew && " (New Risk)"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Deliverables</span>
                <div className="space-y-1.5">
                  {base2.deliverables.map((d, idx) => {
                    const isNew = !base1.deliverables.includes(d);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isNew ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        <span className={`${isNew ? 'text-emerald-400' : 'text-cyan-400'} mt-0.5`}>➔</span>
                        <span>{d} {isNew && " (New Deliverable)"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Quality Baselines</span>
                <div className="space-y-1.5">
                  {base2.metrics.map((m, idx) => {
                    const isNew = !base1.metrics.includes(m);
                    return (
                      <div
                        key={idx}
                        className={`text-xs flex items-start gap-2 transition-all ${
                          isNew ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{m} {isNew && " (Updated Metric)"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return renderOverview();
      case 'Maturity Journey': return renderMaturityJourney();
      case 'Documents': return renderDocuments();
      case 'Gaps': return renderGaps();
      case 'Recommendations': return renderRecommendations();
      case 'Benchmarks': return renderBenchmarks();
      case 'ROI': return renderROI();
      case 'Performance Domains': return renderDomains();
      case 'Quality Analysis': return renderQuality();
      case 'Action Plan': return renderActionPlan();
      case 'Baseline Comparison': return renderBaselineComparison();
      default: return renderOverview();
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingTimeline sections={SECTIONS} />
      
      {/* Intro Chapter */}
      <ChapterSection id="intro" className="min-h-screen flex flex-col justify-center text-center">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-10 left-10 flex items-center gap-2 text-emerald-300 hover:text-white transition-colors cursor-pointer z-50"
        >
          <ArrowLeft size={20} /> Back to Overview
        </button>
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-medium mb-6 mx-auto w-fit">
          <Play size={16} /> Interactive Tour
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-blue-200">
          The Assessment Experience
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
          Scroll down to explore the 10 powerful dimensions of your ADPA assessment results, culminating in an interactive dashboard.
        </p>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <ChevronDown size={32} />
        </div>
      </ChapterSection>

      {/* Tab 1: Overview */}
      <ChapterSection id="tab-1" className="bg-blue-900/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-blue-400 font-bold tracking-widest uppercase mb-2">Tab 1</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Overview</h2>
            <p className="text-xl text-blue-200 mb-6">
              Get an immediate executive summary of your current state. See your primary maturity score, overarching quality metrics, and the top 3 critical areas requiring leadership attention.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <LayoutDashboard size={100} className="text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 2: Maturity Journey */}
      <ChapterSection id="tab-2" className="bg-blue-900/45 backdrop-blur-lg">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-indigo-400 font-bold tracking-widest uppercase mb-2">Tab 2</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Maturity Journey</h2>
            <p className="text-xl text-blue-200 mb-6">
              Visualize your organization's exact position on the 5-level maturity scale. Understand where you started, where you currently are, and the precise steps required to reach the next tier.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-indigo-500/40 rounded-full animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-4 border border-dashed border-indigo-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
              <Compass size={100} className="text-indigo-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 3: Documents */}
      <ChapterSection id="tab-3" className="bg-blue-900/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-cyan-400 font-bold tracking-widest uppercase mb-2">Tab 3</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Documents</h2>
            <p className="text-xl text-blue-200 mb-6">
              A detailed audit trail of every artifact analyzed by the semantic engine. See which documents contributed to your score, their individual quality ratings, and missing mandatory templates.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-full animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-4 border border-cyan-400/40 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              <Files size={100} className="text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 4: Gaps */}
      <ChapterSection id="tab-4" className="bg-blue-900/55 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-rose-400 font-bold tracking-widest uppercase mb-2">Tab 4</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Gaps</h2>
            <p className="text-xl text-blue-200 mb-6">
              Identify exactly where your processes fall short of PMBOK 8 standards. Gaps are categorized by severity and impact, allowing you to focus on the most critical vulnerabilities first.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-rose-500/60 rounded-full animate-[spin_5s_linear_infinite]" />
              <div className="absolute inset-4 border border-dashed border-rose-400/40 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <AlertCircle size={100} className="text-rose-400 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 5: Recommendations */}
      <ChapterSection id="tab-5" className="bg-blue-900/60 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-amber-400 font-bold tracking-widest uppercase mb-2">Tab 5</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Recommendations</h2>
            <p className="text-xl text-blue-200 mb-6">
              Turn insights into action. Our AI generates highly specific, tailored recommendations to close identified gaps, complete with suggested implementation strategies.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-amber-500/60 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-8 border border-dashed border-amber-300/40 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
              <Lightbulb size={100} className="text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 6: Benchmarks */}
      <ChapterSection id="tab-6" className="bg-blue-950/65 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-fuchsia-400 font-bold tracking-widest uppercase mb-2">Tab 6</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Benchmarks</h2>
            <p className="text-xl text-blue-200 mb-6">
              Context is everything. Compare your maturity scores directly against industry averages, peer organizations, and top-tier performers to understand your competitive position.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-fuchsia-500/60 rounded-full animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-4 border border-fuchsia-400/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <BarChart size={100} className="text-fuchsia-400 drop-shadow-[0_0_30px_rgba(232,121,249,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 7: ROI */}
      <ChapterSection id="tab-7" className="bg-blue-950/70 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-emerald-400 font-bold tracking-widest uppercase mb-2">Tab 7</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">ROI</h2>
            <p className="text-xl text-blue-200 mb-6">
              Justify your improvement efforts. View predictive modeling that calculates the expected financial return, risk reduction, and efficiency gains of implementing our recommendations.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-emerald-500/60 rounded-full animate-[spin_5s_linear_infinite]" />
              <div className="absolute inset-6 border border-dashed border-emerald-400/40 rounded-full animate-[spin_9s_linear_infinite_reverse]" />
              <TrendingUp size={100} className="text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 8: Performance Domains */}
      <ChapterSection id="tab-8" className="bg-blue-950/75 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-teal-400 font-bold tracking-widest uppercase mb-2">Tab 8</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Performance Domains</h2>
            <p className="text-xl text-blue-200 mb-6">
              A deep dive into the 8 PMBOK Performance Domains (Stakeholders, Team, Planning, Delivery, etc.). Identify exactly which domains are pulling your overall score up or down.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-teal-500/60 rounded-full animate-[spin_7s_linear_infinite]" />
              <div className="absolute inset-4 border border-teal-400/50 rounded-full animate-[spin_11s_linear_infinite_reverse]" />
              <Grid size={100} className="text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 9: Quality Analysis */}
      <ChapterSection id="tab-9" className="bg-blue-950/80 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h3 className="text-sky-400 font-bold tracking-widest uppercase mb-2">Tab 9</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Quality Analysis</h2>
            <p className="text-xl text-blue-200 mb-6">
              Evaluate the rigor of your artifacts. This tab breaks down documentation quality based on clarity, comprehensiveness, and adherence to structural governance standards.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-sky-500/60 rounded-full animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-8 border border-dashed border-sky-400/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <Shield size={100} className="text-sky-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Tab 10: Action Plan */}
      <ChapterSection id="tab-10" className="bg-blue-950/85 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="flex-1">
            <h3 className="text-purple-400 font-bold tracking-widest uppercase mb-2">Tab 10</h3>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Action Plan</h2>
            <p className="text-xl text-blue-200 mb-6">
              Your personalized roadmap to excellence. A sequenced, actionable plan that schedules the recommendations from Tab 5 into manageable sprints and milestones.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-purple-500/60 rounded-full animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-purple-400/50 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <CheckSquare size={100} className="text-purple-400 drop-shadow-[0_0_30px_rgba(192,132,252,0.8)]" />
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* Final Interactive Dashboard Tool */}
      <div 
        ref={dashboardRef}
        id="dashboard" 
        className="min-h-screen bg-slate-950 flex items-center py-24 relative z-10"
      >
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Explore the Results Tool</h2>
            <p className="text-xl text-blue-200">
              {isTourActive 
                ? "Keep scrolling to tour each tab's highlight, or click the button to explore freely."
                : "Interact with a live sample of the assessment dashboard"
              }
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[700px] relative">
            {/* Localized Tour Dim Backdrop */}
            {isTourActive && isHighlightActive && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[4px] z-40 transition-all duration-500 pointer-events-none rounded-xl" />
            )}
            {/* Tool Header */}
            <div className="bg-slate-800/80 border-b border-slate-700 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                    <Layers size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold leading-tight">Sample Project Assessment</h3>
                    <div className="text-xs text-slate-400">ID: ADPA-2026-X | Last updated: Today</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsTourActive(!isTourActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isTourActive 
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTourActive ? "Scroll Tour Active" : "Free Explore Mode"}
                  </button>
                  <button className="px-4 py-1.5 rounded-md bg-slate-700 text-sm text-slate-200 hover:bg-slate-600 transition-colors flex items-center gap-2">
                    <RefreshCw size={14} /> Recalculate
                  </button>
                  <button className="px-4 py-1.5 rounded-md bg-blue-600 text-sm text-white hover:bg-blue-500 transition-colors">
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Highlight Banner */}
              {isTourActive && (
                <div className="bg-gradient-to-r from-blue-900/40 via-blue-950/20 to-transparent border border-blue-500/30 rounded-lg p-3 flex items-start gap-3 min-h-[70px]">
                  <span className="flex h-2 w-2 mt-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
                      Featured Highlight: {TOUR_STEPS[tourStepIndex]?.featureName}
                      {!isHighlightActive && <span className="text-slate-500 animate-pulse text-[10px] lowercase font-normal">(loading feature...)</span>}
                    </div>
                    <div className="text-sm text-slate-200 mt-0.5 font-mono min-h-[1.5rem] flex items-center">
                      <span>{streamedText}</span>
                      <span className="animate-pulse text-cyan-400 ml-1">|</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tool Body (Sidebar + Content) */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-1 overflow-y-auto">
                {TABS.map((tab, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setIsTourActive(false); // Stop tour if user manually interacts
                      setActiveTab(tab.name);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      activeTab === tab.name 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <tab.icon size={16} /> {tab.name}
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-slate-900 p-8 overflow-y-auto">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
