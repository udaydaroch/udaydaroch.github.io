import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./theme.css";

const LINKS = [
  { to: "/", label: "Home", icon: "bi-house-door" },
  { to: "/projects", label: "Projects", icon: "bi-grid-1x2" },
  { to: "/about-me", label: "About Me", icon: "bi-person" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <style>{`
        .ud-nav {
          position: sticky; top: 0; z-index: 1030; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(16px, 4vw, 40px);
          background: rgba(10,12,18,0.55);
          backdrop-filter: blur(16px) saturate(140%);
          -webkit-backdrop-filter: blur(16px) saturate(140%);
          border-bottom: 1px solid transparent;
          transition: border-color .3s ease, background .3s ease;
        }
        .ud-nav.scrolled { border-bottom-color: var(--divider); background: rgba(10,12,18,0.78); }
        .ud-logo {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
          font-family: var(--font-display); font-weight: 800; font-size: 1.05rem;
          color: var(--text-primary); letter-spacing: -0.02em;
        }
        .ud-logo:hover { color: #fff; }
        .ud-logo-ball {
          width: 22px; height: 22px; border-radius: 50%; position: relative; flex-shrink: 0;
          background: radial-gradient(circle at 35% 30%, #ff8a80, var(--ball) 55%, #7a1612 100%);
          box-shadow: 0 0 14px var(--ball-glow);
          animation: ud-spin 6s linear infinite;
        }
        .ud-logo-ball::after {
          content: ""; position: absolute; inset: 2px 8px;
          border-left: 1px dashed rgba(255,255,255,0.85); border-right: 1px dashed rgba(255,255,255,0.85);
          border-radius: 50%;
        }
        @keyframes ud-spin { to { transform: rotate(360deg); } }
        .ud-links {
          display: flex; gap: 4px; padding: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--accent-border);
        }
        .ud-link {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 16px; border-radius: 999px; text-decoration: none;
          font-family: var(--font-mono); font-size: 0.78rem; font-weight: 500; letter-spacing: 0.04em;
          color: var(--text-secondary); transition: color .2s ease, background .2s ease;
          position: relative;
        }
        .ud-link:hover { color: var(--text-primary); background: rgba(124,143,255,0.08); }
        .ud-link.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(124,143,255,0.9), rgba(167,139,250,0.9));
          box-shadow: 0 4px 18px rgba(124,143,255,0.35);
        }
        .ud-live {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-secondary);
        }
        .ud-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ff4d4d; box-shadow: 0 0 0 0 rgba(255,77,77,.6); animation: ud-pulse 1.6s infinite; }
        @keyframes ud-pulse { 0%{box-shadow:0 0 0 0 rgba(255,77,77,.55)} 70%{box-shadow:0 0 0 9px rgba(255,77,77,0)} 100%{box-shadow:0 0 0 0 rgba(255,77,77,0)} }
        @media (max-width: 720px) {
          .ud-live, .ud-logo-text { display: none; }
          .ud-link span { display: none; }
          .ud-link { padding: 8px 14px; }
        }
      `}</style>
      <nav className={`ud-nav ${scrolled ? "scrolled" : ""}`}>
        <NavLink to="/" className="ud-logo" aria-label="Uday Daroch, home">
          <span className="ud-logo-ball" />
          <span className="ud-logo-text">uday daroch</span>
        </NavLink>
        <div className="ud-links">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => `ud-link ${isActive ? "active" : ""}`}>
              <i className={`bi ${l.icon}`} /><span>{l.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="ud-live"><span className="ud-live-dot" />Live · Christchurch</div>
      </nav>
    </>
  );
};

export default Navbar;
