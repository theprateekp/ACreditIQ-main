import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

const useDashboardReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(Math.max(
        (windowHeight - rect.top) / (windowHeight * 0.8),
        0), 1
      );
      ref.current.style.transform = `rotateX(${45 * (1 - progress)}deg)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return { ref };
};

interface LandingPageProps {
  onEnter: () => void;
}

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref as React.RefObject<Element>);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, 24);
    return () => clearInterval(timer);
  }, [visible, to]);
  return <div ref={ref}>{val}{suffix}</div>;
}

function Navbar({ onEnter }: { onEnter: () => void }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src="/accreditiq-logo.png" alt="AccreditIQ Logo" className="nav-logo-img" />
          AccreditIQ
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#howitworks">How It Works</a></li>
          <li><a href="#criteria">Criteria</a></li>
          <li><button className="nav-enter" onClick={onEnter}>Enter Workspace</button></li>
        </ul>
      </div>
    </nav>
  );
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const { ref: dashboardRef } = useDashboardReveal();
  const heroRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const problemRef  = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howRef      = useRef<HTMLDivElement>(null);
  const criteriaRef = useRef<HTMLDivElement>(null);

  const heroVisible     = useInView(heroRef     as React.RefObject<Element>, 0.3);
  const statsVisible    = useInView(statsRef    as React.RefObject<Element>, 0.2);
  const problemVisible  = useInView(problemRef  as React.RefObject<Element>, 0.2);
  const featuresVisible = useInView(featuresRef as React.RefObject<Element>, 0.2);
  const criteriaVisible = useInView(criteriaRef as React.RefObject<Element>, 0.2);

  const ICONS = [
    { src: 'icon1.png', label: 'AUDIT' },
    { src: 'icon2.png', label: 'EVIDENCE' },
    { src: 'icon3.png', label: 'GAPS' },
    { src: 'icon4.png', label: 'ROADMAP' },
    { src: 'icon5.png', label: 'REPORTS' },
    { src: 'icon6.png', label: 'SCORING' },
    { src: 'icon7.png', label: 'MAPPING' },
    { src: 'icon8.png', label: 'STORAGE' },
    { src: 'icon9.png', label: 'SIMULATION' },
    { src: 'icon11.png', label: 'TRACKING' },
    { src: 'icon12.png', label: 'VALIDATION' },
    { src: 'icon13.png', label: 'COMPLIANCE' },
  ];

  const CRITERIA = [
    { num: 'C1', name: 'Curriculum Design',    marks: 120, desc: 'Outcome-based curriculum design' },
    { num: 'C2', name: 'Teaching-Learning',    marks: 120, desc: 'Effective teaching methodologies' },
    { num: 'C3', name: 'Assessment',           marks: 120, desc: 'Continuous & comprehensive assessment' },
    { num: 'C4', name: "Students' Performance",marks: 120, desc: 'Student performance tracking' },
    { num: 'C5', name: 'Faculty Information',  marks: 100, desc: 'Faculty qualifications & development' },
    { num: 'C6', name: 'Faculty Contributions',marks: 120, desc: 'Research & professional contributions' },
    { num: 'C7', name: 'Facilities',           marks: 100, desc: 'Infrastructure & technical support' },
    { num: 'C8', name: 'Improvement',          marks: 80,  desc: 'Continuous quality improvement' },
    { num: 'C9', name: 'Student Support',      marks: 120, desc: 'Student support & governance' },
  ];

  return (
    <div className="landing-wrapper">
      <Navbar onEnter={onEnter} />

      {/* ── HERO ── */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            🚀 GAPC V4.0 Certification Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            FROM COMPLIANCE CHAOS<br />TO AUDIT-READY.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Track every NBA GAPC V4.0 criterion across all 9 parameters, simulate real audit scenarios,<br />
            identify compliance gaps instantly, and generate SAR reports automatically —<br />
            so your institution walks into every accreditation audit fully prepared, not just hopeful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-pills"
          >
            {['9 GAPC Criteria', '1000+ Marks', 'AI Scoring', 'Evidence Vault', 'CO-PO Mapper', 'SAR Export'].map(pill => (
              <span key={pill} className="pill">{pill}</span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={heroVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-buttons"
          >
            <button className="btn btn-primary" onClick={onEnter}>Enter Workspace</button>
          </motion.div>
        </div>
      </section>

      {/* ── DASHBOARD REVEAL ── */}
      <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center', padding: '0 5%', width: '100%', boxSizing: 'border-box' }}>
        <div
          ref={dashboardRef}
          style={{
            width: '100%', maxWidth: '1100px', aspectRatio: '16/9', marginTop: '-80px',
            background: '#0f172a', border: '3px solid #000000', boxShadow: '6px 6px 0px #000000',
            borderRadius: '8px', overflow: 'hidden',
            transformOrigin: 'bottom center', transition: 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            willChange: 'transform',
          }}
        >
          <img src="/dashboard-screenshot.png" alt="AccreditIQ Dashboard"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {[
            { number: 9,    label: 'GAPC Criteria',   desc: 'All criteria fully mapped and tracked' },
            { number: 1000, label: '+ Marks Tracked',  desc: 'Comprehensive evidence across all standards' },
            { number: 47,   label: '% Time Saved',     isPercent: true, desc: 'Automation reduces manual compliance work' },
            { number: 100,  label: '% Audit Ready',    isPercent: true, desc: 'Institutions pass first-attempt NBA audits' },
          ].map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={statsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="stat-card"
            >
              <div className="stat-number">
                {statsVisible ? <Counter to={stat.number} suffix={stat.isPercent ? '%' : ''} /> : '0'}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-desc">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="problem-section" ref={problemRef}>
        <motion.div initial={{ opacity: 0 }} animate={problemVisible ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="section-header">
          <div className="section-badge problem-badge">Problem</div>
          <h2>NBA Accreditation Should Not Be This Hard</h2>
        </motion.div>
        <div className="problem-cards">
          {[
            { stat: '73%',    statLabel: 'of institutions fail their first NBA audit',    title: 'Scattered Evidence Across Drives',  desc: 'Files everywhere. No unified system. Evidence lost in emails, drives, and folders nobody can find.' },
            { stat: '6 Months', statLabel: 'wasted on manual compliance tracking',        title: 'No Real-Time Gap Visibility',        desc: 'Gaps discovered the day before audit. No dashboard. No alerts. No time to fix anything.' },
            { stat: '200+',   statLabel: 'hours spent manually compiling SAR reports',   title: 'Last-Minute SAR Panic',              desc: 'Rushing to compile, format, and explain data that should have been tracked all year.' },
          ].map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={problemVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="problem-card"
            >
              <div className="problem-icon" />
              <div className="problem-stat">{p.stat}</div>
              <div className="problem-stat-label">{p.statLabel}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" ref={featuresRef} id="features">
        <motion.div initial={{ opacity: 0 }} animate={featuresVisible ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="section-header">
          <div className="section-badge">Features</div>
          <h2>Built for Every Role in the Institution</h2>
        </motion.div>
        <div className="features-grid">
          <div className="feature-card feature-large" style={{ background: '#F5E6A0' }}>
            <img src="/score.png" alt="AI Scoring" className="feature-image" />
            <h3>AI-DRIVEN EVIDENCE SCORING</h3>
            <p>Real-time readiness scoring across all 9 GAPC V4.0 criteria. Predictive gap analysis flags weak criteria before the auditor does.</p>
            <div className="feature-tag">AI POWERED</div>
          </div>
          <div className="feature-card feature-small" style={{ background: '#F7F6F2' }}>
            <img src="/document-vault.png" alt="Document Vault" className="feature-image" />
            <h3>EVIDENCE VAULT</h3>
            <p>Encrypted document repository with criteria tagging. Every file mapped to the right criterion.</p>
            <div className="feature-tag">STORAGE</div>
          </div>
          <div className="feature-card feature-small" style={{ background: '#F7F6F2' }}>
            <img src="/co-po.png" alt="CO-PO Mapping" className="feature-image" />
            <h3>AUTO CO-PO MAPPING</h3>
            <p>NLP-powered course outcome alignment with Bloom's taxonomy. Stop losing marks on poor CO-PO traceability.</p>
            <div className="feature-tag">NLP</div>
          </div>
          <div className="feature-card feature-large" style={{ background: '#A8C5A0' }}>
            <img src="/AUDIT.png" alt="Audit Simulator" className="feature-image" />
            <h3>AUDIT SIMULATOR AND SAR GENERATOR</h3>
            <p>Mock audit questions powered by fine-tuned LLM. Simulate real NBA audit scenarios and export a perfectly formatted SAR report in one click.</p>
            <div className="feature-tag">LLM POWERED</div>
          </div>
          <div className="feature-card feature-small" style={{ background: '#E6D4F5' }}>
            <img src="/Dashboard.png" alt="Real-Time Dashboard" className="feature-image" />
            <h3>REAL-TIME DASHBOARD</h3>
            <p>Monitor compliance progress at a glance. Visual indicators show readiness status across all criteria.</p>
            <div className="feature-tag">ANALYTICS</div>
          </div>
          <div className="feature-card feature-small" style={{ background: '#D4F5E6' }}>
            <img src="/report.png" alt="Automated Reports" className="feature-image" />
            <h3>AUTOMATED REPORTING</h3>
            <p>Generate audit-ready reports instantly. Customizable exports for NBA, NAAC, SAR, and internal stakeholders.</p>
            <div className="feature-tag">REPORTS</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="howitworks-section" ref={howRef} id="howitworks">
        <div className="section-header">
          <div className="section-badge">How It Works</div>
          <h2>Six Steps to Compliance Success</h2>
        </div>
        <div className="steps-grid">
          {[
            { num: 1, title: 'Upload Evidence',      desc: 'Feed documents into our encrypted vault. Organize by criteria.',                    image: '/document-vault.png' },
            { num: 2, title: 'Map & Score',           desc: 'AI auto-maps to criteria and scores readiness. Predictive analysis.',               image: '/map and score.png' },
            { num: 3, title: 'Export SAR',            desc: 'One-click audit-ready SAR in correct format. Professional export.',                 image: '/report.png' },
            { num: 4, title: 'Run Audit Simulator',   desc: 'Mock auditor questions based on your institution data and responses.',              image: '/AUDIT.png' },
            { num: 5, title: 'Identify Gaps',         desc: 'Visual heatmap shows weak criteria needing attention and improvement.',             image: '/GAP (1).png' },
            { num: 6, title: 'Generate Reports',      desc: 'Customizable compliance reports for stakeholders and audit readiness proof.',       image: '/report.png' },
          ].map((step, i) => (
            <div key={i} className="step-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <img src={step.image} alt={step.title} className="step-image" />
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section className="marquee-section">
        {[false, true].map((reverse, ri) => (
          <div key={ri} className={`marquee-row ${reverse ? 'right' : 'left'}`}>
            {Array(3).fill(null).flatMap((_, rep) =>
              Array(16).fill(null).map((_, i) => {
                const icon = ICONS[i % ICONS.length];
                return (
                  <div key={`${rep}-${i}`} className="marquee-slot">
                    <div className="marquee-icon-wrapper">
                      <img src={`/${icon.src}`} alt={icon.label} className="marquee-icon" />
                      <span className="marquee-label">{icon.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </section>

      {/* ── CRITERIA ── */}
      <section className="criteria-section" ref={criteriaRef} id="criteria">
        <motion.div initial={{ opacity: 0 }} animate={criteriaVisible ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="section-header">
          <div className="section-badge">Criteria</div>
          <h2>All 9 GAPC V4.0 Criteria Covered</h2>
        </motion.div>
        <div className="criteria-rows">
          <div className="criteria-row">
            {Array(3).fill(CRITERIA).flat().map((c, i) => (
              <div key={i} className="criteria-card">
                <div className="criteria-num">{c.num}</div>
                <div className="criteria-name">{c.name}</div>
                <div className="criteria-desc">{c.desc}</div>
                <div className="criteria-marks">{c.marks} marks</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2>Why AccreditIQ?</h2>
          <p className="cta-explanation">
            Accreditation audits don't have to be chaotic. Most institutions struggle with scattered evidence, missing CO-PO mappings,
            and last-minute SAR report crunches. AccreditIQ centralizes everything — your criteria tracking, evidence scoring, gap analysis,
            and audit simulations — into one intelligent platform. Instead of firefighting days before your audit, walk in prepared,
            confident, and with demonstrable proof that every GAPC criterion is met.
          </p>
          <button className="btn btn-primary" onClick={onEnter}>Enter Workspace</button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">AccreditIQ</div>
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#howitworks">How It Works</a>
            <a href="#criteria">Criteria</a>
          </nav>
        </div>
        <p className="footer-copyright">
          © 2025 AccreditIQ · NBA Automated SAR Platform · In Collaboration with TSSMs BSCOER Narhe · GAPC V4.0
        </p>
      </footer>
    </div>
  );
}
