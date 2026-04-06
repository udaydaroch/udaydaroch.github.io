import { useState, useEffect, useRef, useCallback } from "react";
import ubiikImg from "../assets/ubiik.png";
import fleetpinImg from "../assets/fleetpin.png";
import tutorImg from "../assets/tutor.png";
import UbiikModal from "./modals/UbiikModal";
import FleetpinModal from "./modals/FleetpinModal";
import TutorModal from "./modals/TutorModal";
import ISAModal from "./modals/ISAModal";
import PizzaHutModal from "./modals/PizzaHutModal";
import PakNSaveModal from "./modals/PakNSaveModal";
import SaketModal from "./modals/SaketModal";
import GeneralComments from "./modals/GeneralCommentModal";
import "../components/AboutMe.css";

type FilterKey = "all" | "engineering" | "service" | "community";

interface Experience {
  id: string;
  category: FilterKey[];
  modalTarget: string;
  image?: string;
  iconClass?: string;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  period: string;
  badges: string[];
  bullets: string[];
}

const experiences: Experience[] = [
  {
    id: "ubiik",
    category: ["engineering"],
    modalTarget: "#ubiikModal",
    image: ubiikImg,
    title: "Software Engineering Intern",
    subtitle: "Ubiik Mimomax",
    period: "2025 – Present",
    badges: ["Laravel", "PHP", "Bootstrap 5", "Docker", "SQLite / PostgreSQL"],
    bullets: [
      "Modernising UI from Bootstrap 3 → 5.",
      "Building tools to manage SQLite configuration files.",
      "Extending Laravel modules and reusable API workflows.",
      "Working across Dockerised SQL data pipelines.",
    ],
  },
  {
    id: "fleetpin",
    category: ["engineering"],
    modalTarget: "#fleetpinModal",
    image: fleetpinImg,
    title: "Software Engineering Intern",
    subtitle: "Fleetpin",
    period: "2024 – 2025",
    badges: ["Vue.js", "REST APIs", "Service Workers", "SQL", "Scala"],
    bullets: [
      "Optimised batch queries for GPS tracking.",
      "Integrated backend APIs for smoother flows.",
      "Implemented offline mode through service workers.",
      "Fixed UI bugs and improved critical UX paths.",
    ],
  },
  {
    id: "tutor",
    category: ["engineering", "community"],
    modalTarget: "#tutorModal",
    image: tutorImg,
    title: "Programming Tutor",
    subtitle: "University of Canterbury · COSC121 & COSC131",
    period: "2025",
    badges: ["Python", "Problem Solving", "Teaching"],
    bullets: [
      "Taught programming fundamentals step-by-step.",
      "Helped debug student code and improve reasoning.",
      "Supported labs, assignments, and tutorials.",
      "Helped run bootcamps and exam prep sessions.",
    ],
  },
  {
    id: "isa",
    category: ["community"],
    modalTarget: "#isaModal",
    iconClass: "bi bi-people-fill",
    iconBg: "#f4f0ff",
    iconColor: "#7c5cbf",
    title: "General Executive",
    subtitle: "Indian Student Association · UC",
    period: "2024",
    badges: ["Event Planning", "Marketing"],
    bullets: [
      "Coordinated cultural events and socials.",
      "Handled event marketing and promotion.",
      "Collaborated with exec team on logistics.",
    ],
  },
  {
    id: "pizzahut",
    category: ["service"],
    modalTarget: "#pizzaHutModal",
    iconClass: "bi bi-bicycle",
    iconBg: "#fff3f0",
    iconColor: "#cc2200",
    title: "Delivery Driver",
    subtitle: "Pizza Hut",
    period: "Oct 2023 – Jun 2024",
    badges: ["Delivery", "Customer Service"],
    bullets: [
      "Prepared food in a fast-paced kitchen.",
      "Delivered orders accurately and on time.",
      "Managed stock and food safety standards.",
    ],
  },
  {
    id: "paknsave",
    category: ["service"],
    modalTarget: "#paknsaveModal",
    iconClass: "bi bi-cart-fill",
    iconBg: "#fffbea",
    iconColor: "#b38600",
    title: "Grocery Assistant",
    subtitle: "PAK'nSAVE",
    period: "Dec 2020 – Aug 2021",
    badges: ["Teamwork", "Stock Management"],
    bullets: [
      "Rotated and replenished stock.",
      "Assisted customers with in-store needs.",
      "Kept store clean and well-organised.",
    ],
  },
  {
    id: "saket",
    category: ["service"],
    modalTarget: "#saketModal",
    iconClass: "bi bi-cup-hot-fill",
    iconBg: "#fff5f0",
    iconColor: "#c45000",
    title: "Waiter Staff",
    subtitle: "Saket Indian Restaurant",
    period: "2017 – 2019",
    badges: ["Table Service", "Delivery"],
    bullets: [
      "Welcomed guests and managed table service.",
      "Handled orders, counter, and deliveries.",
      "Supported kitchen and food prep duties.",
    ],
  },
];

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "bi-grid-fill" },
  { key: "engineering", label: "Engineering", icon: "bi-code-slash" },
  { key: "service", label: "Customer Service", icon: "bi-person-heart" },
  { key: "community", label: "Community", icon: "bi-people-fill" },
];

