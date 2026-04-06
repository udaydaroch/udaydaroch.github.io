import { useState, useEffect, useRef } from "react";
import { projects } from "../data/Projects";
import ProjectCard from "./objects/ProjectCard";
import "./theme.css";
import "./Projects.css";

const PAGE_SIZE = 4;

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("sr-visible"); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const AnimatedCard = ({ project, index }: { project: (typeof projects)[0]; index: number }) => {
  const ref = useScrollReveal();
  const [hov, setHov] = useState(false);

  return (
    <div ref={ref} className="sr-item col-md-6 col-lg-3" style={{ animationDelay: `${index * 75}ms` }}>
      <div
        className="proj-card-shell"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          transform: hov ? "translateY(-8px) scale(1.015)" : "translateY(0) scale(1)",
          boxShadow: hov
            ? "0 0 0 1px rgba(124,143,255,0.4), 0 20px 48px rgba(0,0,0,0.55)"
            : "0 0 0 1px rgba(124,143,255,0.12), 0 4px 16px rgba(0,0,0,0.4)",
          transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease",
        }}
      >
        <div className="proj-card-glow" style={{ opacity: hov ? 1 : 0 }} />
        <ProjectCard project={project} />
      </div>
    </div>
  );
};

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProjects = projects.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @keyframes pj-fadeUp {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pj-fadeIn {from{opacity:0}to{opacity:1}}

        .proj-root {
          position:relative; min-height:calc(100vh - 60px);
          background:var(--bg); overflow:hidden; padding:4rem 0 5rem;
        }
        .proj-root::before {
          content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(var(--grid-line) 1px,transparent 1px),
            linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);
          background-size:44px 44px; animation:shell-grid-pan 8s linear infinite;
        }
        .proj-root::after {
          content:""; position:absolute; top:-80px; left:50%; transform:translateX(-50%);
          width:700px; height:420px; pointer-events:none; z-index:0;
          background:radial-gradient(ellipse,var(--accent-glow) 0%,transparent 70%);
        }
        .proj-inner{position:relative;z-index:1;}

        .proj-heading {
          font-size:clamp(2.8rem,7vw,5.5rem);
          animation:pj-fadeUp 0.55s 0.1s cubic-bezier(.34,1.56,.64,1) both;
          margin-bottom:0;
        }
        .proj-rule {
          animation:pj-fadeIn 0.5s 0.3s ease both;
        }

        /* Dark override for ProjectCard internals */
        .proj-card-shell {
          position:relative; border-radius:16px; overflow:hidden; height:100%;
          background:rgba(255,255,255,0.025);
          border:1px solid var(--accent-border);
        }
        .proj-card-shell .card,
        .proj-card-shell .project-card {
          background:transparent!important; border:none!important;
          color:var(--text-secondary)!important; height:100%;
        }
        .proj-card-shell .card-title,
        .proj-card-shell .project-card-title {
          color:var(--text-primary)!important;
          font-family:var(--font-display)!important; font-weight:700!important;
        }
        .proj-card-shell .card-text,
        .proj-card-shell .card-body p,
        .proj-card-shell .text-muted { color:var(--text-secondary)!important; font-size:0.82rem!important; }
        .proj-card-shell .badge {
          background:var(--accent-dim)!important; color:rgba(200,210,255,0.75)!important;
          border:1px solid var(--accent-border)!important;
          font-family:var(--font-mono)!important; font-size:0.63rem!important;
        }
        .proj-card-shell a.btn, .proj-card-shell .btn-primary {
          background:var(--accent-dim)!important; border:1px solid var(--accent-border)!important;
          color:rgba(200,210,255,0.8)!important; font-family:var(--font-mono)!important;
          font-size:0.74rem!important; transition:all 0.2s!important;
        }
        .proj-card-shell a.btn:hover,.proj-card-shell .btn-primary:hover {
          background:rgba(124,143,255,0.25)!important; border-color:rgba(124,143,255,0.55)!important; color:#fff!important;
        }
        .proj-card-shell img.card-img-top {
          filter:brightness(0.8) saturate(0.88);
          transition:filter 0.3s ease;
        }
        .proj-card-shell:hover img.card-img-top { filter:brightness(0.95) saturate(1); }

        .proj-card-glow {
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 0%,rgba(124,143,255,0.14) 0%,transparent 65%);
          transition:opacity 0.35s ease;
        }

        /* Pagination */
        .proj-pagination {
          display:flex; align-items:center; justify-content:center;
          gap:8px; margin-top:3.5rem; animation:pj-fadeIn 0.5s 0.5s ease both;
          font-family:var(--font-mono);
        }
        .proj-pg-arrow {
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 16px; border-radius:10px; font-size:0.74rem; font-weight:500; letter-spacing:0.04em;
          background:var(--accent-dim); border:1px solid var(--accent-border);
          color:var(--text-secondary); cursor:pointer; transition:all 0.2s;
        }
        .proj-pg-arrow:hover:not(:disabled){border-color:rgba(124,143,255,0.5);color:var(--text-primary);background:rgba(124,143,255,0.16);}
        .proj-pg-arrow:disabled{opacity:0.28;cursor:not-allowed;}
        .proj-pg-dot {
          width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center;
          border-radius:8px; font-size:0.74rem; font-weight:500;
          background:transparent; border:1px solid rgba(124,143,255,0.12); color:var(--text-dim);
          cursor:pointer; transition:all 0.2s;
        }
        .proj-pg-dot:hover{border-color:rgba(124,143,255,0.38);color:var(--text-secondary);}
        .proj-pg-dot.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(124,143,255,0.28);}
        .proj-pg-sep{font-size:0.68rem;color:var(--text-dim);letter-spacing:0.1em;padding:0 2px;}
      `}</style>

      <div className="proj-root">
        <div className="proj-inner container">

          {/* Header */}
          <div className="text-center mb-5">
            <p className="eyebrow" style={{ animation: "pj-fadeIn 0.5s 0.05s ease both", marginBottom: "0.75rem" }}>Portfolio</p>
            <h1 className="display-heading proj-heading">Projects</h1>
            <div className="section-rule proj-rule" />
          </div>

          {/* Cards */}
          <div className="row g-4 align-items-stretch">
            {currentProjects.map((project, i) => (
              <AnimatedCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="proj-pagination">
              <button className="proj-pg-arrow" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <i className="bi bi-arrow-left" /> Prev
              </button>
              <span className="proj-pg-sep">{currentPage} / {totalPages}</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={`proj-pg-dot ${page === currentPage ? "active" : ""}`} onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              ))}
              <span className="proj-pg-sep" style={{ opacity: 0 }}>{currentPage} / {totalPages}</span>
              <button className="proj-pg-arrow" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next <i className="bi bi-arrow-right" />
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Projects;