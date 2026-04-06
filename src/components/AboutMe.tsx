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
import "./theme.css";
import "../components/AboutMe.css";

type FilterKey = "all" | "engineering" | "service" | "community";
interface Experience {
  id: string; category: FilterKey[]; modalTarget: string;
  image?: string; iconClass?: string; iconBg?: string; iconColor?: string;
  title: string; subtitle: string; period: string; badges: string[]; bullets: string[];
}

const experiences: Experience[] = [
  { id:"ubiik", category:["engineering"], modalTarget:"#ubiikModal", image:ubiikImg,
    title:"Software Engineering Intern", subtitle:"Ubiik Mimomax", period:"2025 – Present",
    badges:["Laravel","PHP","Bootstrap 5","Docker","SQLite / PostgreSQL"],
    bullets:["Modernising UI from Bootstrap 3 → 5.","Building tools to manage SQLite configuration files.","Extending Laravel modules and reusable API workflows.","Working across Dockerised SQL data pipelines."] },
  { id:"fleetpin", category:["engineering"], modalTarget:"#fleetpinModal", image:fleetpinImg,
    title:"Software Engineering Intern", subtitle:"Fleetpin", period:"2024 – 2025",
    badges:["Vue.js","REST APIs","Service Workers","SQL","Scala"],
    bullets:["Optimised batch queries for GPS tracking.","Integrated backend APIs for smoother flows.","Implemented offline mode through service workers.","Fixed UI bugs and improved critical UX paths."] },
  { id:"tutor", category:["engineering","community"], modalTarget:"#tutorModal", image:tutorImg,
    title:"Programming Tutor", subtitle:"University of Canterbury · COSC121 & COSC131", period:"2025",
    badges:["Python","Problem Solving","Teaching"],
    bullets:["Taught programming fundamentals step-by-step.","Helped debug student code and improve reasoning.","Supported labs, assignments, and tutorials.","Helped run bootcamps and exam prep sessions."] },
  { id:"isa", category:["community"], modalTarget:"#isaModal",
    iconClass:"bi bi-people-fill", iconBg:"rgba(124,143,255,0.08)", iconColor:"#9aabff",
    title:"General Executive", subtitle:"Indian Student Association · UC", period:"2024",
    badges:["Event Planning","Marketing"],
    bullets:["Coordinated cultural events and socials.","Handled event marketing and promotion.","Collaborated with exec team on logistics."] },
  { id:"pizzahut", category:["service"], modalTarget:"#pizzaHutModal",
    iconClass:"bi bi-bicycle", iconBg:"rgba(220,80,60,0.08)", iconColor:"#e07060",
    title:"Delivery Driver", subtitle:"Pizza Hut", period:"Oct 2023 – Jun 2024",
    badges:["Delivery","Customer Service"],
    bullets:["Prepared food in a fast-paced kitchen.","Delivered orders accurately and on time.","Managed stock and food safety standards."] },
  { id:"paknsave", category:["service"], modalTarget:"#paknsaveModal",
    iconClass:"bi bi-cart-fill", iconBg:"rgba(180,140,0,0.08)", iconColor:"#c9a84c",
    title:"Grocery Assistant", subtitle:"PAK'nSAVE", period:"Dec 2020 – Aug 2021",
    badges:["Teamwork","Stock Management"],
    bullets:["Rotated and replenished stock.","Assisted customers with in-store needs.","Kept store clean and well-organised."] },
  { id:"saket", category:["service"], modalTarget:"#saketModal",
    iconClass:"bi bi-cup-hot-fill", iconBg:"rgba(190,90,40,0.08)", iconColor:"#d4845a",
    title:"Waiter Staff", subtitle:"Saket Indian Restaurant", period:"2017 – 2019",
    badges:["Table Service","Delivery"],
    bullets:["Welcomed guests and managed table service.","Handled orders, counter, and deliveries.","Supported kitchen and food prep duties."] },
];

const FILTERS: {key:FilterKey;label:string;icon:string}[] = [
  {key:"all",label:"All",icon:"bi-grid-fill"},
  {key:"engineering",label:"Engineering",icon:"bi-code-slash"},
  {key:"service",label:"Customer Service",icon:"bi-person-heart"},
  {key:"community",label:"Community",icon:"bi-people-fill"},
];

