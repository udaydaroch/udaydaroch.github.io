import { useState, useEffect, useRef } from "react";

const TRAITS = [
  {
    icon: "bi-person-heart",
    label: "Customer-focused",
    desc: "Engineering, service, or teaching — the person I'm serving always comes first.",
    color: "#c47070",
    bg: "rgba(196,112,112,0.08)",
    border: "rgba(196,112,112,0.22)",
    glow: "rgba(196,112,112,0.15)",
  },
  {
    icon: "bi-people-fill",
    label: "Collaborative",
    desc: "I work well in teams and default to open communication over working in silence.",
    color: "#7c8fff",
    bg: "rgba(124,143,255,0.08)",
    border: "rgba(124,143,255,0.22)",
    glow: "rgba(124,143,255,0.15)",
  },
  {
    icon: "bi-lightning-charge-fill",
    label: "Adaptable",
    desc: "Quick to pick up new environments, tools, and processes without hand-holding.",
    color: "#d4924a",
    bg: "rgba(212,146,74,0.08)",
    border: "rgba(212,146,74,0.22)",
    glow: "rgba(212,146,74,0.15)",
  },
  {
    icon: "bi-list-check",
    label: "Methodical",
    desc: "I break work into clear, achievable steps and follow through on every one.",
    color: "#5cb8a0",
    bg: "rgba(92,184,160,0.08)",
    border: "rgba(92,184,160,0.22)",
    glow: "rgba(92,184,160,0.15)",
  },
  {
    icon: "bi-arrow-repeat",
    label: "Receptive",
    desc: "Feedback is a gift — I take it positively and use it to improve the work.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.22)",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    icon: "bi-stars",
    label: "Improver",
    desc: "I aim to leave things better than I found them — in any role, any context.",
    color: "#c9a84c",
    bg: "rgba(201,168,76,0.08)",
    border: "rgba(201,168,76,0.22)",
    glow: "rgba(201,168,76,0.15)",
  },
];

const STATS = [
  { value: 7, suffix: "", label: "roles" },
  { value: 8, suffix: "+", label: "years working" },
  { value: 3, suffix: "", label: "industries" },
];

// Animated count-up on scroll into view
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += 1;
        setVal(start);
        if (start < target) setTimeout(step, 55);
      };
      setTimeout(step, 200);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// Individual trait card with shimmer on hover
