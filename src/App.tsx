import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicBackground } from './components/CinematicBackground';
import { OnboardingPage } from './pages/OnboardingPage';
import { MaturityLevelsPage } from './pages/MaturityLevelsPage';
import { ProcessPage } from './pages/ProcessPage';
import { DemoJourneyPage } from './pages/DemoJourneyPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { EverswapShowcasePage } from './pages/EverswapShowcasePage';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Pages that use the cinematic blue background + Lenis smooth scroll
const CinematicShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactLenis root>
    <div className="min-h-screen text-white overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
      <CinematicBackground />
      {children}
    </div>
  </ReactLenis>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ── Cinematic blue shell pages ───────────────── */}
        <Route path="/" element={<CinematicShell><OnboardingPage /></CinematicShell>} />
        <Route path="/process" element={<CinematicShell><ProcessPage /></CinematicShell>} />
        <Route path="/maturity-levels" element={<CinematicShell><MaturityLevelsPage /></CinematicShell>} />
        <Route path="/demo-journey" element={<CinematicShell><DemoJourneyPage /></CinematicShell>} />
        <Route path="/showcase" element={<CinematicShell><ShowcasePage /></CinematicShell>} />

        {/* ── Everswap-style minimal page – own background, no Lenis ── */}
        <Route path="/cinematic" element={<EverswapShowcasePage />} />
      </Routes>
    </Router>
  );
}

export default App;