const CYCLING_WORDS = [
  {text:"engineer.",     color:"#7c8fff"},
  {text:"tutor.",        color:"#a78bfa"},
  {text:"team player.",  color:"#5cb8a0"},
  {text:"problem solver.",color:"#d4924a"},
  {text:"customer-first.",color:"#c47070"},
];

function CyclingWord() {
  const [wi, setWi] = useState(0);
  const [disp, setDisp] = useState("");
  const [phase, setPhase] = useState<"typing"|"waiting"|"erasing">("typing");
  useEffect(() => {
    const target = CYCLING_WORDS[wi].text;
    let t: ReturnType<typeof setTimeout>;
    if (phase==="typing") {
      if (disp.length<target.length) t=setTimeout(()=>setDisp(target.slice(0,disp.length+1)),65);
      else t=setTimeout(()=>setPhase("waiting"),1800);
    } else if (phase==="waiting") {
      t=setTimeout(()=>setPhase("erasing"),0);
    } else {
      if (disp.length>0) t=setTimeout(()=>setDisp(disp.slice(0,-1)),35);
      else { setWi(i=>(i+1)%CYCLING_WORDS.length); setPhase("typing"); }
    }
    return ()=>clearTimeout(t);
  },[disp,phase,wi]);
  return (
    <span style={{color:CYCLING_WORDS[wi].color,transition:"color 0.3s ease",display:"inline-block",minWidth:"2ch"}}>
      {disp}
      <span style={{display:"inline-block",width:"3px",height:"0.85em",background:CYCLING_WORDS[wi].color,
        marginLeft:"2px",verticalAlign:"middle",animation:"aboutCursorBlink 1s step-end infinite",borderRadius:"1px"}}/>
    </span>
  );
}

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({x:-999,y:-999});
  const raf = useRef<number>(0);
  const draw = useCallback(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d"); if(!ctx)return;
    const W=canvas.width,H=canvas.height,GAP=30,MAX=110;
    ctx.clearRect(0,0,W,H);
    for(let x=GAP;x<W;x+=GAP) for(let y=GAP;y<H;y+=GAP){
      const dx=x-mouse.current.x,dy=y-mouse.current.y;
      const inf=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/MAX);
      ctx.beginPath(); ctx.arc(x,y,1.1+inf*2.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(124,143,255,${0.055+inf*0.28})`; ctx.fill();
    }
    raf.current=requestAnimationFrame(draw);
  },[]);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const parent=canvas.parentElement!;
    const resize=()=>{canvas.width=parent.offsetWidth;canvas.height=parent.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const onMove=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();mouse.current={x:e.clientX-r.left,y:e.clientY-r.top};};
    const onLeave=()=>{mouse.current={x:-999,y:-999};};
    parent.addEventListener("mousemove",onMove); parent.addEventListener("mouseleave",onLeave);
    raf.current=requestAnimationFrame(draw);
    return ()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);
      parent.removeEventListener("mousemove",onMove);parent.removeEventListener("mouseleave",onLeave);};
  },[draw]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}/>;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("sr-visible");obs.disconnect();}},{threshold:0.08});
    obs.observe(el); return()=>obs.disconnect();
  },[]);
  return ref;
}

const ExperienceCard = ({exp,index}:{exp:Experience;index:number}) => {
  const [hov, setHov] = useState(false);
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="sr-item col-12 col-md-6 col-lg-4" style={{animationDelay:`${index*55}ms`}}>
      <button
        className="h-100 border-0 text-start p-0 glass-card about-exp-card"
        data-bs-toggle="modal" data-bs-target={exp.modalTarget}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{cursor:"pointer",width:"100%",background:"rgba(255,255,255,0.025)",display:"flex",flexDirection:"column"}}
      >
        {exp.image ? (
          <div style={{position:"relative",overflow:"hidden",borderRadius:"15px 15px 0 0"}}>
            <img src={exp.image} style={{height:"180px",objectFit:"cover",display:"block",width:"100%",
              transform:hov?"scale(1.06)":"scale(1)",transition:"transform 0.4s ease",
              filter:"brightness(0.8) saturate(0.85)"}} alt={exp.subtitle}/>
            <div style={{position:"absolute",inset:0,background:hov?"rgba(124,143,255,0.1)":"transparent",transition:"background 0.3s ease"}}/>
          </div>
        ):(
          <div className="d-flex align-items-center justify-content-center"
            style={{height:"110px",background:exp.iconBg,borderRadius:"15px 15px 0 0"}}>
            <i className={exp.iconClass} style={{fontSize:"2.2rem",color:exp.iconColor,
              transform:hov?"scale(1.18) rotate(-5deg)":"scale(1) rotate(0)",
              transition:"transform 0.3s cubic-bezier(.34,1.56,.64,1)"}}/>
          </div>
        )}
        <div style={{height:"2px",background:hov?"linear-gradient(90deg,var(--accent),var(--purple))":"rgba(124,143,255,0.1)",transition:"background 0.35s ease"}}/>
        <div className="card-body p-3" style={{display:"flex",flexDirection:"column",flex:1}}>
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h5 style={{fontSize:"0.92rem",fontFamily:"var(--font-display)",fontWeight:700,color:"var(--text-primary)",margin:0,lineHeight:1.3}}>{exp.title}</h5>
            <i className="bi bi-arrow-up-right" style={{opacity:hov?1:0,color:"var(--accent)",
              transform:hov?"translate(2px,-2px)":"translate(0,0)",transition:"opacity 0.2s,transform 0.2s",
              fontSize:"0.85rem",flexShrink:0,marginLeft:"6px"}}/>
          </div>
          <p style={{fontSize:"0.78rem",color:"var(--text-secondary)",margin:"0 0 2px"}}>{exp.subtitle}</p>
          <p style={{fontSize:"0.7rem",color:"var(--text-dim)",marginBottom:"0.6rem"}}>
            <i className="bi bi-clock me-1"/>{exp.period}
          </p>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {exp.badges.map(b=><span key={b} className="mono-badge">{b}</span>)}
          </div>
          <ul style={{fontSize:"0.77rem",color:"var(--text-secondary)",paddingLeft:"1.1rem",margin:0,marginTop:"auto"}}>
            {exp.bullets.map(b=><li key={b}>{b}</li>)}
          </ul>
        </div>
      </button>
    </div>
  );
};

const AboutMe = () => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [view, setView] = useState<"grid"|"timeline">("grid");
  const sectionRef = useScrollReveal();
  const commentsRef = useScrollReveal();
  const filtered = experiences.filter(e=>activeFilter==="all"||e.category.includes(activeFilter));

  return (
    <>
      <style>{`
        @keyframes aboutCursorBlink {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes ab-fadeUp {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

        .about-root {
          background:var(--bg); min-height:calc(100vh - 60px);
          position:relative; overflow:hidden;
        }
        .about-root::before {
          content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(var(--grid-line) 1px,transparent 1px),
            linear-gradient(90deg,var(--grid-line) 1px,transparent 1px);
          background-size:44px 44px; animation:shell-grid-pan 8s linear infinite;
        }
        .about-root::after {
          content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
          background:radial-gradient(ellipse 80% 40% at 50% 0%,var(--accent-glow) 0%,transparent 70%);
        }
        .about-inner { position:relative; z-index:1; }

        .about-hero {
          position:relative; overflow:hidden; border-radius:20px;
          padding:3.5rem 3rem 3rem; margin-bottom:3rem;
          background:rgba(255,255,255,0.022);
          border:1px solid var(--accent-border);
        }
        @media(max-width:576px){.about-hero{padding:2rem 1.25rem;}}

        .about-headline {
          font-family:var(--font-display); font-weight:800; line-height:1.1;
          font-size:clamp(2rem,5vw,3.2rem); color:var(--text-primary);
          margin:0 0 1rem; animation:ab-fadeUp 0.45s 0.08s ease both;
        }
        .about-body {
          font-size:0.95rem; color:var(--text-secondary); max-width:540px;
          line-height:1.75; animation:ab-fadeUp 0.45s 0.16s ease both; margin:0;
        }
        .about-chips {
          display:flex; flex-wrap:wrap; gap:8px; margin-top:1.4rem;
          animation:ab-fadeUp 0.45s 0.24s ease both;
        }
        .about-chip {
          display:inline-flex; align-items:center; gap:6px;
          font-family:var(--font-mono); font-size:0.72rem; font-weight:500;
          padding:5px 13px; border-radius:999px;
          background:rgba(255,255,255,0.04); border:1px solid var(--accent-border);
          color:var(--text-secondary); transition:border-color 0.18s,color 0.18s;
        }
        .about-chip:hover{border-color:rgba(124,143,255,0.45);color:var(--text-primary);}
        .about-chip i{color:var(--accent);font-size:0.68rem;}

        .about-section-heading {
          font-family:var(--font-display); font-size:1.45rem; font-weight:800;
          color:var(--text-primary); position:relative; display:inline-block;
        }
        .about-section-heading::after {
          content:""; position:absolute; bottom:-5px; left:0; width:32px; height:2px;
          background:linear-gradient(90deg,var(--accent),var(--purple)); border-radius:2px;
        }

        .ab-filter-pill {
          border:1px solid var(--accent-border); background:rgba(255,255,255,0.03);
          border-radius:999px; padding:7px 16px; font-family:var(--font-mono);
          font-size:0.78rem; font-weight:500; cursor:pointer;
          transition:all 0.18s ease; color:var(--text-secondary);
        }
        .ab-filter-pill:hover{border-color:rgba(124,143,255,0.45);color:var(--text-primary);background:rgba(124,143,255,0.07);}
        .ab-filter-pill.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(124,143,255,0.25);}
        .ab-count {
          display:inline-flex;align-items:center;justify-content:center;
          background:var(--accent-dim);color:var(--accent);
          border-radius:999px;font-size:0.65rem;font-weight:700;
          min-width:18px;height:18px;padding:0 5px;margin-left:5px;
        }
        .ab-filter-pill.active .ab-count{background:rgba(255,255,255,0.2);color:#fff;}

        .ab-view-btn {
          border:1px solid var(--accent-border);background:rgba(255,255,255,0.03);
          border-radius:9px;padding:6px 10px;font-size:0.8rem;
          cursor:pointer;transition:all 0.18s;color:var(--text-secondary);
        }
        .ab-view-btn:hover{border-color:rgba(124,143,255,0.45);color:var(--text-primary);}
        .ab-view-btn.active{background:var(--accent-dim);border-color:var(--accent);color:var(--accent);}

        .about-exp-card { border-radius:16px; }

        .about-timeline{position:relative;padding-left:2rem;}
        .about-timeline::before{content:"";position:absolute;left:0.45rem;top:0;bottom:0;width:2px;
          background:linear-gradient(to bottom,var(--accent),rgba(124,143,255,0.03));border-radius:2px;}
        .about-tl-item{position:relative;padding-bottom:1.6rem;}
        .about-tl-dot{position:absolute;left:-1.62rem;top:6px;width:11px;height:11px;border-radius:50%;
          background:var(--accent);border:2px solid var(--bg);box-shadow:0 0 0 3px var(--accent-dim);}
        .about-tl-card{
          border:1px solid var(--accent-border);border-radius:13px;
          padding:0.9rem 1.1rem;background:rgba(255,255,255,0.03);
          cursor:pointer;transition:all 0.22s;text-align:left;width:100%;
          font-family:inherit;
        }
        .about-tl-card:hover{transform:translateX(5px);box-shadow:0 6px 20px rgba(0,0,0,0.4);border-color:rgba(124,143,255,0.35);}

        /* Override Bootstrap modals to look dark */
        .modal-content{background:#0f111a!important;border:1px solid var(--accent-border)!important;color:var(--text-primary)!important;}
        .modal-header{border-bottom:1px solid var(--divider)!important;align-items:flex-start!important;}
        .modal-title,.modal-body h5,.modal-body h6{color:var(--text-primary)!important;}
        .modal-body p,.modal-body li,.modal-body .text-muted{color:var(--text-secondary)!important;}
        .modal-body .bg-light{background:rgba(255,255,255,0.04)!important;border-color:var(--accent-border)!important;}
        .modal-body .badge{background:var(--accent-dim)!important;color:rgba(200,210,255,0.8)!important;border-color:var(--accent-border)!important;}
        .btn-close{filter:invert(1) opacity(0.5);}
        .btn-primary{background:var(--accent)!important;border-color:var(--accent)!important;}
        .btn-outline-secondary{border-color:var(--accent-border)!important;color:var(--text-secondary)!important;}
      `}</style>

      <div className="about-root">
        <div className="about-inner container py-5">

          {/* Hero */}
          <div className="about-hero">
            <DotGrid />
            <div style={{position:"relative",zIndex:1}}>
              <p className="eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.6rem",animation:"ab-fadeUp 0.45s ease both"}}>About Me</p>
              <h1 className="about-headline">I'm a&nbsp;<CyclingWord /></h1>
              <p className="about-body">
                Across engineering internships, tutoring, and years of customer-facing work —
                the throughline is the same: care about the people you're serving and leave
                things better than you found them.
              </p>
              <div className="about-chips">
                <span className="about-chip"><i className="bi bi-briefcase-fill"/>7 roles across tech &amp; service</span>
                <span className="about-chip"><i className="bi bi-geo-alt-fill"/>Christchurch, NZ</span>
                <span className="about-chip"><i className="bi bi-mortarboard-fill"/>University of Canterbury</span>
                <span className="about-chip"><i className="bi bi-calendar3"/>2017 – present</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div ref={sectionRef} className="sr-block">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
              <h2 className="about-section-heading mb-0">What I've been working on</h2>
              <div className="d-flex gap-2 align-items-center">
                <span style={{fontSize:"0.72rem",color:"var(--text-dim)",fontFamily:"var(--font-mono)"}}>{filtered.length} role{filtered.length!==1?"s":""}</span>
                <button className={`ab-view-btn ${view==="grid"?"active":""}`} onClick={()=>setView("grid")} title="Grid"><i className="bi bi-grid-3x3-gap"/></button>
                <button className={`ab-view-btn ${view==="timeline"?"active":""}`} onClick={()=>setView("timeline")} title="Timeline"><i className="bi bi-list-ul"/></button>
              </div>
            </div>
            <p style={{fontSize:"0.76rem",color:"var(--text-dim)",fontFamily:"var(--font-mono)",marginBottom:"1rem"}}>
              <i className="bi bi-hand-index me-1"/>Click any card to view full details
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {FILTERS.map(f=>{
                const count=f.key==="all"?experiences.length:experiences.filter(e=>e.category.includes(f.key)).length;
                return(
                  <button key={f.key} className={`ab-filter-pill ${activeFilter===f.key?"active":""}`} onClick={()=>setActiveFilter(f.key)}>
                    <i className={`bi ${f.icon} me-1`}/>{f.label}<span className="ab-count">{count}</span>
                  </button>
                );
              })}
            </div>
            <hr style={{borderColor:"var(--divider)",marginBottom:"1.5rem"}}/>

            {view==="grid"&&(
              <div className="row g-4 align-items-stretch">
                {filtered.map((exp,i)=><ExperienceCard key={exp.id} exp={exp} index={i}/>)}
                {filtered.length===0&&<div className="col-12 text-center py-5" style={{color:"var(--text-dim)"}}>
                  <i className="bi bi-inbox fs-1 d-block mb-2"/>No experiences match this filter.
                </div>}
              </div>
            )}
            {view==="timeline"&&(
              <div className="about-timeline mt-3" style={{maxWidth:"660px"}}>
                {filtered.map(exp=>(
                  <div key={exp.id} className="about-tl-item">
                    <div className="about-tl-dot"/>
                    <button className="about-tl-card" data-bs-toggle="modal" data-bs-target={exp.modalTarget}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <p style={{margin:0,fontSize:"0.68rem",color:"var(--text-dim)",fontFamily:"var(--font-mono)"}}>
                            <i className="bi bi-clock me-1"/>{exp.period}
                          </p>
                          <h6 style={{fontFamily:"var(--font-display)",color:"var(--text-primary)",margin:"1px 0"}}>{exp.title}</h6>
                          <p style={{fontSize:"0.8rem",color:"var(--text-secondary)",margin:"0 0 6px"}}>{exp.subtitle}</p>
                        </div>
                        <i className="bi bi-arrow-up-right" style={{color:"var(--accent)",fontSize:"0.82rem"}}/>
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {exp.badges.map(b=><span key={b} className="mono-badge">{b}</span>)}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Comments */}
          <div ref={commentsRef} className="sr-block mt-5">
            <GeneralComments />
          </div>

        </div>
      </div>
      <UbiikModal/><FleetpinModal/><TutorModal/>
      <ISAModal/><PizzaHutModal/><PakNSaveModal/><SaketModal/>
    </>
  );
};

export default AboutMe;