function TraitCard({ t }: { t: typeof TRAITS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="gc-trait"
      style={{
        borderColor: hov ? t.border : "var(--accent-border)",
        boxShadow: hov ? `0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px ${t.border}` : "none",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Shimmer sweep */}
      <div className="gc-shimmer" style={{ opacity: hov ? 1 : 0 }} />

      <div
        className="gc-trait-icon"
        style={{
          background: hov ? t.bg : "rgba(255,255,255,0.04)",
          boxShadow: hov ? `0 0 14px ${t.glow}` : "none",
          transform: hov ? "scale(1.12) rotate(-6deg)" : "scale(1) rotate(0)",
        }}
      >
        <i className={`bi ${t.icon}`} style={{ color: hov ? t.color : "var(--text-dim)", transition: "color 0.2s" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="gc-trait-label" style={{ color: hov ? t.color : "var(--text-primary)", transition: "color 0.2s" }}>
          {t.label}
        </p>
        <p className="gc-trait-desc">{t.desc}</p>
      </div>
    </div>
  );
}

const GeneralComments = () => (
  <>
    <style>{`
      @keyframes gc-border-spin {
        from { background-position: 0% 50%; }
        to   { background-position: 200% 50%; }
      }
      @keyframes gc-glow-pulse {
        0%,100% { opacity: 0.5; transform: translateX(-50%) scaleX(0.7); }
        50%      { opacity: 1;   transform: translateX(-50%) scaleX(1.2); }
      }
      @keyframes gc-shimmer-sweep {
        from { transform: translateX(-100%) skewX(-12deg); }
        to   { transform: translateX(250%)  skewX(-12deg); }
      }
      @keyframes gc-fadeUp {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0); }
      }

      .gc-root { margin-top: 4rem; }

      /* ── Header ── */
      .gc-header { display:flex; align-items:center; gap:16px; margin-bottom:2.5rem; }
      .gc-header-line {
        flex:1; height:1px;
        background:linear-gradient(90deg, rgba(124,143,255,0.22), transparent);
      }
      .gc-header-line.r { background:linear-gradient(270deg, rgba(124,143,255,0.22), transparent); }

      .gc-title-wrap { position:relative; }
      .gc-title {
        font-family:var(--font-display); font-size:1.4rem; font-weight:800;
        color:var(--text-primary); white-space:nowrap; margin:0;
        position:relative; z-index:1;
      }
      /* Animated underline glow */
      .gc-title-glow {
        position:absolute; bottom:-5px; left:50%; width:60px; height:3px;
        border-radius:2px;
        background:linear-gradient(90deg, var(--accent), var(--purple), var(--accent));
        background-size:200% 100%;
        animation: gc-border-spin 3s linear infinite, gc-glow-pulse 3s ease-in-out infinite;
        transform:translateX(-50%);
        filter:blur(1px);
      }

      /* ── Stat chips ── */
      .gc-stats {
        display:flex; flex-wrap:wrap; gap:10px; margin-bottom:2rem;
      }
      .gc-stat {
        display:inline-flex; flex-direction:column; align-items:center;
        padding:10px 20px; border-radius:12px;
        border:1px solid var(--accent-border);
        background:rgba(255,255,255,0.025);
        min-width:72px;
      }
      .gc-stat-num {
        font-family:var(--font-display); font-size:1.6rem; font-weight:800;
        line-height:1; color:var(--text-primary);
        background:linear-gradient(135deg, #fff, var(--accent));
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      }
      .gc-stat-label {
        font-family:var(--font-mono); font-size:0.62rem; letter-spacing:0.1em;
        color:var(--text-dim); margin-top:3px; text-transform:uppercase;
      }

      /* ── Quote block with animated gradient border ── */
      .gc-quote-wrap {
        position:relative; border-radius:14px; padding:1px;
        background:linear-gradient(135deg,
          rgba(124,143,255,0.35), rgba(167,139,250,0.15),
          rgba(124,143,255,0.05), rgba(167,139,250,0.35));
        background-size:300% 300%;
        animation: gc-border-spin 5s linear infinite;
      }
      .gc-quote-inner {
        background:var(--bg-surface, #0f111a);
        border-radius:13px; padding:1.4rem 1.5rem;
        position:relative; overflow:hidden;
      }
      .gc-quote-inner::before {
        content:'"';
        position:absolute; top:-1.2rem; left:0.5rem;
        font-family:var(--font-display); font-size:7rem; line-height:1;
        color:var(--accent); opacity:0.07; pointer-events:none; user-select:none;
      }
      .gc-quote-inner p {
        font-size:0.87rem; line-height:1.82;
        color:var(--text-secondary); margin:0 0 0.7rem; position:relative; z-index:1;
      }
      .gc-quote-inner p:last-child { margin:0; }

      /* ── Trait grid ── */
      .gc-grid {
        display:grid;
        grid-template-columns:repeat(auto-fill, minmax(215px,1fr));
        gap:10px;
      }
      .gc-trait {
        display:flex; align-items:flex-start; gap:11px;
        padding:13px 15px; border-radius:13px;
        border:1px solid var(--accent-border);
        background:rgba(255,255,255,0.022);
        position:relative; overflow:hidden;
        cursor:default;
        transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),
                   box-shadow 0.25s ease, border-color 0.25s ease;
      }
      /* Shimmer element */
      .gc-shimmer {
        position:absolute; top:0; left:0; width:40%; height:100%;
        background:linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent);
        pointer-events:none; z-index:0;
        animation: gc-shimmer-sweep 0.55s ease forwards;
        opacity:0; transition:opacity 0s;
      }
      .gc-trait-icon {
        width:34px; height:34px; border-radius:9px; flex-shrink:0;
        display:flex; align-items:center; justify-content:center; font-size:0.95rem;
        position:relative; z-index:1;
        transition:background 0.25s, box-shadow 0.25s, transform 0.3s cubic-bezier(.34,1.56,.64,1);
      }
      .gc-trait-label {
        font-family:var(--font-display); font-size:0.8rem; font-weight:700;
        margin:0 0 3px; line-height:1.2; position:relative; z-index:1;
        transition:color 0.2s;
      }
      .gc-trait-desc {
        font-family:var(--font-mono); font-size:0.69rem;
        color:var(--text-secondary); line-height:1.55; margin:0;
        position:relative; z-index:1;
      }
    `}</style>

    <section className="gc-root">

      {/* Heading */}
      <div className="gc-header">
        <div className="gc-header-line" />
        <div className="gc-title-wrap">
          <h2 className="gc-title">General Comments</h2>
          <div className="gc-title-glow" />
        </div>
        <div className="gc-header-line r" />
      </div>

      <div className="row g-4 align-items-start">

        {/* Left — stats + quote */}
        <div className="col-lg-5">

          {/* Animated count-up stats */}
          <div className="gc-stats">
            {STATS.map(s => (
              <div key={s.label} className="gc-stat">
                <span className="gc-stat-num">
                  <CountUp target={s.value} suffix={s.suffix} />
                </span>
                <span className="gc-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Animated gradient border quote */}
          <div className="gc-quote-wrap">
            <div className="gc-quote-inner">
              <p>
                Across all my experience — whether writing code, tutoring students,
                or working a busy restaurant shift — the common thread has been
                caring about the people I'm serving. In engineering that means
                building things that are clean and actually useful.
              </p>
              <p>
                I enjoy collaborating with people, pick up new environments quickly,
                and I aim to leave things in better shape than I found them —
                cleaner code, a tidier shelf, a smoother handoff.
              </p>
            </div>
          </div>
        </div>

        {/* Right — trait cards */}
        <div className="col-lg-7">
          <div className="gc-grid">
            {TRAITS.map(t => <TraitCard key={t.label} t={t} />)}
          </div>
        </div>

      </div>
    </section>
  </>
);

export default GeneralComments;