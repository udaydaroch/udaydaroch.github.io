import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RoadScene from "./three/RoadScene";
import JobModals from "./JobModals";
import { experiences, type Experience } from "../data/Experience";
import { projects } from "../data/Projects";
import "./theme.css";
import "./Home.css";

// ─────────────────────────────────────────────────────────────────────────────
// Small hooks
// ─────────────────────────────────────────────────────────────────────────────
function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown] as const;
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero bits
// ─────────────────────────────────────────────────────────────────────────────
const ROLES = ["full-stack engineer.", "AI tinkerer.", "cricket fan.", "problem solver."];

function TypedRole() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = ROLES[i];
    let t: ReturnType<typeof setTimeout>;
    if (!del && txt.length < word.length) t = setTimeout(() => setTxt(word.slice(0, txt.length + 1)), 60);
    else if (!del) t = setTimeout(() => setDel(true), 1700);
    else if (txt.length) t = setTimeout(() => setTxt(txt.slice(0, -1)), 30);
    else t = setTimeout(() => { setDel(false); setI((i + 1) % ROLES.length); }, 200);
    return () => clearTimeout(t);
  }, [txt, del, i]);
  return <span className="hero-typed">{txt}<span className="hero-caret" /></span>;
}

const SplitWord = ({ word, delay }: { word: string; delay: number }) => (
  <span className="split-word" aria-label={word}>
    {word.split("").map((c, i) => (
      <span key={i} className="split-char" style={{ animationDelay: `${delay + i * 55}ms` }} aria-hidden>{c}</span>
    ))}
  </span>
);

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow"><span className="dot-live" />Software Engineer · Christchurch, NZ</p>
        <h1 className="hero-name">
          <SplitWord word="UDAY" delay={150} />
          <SplitWord word="DAROCH" delay={380} />
        </h1>
        <p className="hero-role">I'm a <TypedRole /></p>
        <div className="hero-ctas">
          <a href="#innings" className="cta-primary" onClick={e => { e.preventDefault(); document.getElementById("innings")?.scrollIntoView({ behavior: "smooth" }); }}>
            <span>See my experience</span><i className="bi bi-arrow-down" />
          </a>
          <a href="https://linkedin.com/in/uday-daroch-152a51280" target="_blank" rel="noopener noreferrer" className="cta-ghost">
            <i className="bi bi-linkedin" /> LinkedIn
          </a>
          <a href="https://github.com/udaydaroch" target="_blank" rel="noopener noreferrer" className="cta-ghost">
            <i className="bi bi-github" /> GitHub
          </a>
        </div>
      </div>

      <div className="hero-road">
        <RoadScene />
        <p className="road-hint">
          <span className="hint-mouse"><i className="bi bi-cursor" /> Move your cursor and he'll run to it. Stop on a station to see what he gets up to.</span>
          <span className="hint-touch"><i className="bi bi-hand-index" /> Tap a station and he'll run over to it.</span>
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LED ticker
// ─────────────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = useMemo(() => {
    const set = new Set<string>();
    ["React", "TypeScript", "Laravel", "Vue.js", "Python", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Spring Boot", "Node.js", "LangChain", "Terraform", "Rust"].forEach(s => set.add(s));
    return [...set];
  }, []);
  const row = (
    <div className="ticker-row">
      {items.map(s => <span key={s} className="ticker-item">{s}<i className="ticker-ball" /></span>)}
    </div>
  );
  return (
    <div className="ticker" aria-label="Tech I work with">
      <div className="ticker-track">{row}{row}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Career scorecard (stats)
// ─────────────────────────────────────────────────────────────────────────────
function StatTile({ value, label, sub, run, suffix = "" }: { value: number; label: string; sub: string; run: boolean; suffix?: string }) {
  const v = useCountUp(value, run);
  return (
    <div className="stat-tile">
      <div className="stat-num">{String(v).padStart(2, "0")}{suffix}</div>
      <div className="stat-lbl">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

function Scorecard() {
  const [ref, shown] = useReveal<HTMLDivElement>(0.3);
  const seasons = new Date().getFullYear() - 2017;
  const eng = experiences.filter(e => e.category.includes("engineering")).length;
  return (
    <section className="scorecard-wrap" ref={ref}>
      <div className={`scorecard ${shown ? "is-in" : ""}`}>
        <div className="scorecard-head">
          <span>CAREER SCORECARD</span>
          <span className="scorecard-team">U. DAROCH <em>(NZ)</em></span>
        </div>
        <div className="scorecard-grid">
          <StatTile value={experiences.length} label="Innings" sub="roles played" run={shown} />
          <StatTile value={eng} label="Tech knocks" sub="engineering roles" run={shown} />
          <StatTile value={projects.length} label="Projects" sub="shipped & built" run={shown} />
          <StatTile value={seasons} label="Seasons" sub="working since 2017" run={shown} suffix="+" />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// The innings: every job on a pitch-timeline
// ─────────────────────────────────────────────────────────────────────────────
function InningsCard({ exp, order, side }: { exp: Experience; order: number; side: "l" | "r" }) {
  const [ref, shown] = useReveal<HTMLDivElement>(0.2);
  const card = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = card.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    const el = card.current; if (!el) return;
    el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} className={`inn-row inn-row--${side} ${shown ? "is-in" : ""}`} style={{ ["--glow" as string]: exp.glow }}>
      <div className="inn-node"><span>{String(order).padStart(2, "0")}</span></div>
      <button
        ref={card}
        className="inn-card tilt-card"
        data-bs-toggle="modal"
        data-bs-target={exp.modalTarget}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={`${exp.title} at ${exp.subtitle}: open full details`}
      >
        <span className="inn-shine" />
        <span className="inn-bignum" aria-hidden>{order}</span>
        <div className="inn-top">
          <div className="inn-logo">
            {exp.image ? <img src={exp.image} alt="" /> : <i className={exp.iconClass} style={{ color: exp.iconColor }} />}
          </div>
          <div className="inn-meta">
            <span className="inn-period"><i className="bi bi-calendar3" /> {exp.period}</span>
            {exp.current
              ? <span className="inn-status inn-status--live"><span className="dot-live" />NOT OUT*</span>
              : <span className="inn-status">INNINGS COMPLETE</span>}
          </div>
        </div>
        <h3 className="inn-company">{exp.subtitle}</h3>
        <p className="inn-title">{exp.title}</p>
        <p className="inn-blurb">{exp.blurb}</p>
        <ul className="inn-bullets">
          {exp.bullets.slice(0, 3).map(b => <li key={b}>{b}</li>)}
        </ul>
        <div className="inn-badges">
          {exp.badges.map(b => <span key={b}>{b}</span>)}
        </div>
        <span className="inn-cta">Full scorecard <i className="bi bi-arrow-up-right" /></span>
      </button>
    </div>
  );
}

function Innings() {
  const wrap = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [headRef, headIn] = useReveal<HTMLDivElement>(0.4);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.55 - r.top) / r.height));
      const y = p * (r.height - 24);
      if (ball.current) ball.current.style.transform = `translate(-50%, ${y}px) rotate(${p * 1440}deg)`;
      if (fill.current) fill.current.style.height = `${y + 12}px`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const total = experiences.length;
  return (
    <section id="innings" className="innings">
      <div ref={headRef} className={`section-head ${headIn ? "is-in" : ""}`}>
        <p className="eyebrow">The batting order</p>
        <h2 className="section-title">Every innings<br /><span className="grad">I've played.</span></h2>
        <p className="section-sub">
          Seven roles, from waiting tables in 2017 to shipping code for industrial IoT today.
          Different pitches, same approach. Click any card for the full scorecard.
        </p>
      </div>

      <div className="inn-wrap" ref={wrap}>
        <div className="inn-pitch" aria-hidden>
          <div className="inn-pitch-fill" ref={fill} />
          <div className="inn-crease inn-crease--top" />
          <div className="inn-crease inn-crease--bot" />
          <div className="inn-ball" ref={ball}><i /></div>
        </div>
        {experiences.map((exp, i) => (
          <InningsCard key={exp.id} exp={exp} order={total - i} side={i % 2 === 0 ? "l" : "r"} />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlights reel (projects teaser)
// ─────────────────────────────────────────────────────────────────────────────
function Highlights() {
  const [ref, shown] = useReveal<HTMLDivElement>(0.2);
  const picks = projects.filter(p => p.image).slice(0, 4);
  return (
    <section className="highlights" ref={ref}>
      <div className={`section-head ${shown ? "is-in" : ""}`}>
        <p className="eyebrow">Highlights reel</p>
        <h2 className="section-title">Shots worth<br /><span className="grad">a replay.</span></h2>
      </div>
      <div className={`hl-grid ${shown ? "is-in" : ""}`}>
        {picks.map((p, i) => (
          <Link to="/projects" key={p.id} className="hl-card tilt-card" style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="hl-img"><img src={p.image} alt={p.title} loading="lazy" /></div>
            <div className="hl-body">
              <span className="hl-idx">REPLAY {String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <div className="hl-tech">{p.tech.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="hl-more">
        <Link to="/projects" className="cta-ghost">All projects <i className="bi bi-arrow-right" /></Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Partnership CTA
// ─────────────────────────────────────────────────────────────────────────────
function Partnership() {
  const [ref, shown] = useReveal<HTMLDivElement>(0.3);
  return (
    <section className="partner-wrap" ref={ref}>
      <div className={`partner ${shown ? "is-in" : ""}`}>
        <div className="partner-stumps" aria-hidden><i /><i /><i /></div>
        <p className="eyebrow">Next ball</p>
        <h2 className="partner-title">Let's build a <span className="grad">partnership.</span></h2>
        <p className="partner-sub">Got a role, a project or just want to talk cricket? I'm always keen for a hit.</p>
        <div className="hero-ctas" style={{ justifyContent: "center" }}>
          <button className="cta-primary" onClick={() => window.dispatchEvent(new Event("open-contact"))}>
            <span>Send me a message</span><i className="bi bi-send" />
          </button>
          <Link to="/about-me" className="cta-ghost">More about me <i className="bi bi-arrow-right" /></Link>
        </div>
      </div>
      <footer className="home-foot">
        <span>© {new Date().getFullYear()} Uday Daroch</span>
        <span>Built with React, Three.js and a lot of cover drives</span>
      </footer>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const Home = () => (
  <div className="home">
    <div className="home-grid-bg" aria-hidden />
    <Hero />
    <Ticker />
    <Scorecard />
    <Innings />
    <Highlights />
    <Partnership />
    {/* Modals live outside the z-indexed sections so they sit above the backdrop */}
    <JobModals />
  </div>
);

export default Home;
