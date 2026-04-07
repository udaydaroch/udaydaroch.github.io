import { useEffect, useRef, useState } from "react";
import "./Home.css";
import "./theme.css";

// ── Particle cursor trail ────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    type P = { x:number;y:number;vx:number;vy:number;life:number;maxLife:number;size:number;hue:number };
    const ps: P[] = [];
    const onMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) ps.push({
        x: e.clientX + (Math.random()-.5)*8, y: e.clientY + (Math.random()-.5)*8,
        vx: (Math.random()-.5)*1.1, vy: -Math.random()*1.4-.4,
        life: 1, maxLife: 0.6+Math.random()*0.6,
        size: 1.8+Math.random()*2.8, hue: 230+Math.random()*50,
      });
    };
    window.addEventListener("mousemove", onMove);
    let raf: number;
    const tick = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=ps.length-1;i>=0;i--) {
        const p=ps[i]; p.x+=p.vx; p.y+=p.vy; p.vy-=0.025; p.life-=0.022/p.maxLife;
        if(p.life<=0){ps.splice(i,1);continue;}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},65%,72%,${p.life*0.42})`; ctx.fill();
      }
      raf=requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",onMove); };
  }, []);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}} />;
}

// ── Orbital skill tags ───────────────────────────────────────────────────────
const SKILLS = [
  {label:"React",angle:0},{label:"TypeScript",angle:51},{label:"Laravel",angle:102},
  {label:"Vue.js",angle:153},{label:"Python",angle:204},{label:"Docker",angle:255},{label:"PostgreSQL",angle:306},
];
function OrbitTags() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(()=>setTick(t=>t+1),50); return ()=>clearInterval(id); },[]);
  const pos = (r:number,speed:number,base:number) => {
    const a=((base+tick*speed)*Math.PI)/180;
    return {x:Math.cos(a)*r, y:Math.sin(a)*(r*0.38)};
  };
  return (
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:1}}>
      {SKILLS.slice(0,4).map(s=>{ const{x,y}=pos(220,0.18,s.angle); return(
        <span key={s.label} className="orbit-tag" style={{transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`}}>{s.label}</span>
      );})}
      {SKILLS.slice(4).map(s=>{ const{x,y}=pos(310,-0.11,s.angle); return(
        <span key={s.label} className="orbit-tag orbit-tag--b" style={{transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`}}>{s.label}</span>
      );})}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const Home = () => (
  <>
    <style>{`
      @keyframes fadeUp  {from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
      @keyframes scaleIn {from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
      @keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

      .home-root {
        position:relative; min-height:calc(100vh - 60px);
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        overflow:hidden; background:var(--bg);
      }
      .home-root::before {
        content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
        background-image:
          linear-gradient(var(--grid-line) 1px,transparent 1px),
          linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);
        background-size:44px 44px; animation:shell-grid-pan 8s linear infinite;
      }
      .home-root::after {
        content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
        background:radial-gradient(ellipse 70% 55% at 50% 50%,var(--accent-glow) 0%,transparent 70%);
      }
      .home-content {
        position:relative; z-index:2;
        display:flex; flex-direction:column; align-items:center; text-align:center; padding:2rem 1.5rem;
      }
      .home-name {
        font-family:var(--font-display);
        font-size:clamp(3.6rem,11vw,8.5rem); font-weight:800; line-height:0.95; letter-spacing:-0.03em;
        background:linear-gradient(135deg,#ffffff 0%,#c8d0f0 35%,var(--accent) 65%,var(--purple) 100%);
        background-size:280% 280%;
        -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        animation:scaleIn 0.7s 0.2s cubic-bezier(.34,1.56,.64,1) both, heading-shimmer 8s 1s ease infinite;
        margin-bottom:0.5rem;
      }
      .home-subtitle {
        font-family:var(--font-mono); font-size:clamp(0.7rem,1.8vw,0.85rem); font-weight:400;
        letter-spacing:0.14em; color:var(--text-secondary);
        animation:fadeUp 0.6s 0.45s ease both; margin-top:1rem;
        display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:center;
      }
      .subtitle-dot {width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:0.45;display:inline-block;}
      .home-socials {
        display:flex; gap:0.85rem; margin-top:2.5rem;
        animation:fadeUp 0.6s 0.6s ease both; flex-wrap:wrap; justify-content:center;
      }
      .social-linkedin:hover{border-color:rgba(79,158,255,0.55)!important;box-shadow:0 8px 24px rgba(79,158,255,0.15)!important;}
      .social-linkedin i{color:#5fa8e8;}
      .social-github i{color:#8892aa;}
      .orbit-tag {
        position:absolute; top:50%; left:50%;
        font-family:var(--font-mono); font-size:0.61rem; font-weight:500; letter-spacing:0.06em;
        padding:4px 10px; border-radius:999px;
        border:1px solid var(--accent-border); background:rgba(10,11,18,0.82);
        color:rgba(175,188,255,0.68); backdrop-filter:blur(6px); white-space:nowrap; pointer-events:none;
        animation:fadeIn 1s 1s ease both;
      }
      .orbit-tag--b{border-color:rgba(167,139,250,0.18);color:rgba(196,182,255,0.58);}
      .scroll-hint {
        position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
        z-index:2; display:flex; flex-direction:column; align-items:center; gap:6px;
        animation:fadeIn 1s 1.2s ease both; color:var(--text-dim);
        font-family:var(--font-mono); font-size:0.6rem; letter-spacing:0.14em;
      }
      .scroll-hint-bar {
        width:1px; height:28px;
        background:linear-gradient(to bottom,rgba(124,143,255,0.3),transparent);
        animation:floatY 2s ease-in-out infinite;
      }
      .orbit-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:340px;pointer-events:none;z-index:1;}
      @media(max-width:768px){.orbit-wrap{display:none;}}
    `}</style>

    <div className="home-root">
      <ParticleCanvas />
      <div className="orbit-wrap"><OrbitTags /></div>
      <div className="home-content">
        <p className="eyebrow" style={{animation:"fadeIn 0.6s 0.1s ease both",marginBottom:"1rem"}}>Software Engineer</p>
        <h1 className="home-name">Uday<br />Daroch</h1>
        <p className="home-subtitle">
          <span>Full Stack</span><span className="subtitle-dot"/>
          <span>AI</span><span className="subtitle-dot"/>
          <span>Security</span><span className="subtitle-dot"/>
          <span>Christchurch, NZ</span>
        </p>
        <div className="home-socials">
          <a href="https://linkedin.com/in/uday-daroch-152a51280" target="_blank" rel="noopener noreferrer" className="ghost-btn social-linkedin">
            <i className="bi bi-linkedin" style={{position:"relative",zIndex:1}}/>
            <span style={{position:"relative",zIndex:1}}>LinkedIn</span>
          </a>
          <a href="https://github.com/udaydaroch" target="_blank" rel="noopener noreferrer" className="ghost-btn social-github">
            <i className="bi bi-github" style={{position:"relative",zIndex:1}}/>
            <span style={{position:"relative",zIndex:1}}>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </>
);

export default Home;