const CYCLING_WORDS = [
  { text: "engineer.", color: "#0d6efd" },
  { text: "tutor.", color: "#7c5cbf" },
  { text: "team player.", color: "#0ca678" },
  { text: "problem solver.", color: "#e67700" },
  { text: "customer-first.", color: "#c92a2a" },
];

// ── Typewriter cycling word ──────────────────────────────────────────────────
function CyclingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "erasing">("typing");

  useEffect(() => {
    const target = CYCLING_WORDS[wordIndex].text;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setPhase("waiting"), 1800);
      }
    } else if (phase === "waiting") {
      timeout = setTimeout(() => setPhase("erasing"), 0);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setWordIndex((i) => (i + 1) % CYCLING_WORDS.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, wordIndex]);

  return (
    <span
      style={{
        color: CYCLING_WORDS[wordIndex].color,
        transition: "color 0.3s ease",
        display: "inline-block",
        minWidth: "2ch",
      }}
    >
      {displayed}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.85em",
          background: CYCLING_WORDS[wordIndex].color,
          marginLeft: "2px",
          verticalAlign: "middle",
          animation: "cursorBlink 1s step-end infinite",
          borderRadius: "1px",
        }}
      />
    </span>
  );
}

// ── Mouse-reactive dot grid ──────────────────────────────────────────────────
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const raf = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const GAP = 28;
    const MAX_DIST = 120;
    ctx.clearRect(0, 0, W, H);
    for (let x = GAP; x < W; x += GAP) {
      for (let y = GAP; y < H; y += GAP) {
        const dx = x - mouse.current.x;
        const dy = y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / MAX_DIST);
        const radius = 1.2 + influence * 2.8;
        const alpha = 0.07 + influence * 0.38;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,110,253,${alpha})`;
        ctx.fill();
      }
    }
    raf.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const resize = () => { canvas.width = parent.offsetWidth; canvas.height = parent.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -999, y: -999 }; };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

// ── Scroll reveal ────────────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("sr-visible"); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── Experience card ──────────────────────────────────────────────────────────
const ExperienceCard = ({ exp, index }: { exp: Experience; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="sr-item col-12 col-md-6 col-lg-4" style={{ animationDelay: `${index * 55}ms` }}>
      <button
        className="card about-card h-100 rounded-4 border-0 text-start p-0"
        data-bs-toggle="modal"
        data-bs-target={exp.modalTarget}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: "pointer",
          background: "white",
          transform: hovered ? "translateY(-8px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: hovered
            ? "0 20px 48px rgba(13,110,253,0.13), 0 2px 8px rgba(0,0,0,0.05)"
            : "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1.5px #e9ecef",
          transition: "transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s ease",
        }}
      >
        {exp.image ? (
          <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
            <img
              src={exp.image}
              className="card-img-top"
              style={{
                height: "180px", objectFit: "cover", display: "block",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.4s ease",
              }}
              alt={exp.subtitle}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: hovered ? "rgba(13,110,253,0.07)" : "transparent",
              transition: "background 0.3s ease",
            }} />
          </div>
        ) : (
          <div
            className="rounded-top-4 d-flex align-items-center justify-content-center"
            style={{ height: "120px", background: exp.iconBg }}
          >
            <i
              className={exp.iconClass}
              style={{
                fontSize: "2.5rem",
                color: exp.iconColor,
                transform: hovered ? "scale(1.18) rotate(-5deg)" : "scale(1) rotate(0deg)",
                transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
              }}
            />
          </div>
        )}

        {/* Gradient accent bar */}
        <div style={{
          height: "2px",
          background: hovered ? "linear-gradient(90deg,#0d6efd,#7c5cbf)" : "#f0f0f0",
          transition: "background 0.35s ease",
        }} />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h5 className="card-title fw-semibold mb-0" style={{ fontSize: "0.94rem", lineHeight: 1.3 }}>
              {exp.title}
            </h5>
            <i
              className="bi bi-arrow-up-right"
              style={{
                opacity: hovered ? 1 : 0,
                color: "#0d6efd",
                transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                fontSize: "0.88rem", flexShrink: 0, marginLeft: "6px",
              }}
            />
          </div>
          <p className="text-muted mb-1" style={{ fontSize: "0.8rem" }}>{exp.subtitle}</p>
          <p className="mb-2" style={{ fontSize: "0.72rem", color: "#adb5bd" }}>
            <i className="bi bi-clock me-1" />{exp.period}
          </p>
          <div className="mb-3 d-flex flex-wrap gap-1">
            {exp.badges.map((b) => (
              <span key={b} className="badge border" style={{ fontSize: "0.68rem", background: "#f8f9fa", color: "#495057" }}>{b}</span>
            ))}
          </div>
          <ul className="small text-muted ps-3 mb-0">
            {exp.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </button>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const AboutMe = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const sectionRef = useScrollReveal();
  const commentsRef = useScrollReveal();

  const filtered = experiences.filter(
    (e) => activeFilter === "all" || e.category.includes(activeFilter)
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

        .hero-wrap {
          position: relative; overflow: hidden;
          border-radius: 24px;
          padding: 4rem 3rem 3.5rem;
          background: #fafbff;
          border: 1.5px solid #e4eaff;
          margin-bottom: 3rem;
        }
        @media (max-width: 576px) { .hero-wrap { padding: 2.5rem 1.5rem; } }

        .hero-eyebrow {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #0d6efd; animation: fadeUp 0.45s ease both;
          margin: 0 0 0.6rem;
        }
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 800; line-height: 1.12;
          color: #0f1117; margin: 0 0 1.1rem;
          animation: fadeUp 0.45s 0.08s ease both;
        }
        .hero-body {
          font-size: 0.98rem; color: #6c757d;
          max-width: 540px; line-height: 1.75;
          animation: fadeUp 0.45s 0.16s ease both;
          margin: 0;
        }
        .hero-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
          animation: fadeUp 0.45s 0.24s ease both;
          margin-top: 1.5rem;
        }
        .hero-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: white; border: 1.5px solid #dde5ff;
          border-radius: 999px; padding: 5px 14px;
          font-size: 0.76rem; color: #344054; font-weight: 500;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .hero-chip:hover { border-color: #0d6efd; box-shadow: 0 2px 8px rgba(13,110,253,0.12); }
        .hero-chip i { color: #0d6efd; font-size: 0.72rem; }

        .section-heading {
          font-family: 'Syne', sans-serif;
          font-size: 1.55rem; font-weight: 800; color: #0f1117;
          position: relative; display: inline-block;
        }
        .section-heading::after {
          content: ""; position: absolute;
          bottom: -5px; left: 0; width: 36px; height: 3px;
          background: linear-gradient(90deg, #0d6efd, #7c5cbf);
          border-radius: 2px;
        }

        .filter-pill {
          border: 1.5px solid #e2e8f0; background: white;
          border-radius: 999px; padding: 7px 18px;
          font-size: 0.81rem; font-weight: 500; cursor: pointer;
          transition: all 0.18s ease; color: #6c757d;
        }
        .filter-pill:hover { border-color: #0d6efd; color: #0d6efd; background: #f0f5ff; }
        .filter-pill.active {
          background: #0d6efd; border-color: #0d6efd; color: white;
          box-shadow: 0 4px 14px rgba(13,110,253,0.28);
        }
        .count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: #eef2ff; color: #0d6efd;
          border-radius: 999px; font-size: 0.67rem; font-weight: 700;
          min-width: 20px; height: 20px; padding: 0 5px; margin-left: 5px;
        }
        .filter-pill.active .count-badge { background: rgba(255,255,255,0.22); color: white; }

        .view-btn {
          border: 1.5px solid #e2e8f0; background: white;
          border-radius: 10px; padding: 6px 11px;
          font-size: 0.82rem; cursor: pointer;
          transition: all 0.18s ease; color: #6c757d;
        }
        .view-btn:hover { border-color: #0d6efd; color: #0d6efd; }
        .view-btn.active { background: #eef2ff; border-color: #0d6efd; color: #0d6efd; }

        .sr-item { opacity: 0; transform: translateY(28px); }
        .sr-visible .sr-item,
        .sr-item.sr-visible {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .sr-block { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .sr-block.sr-visible { opacity: 1; transform: translateY(0); }

        .timeline { position: relative; padding-left: 2rem; }
        .timeline::before {
          content: ""; position: absolute;
          left: 0.45rem; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, #0d6efd, rgba(13,110,253,0.05));
          border-radius: 2px;
        }
        .timeline-item { position: relative; padding-bottom: 1.75rem; }
        .timeline-dot {
          position: absolute; left: -1.62rem; top: 6px;
          width: 12px; height: 12px; border-radius: 50%;
          background: #0d6efd; border: 2px solid white;
          box-shadow: 0 0 0 3px rgba(13,110,253,0.2);
        }
        .timeline-card {
          border: 1.5px solid #e9ecef; border-radius: 14px;
          padding: 1rem 1.25rem; background: white;
          cursor: pointer; transition: all 0.22s ease;
          text-align: left; width: 100%;
        }
        .timeline-card:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 20px rgba(13,110,253,0.1);
          border-color: rgba(13,110,253,0.3);
        }
      `}</style>

      <div className="container py-5">

        {/* ── Hero ── */}
        <div className="hero-wrap">
          <DotGrid />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="hero-eyebrow">About Me</p>
            <h1 className="hero-headline">
              I'm a&nbsp;<CyclingWord />
            </h1>
            <p className="hero-body">
              Across engineering internships, tutoring, and years of customer-facing work —
              the throughline is the same: care about the people you're serving and leave
              things better than you found them.
            </p>
            <div className="hero-chips">
              <span className="hero-chip"><i className="bi bi-briefcase-fill" />7 roles across tech &amp; service</span>
              <span className="hero-chip"><i className="bi bi-geo-alt-fill" />Christchurch, NZ</span>
              <span className="hero-chip"><i className="bi bi-mortarboard-fill" />University of Canterbury</span>
              <span className="hero-chip"><i className="bi bi-calendar3" />2017 – present</span>
            </div>
          </div>
        </div>

        {/* ── Experience ── */}
        <div ref={sectionRef} className="sr-block">
          <section>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
              <h2 className="section-heading mb-0">What I've been working on</h2>
              <div className="d-flex gap-2 align-items-center">
                <span style={{ fontSize: "0.76rem", color: "#adb5bd" }}>
                  {filtered.length} role{filtered.length !== 1 ? "s" : ""}
                </span>
                <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} title="Grid view">
                  <i className="bi bi-grid-3x3-gap" />
                </button>
                <button className={`view-btn ${view === "timeline" ? "active" : ""}`} onClick={() => setView("timeline")} title="Timeline view">
                  <i className="bi bi-list-ul" />
                </button>
              </div>
            </div>

            <p className="text-muted mb-4" style={{ fontSize: "0.8rem" }}>
              <i className="bi bi-hand-index me-1" />Click any card to view full details
            </p>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {FILTERS.map((f) => {
                const count = f.key === "all"
                  ? experiences.length
                  : experiences.filter((e) => e.category.includes(f.key)).length;
                return (
                  <button
                    key={f.key}
                    className={`filter-pill ${activeFilter === f.key ? "active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    <i className={`bi ${f.icon} me-1`} />
                    {f.label}
                    <span className="count-badge">{count}</span>
                  </button>
                );
              })}
            </div>

            <hr style={{ borderColor: "#f0f0f0", marginBottom: "1.5rem" }} />

            {view === "grid" && (
              <div className="row g-4 align-items-stretch">
                {filtered.map((exp, i) => <ExperienceCard key={exp.id} exp={exp} index={i} />)}
                {filtered.length === 0 && (
                  <div className="col-12 text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2" />No experiences match this filter.
                  </div>
                )}
              </div>
            )}

            {view === "timeline" && (
              <div className="timeline mt-3" style={{ maxWidth: "680px" }}>
                {filtered.map((exp) => (
                  <div key={exp.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <button className="timeline-card" data-bs-toggle="modal" data-bs-target={exp.modalTarget}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <p className="mb-0" style={{ fontSize: "0.7rem", color: "#adb5bd" }}>
                            <i className="bi bi-clock me-1" />{exp.period}
                          </p>
                          <h6 className="fw-semibold mb-0" style={{ fontFamily: "'Syne', sans-serif" }}>{exp.title}</h6>
                          <p className="text-muted mb-2" style={{ fontSize: "0.82rem" }}>{exp.subtitle}</p>
                        </div>
                        <i className="bi bi-arrow-up-right text-primary" style={{ fontSize: "0.85rem" }} />
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {exp.badges.map((b) => (
                          <span key={b} className="badge border" style={{ fontSize: "0.68rem", background: "#f8f9fa", color: "#495057" }}>{b}</span>
                        ))}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── General Comments ── */}
        <div ref={commentsRef} className="sr-block mt-5">
          <GeneralComments />
        </div>

        {/* Modals */}
        <UbiikModal />
        <FleetpinModal />
        <TutorModal />
        <ISAModal />
        <PizzaHutModal />
        <PakNSaveModal />
        <SaketModal />
      </div>
    </>
  );
};

export default AboutMe;