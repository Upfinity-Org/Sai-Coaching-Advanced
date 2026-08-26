import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, Sun, Moon, Phone, Mail, MapPin,
  BookOpen, Atom, Calculator, Clock, Users, Award,
  ArrowRight, Camera, Send,
  GraduationCap, ChevronDown, Star, ChevronRight,
  CheckCircle, Zap
} from "lucide-react";

/* =========================================================
   TYPES & DATA
   ========================================================= */
type Page = "home" | "about" | "gallery" | "blog" | "contact";

/* ---- Business info — single source of truth ----
   NOTE: Email is a placeholder (not on the source info card) — swap in the real one. */
const BRAND = {
  name: "Sai Coaching Center",
  location: "Thoraipakkam",
  cityLine: "Thoraipakkam, Chennai",
  addressLine: "Thoraipakkam, Chennai, Tamil Nadu", // TODO: replace with exact door no. / street once confirmed
  phone1: "91711 19078",
  phone2: "86789 78053",
  phone1Href: "+919171119078",
  phone2Href: "+918678978053",
  email: "info@saicoachingcenter.in", // TODO: placeholder — replace with the real business email
};

const TEACHERS = [
  { id: 1, name: "Mathematics Faculty", subject: "Mathematics", classes: "IX–XII", pin: "#E05252", rotation: -2.5, bio: "Expert in Algebra, Calculus & Coordinate Geometry" },
  { id: 2, name: "Physics Faculty", subject: "Physics", classes: "XI–XII", pin: "#4A90D9", rotation: 1.5, bio: "Specialist in Mechanics, Optics & Modern Physics" },
  { id: 3, name: "Chemistry Faculty", subject: "Chemistry", classes: "XI–XII", pin: "#48A86A", rotation: -1, bio: "Expert in Organic, Inorganic & Physical Chemistry" },
  { id: 4, name: "Science Faculty", subject: "Science", classes: "IX–X", pin: "#D4A017", rotation: 2.5, bio: "Strong foundation building for CBSE 9th & 10th Science" },
];

const BLOG_POSTS = [
  { id: 1, subject: "Mathematics", subjectColor: "#6AAE45", title: "Mastering Quadratic Equations: 3 Methods Every Student Must Know", excerpt: "From factorisation to the discriminant — a complete classroom guide with worked examples and common pitfalls.", date: "12 Aug 2025", readTime: "8 min read", page: 32 },
  { id: 2, subject: "Physics", subjectColor: "#4A90D9", title: "Newton's Laws in Real-World Scenarios: Why F = ma Explains Everything", excerpt: "How the three laws of motion govern car brakes, rockets, and your cricket ball — with free-body diagrams.", date: "8 Aug 2025", readTime: "6 min read", page: 18 },
  { id: 3, subject: "Chemistry", subjectColor: "#48A86A", title: "Understanding Organic Reactions: A Visual Approach to Mechanisms", excerpt: "Functional groups, reaction arrows, and memory techniques that stick for board exams and beyond.", date: "2 Aug 2025", readTime: "10 min read", page: 45 },
];

const GALLERY_IMGS = [
  { id: "photo-1561089489-f13d5e730d72", caption: "Board Session", rotate: -1 },
  { id: "photo-1631888717579-50577ecc6553", caption: "Group Study", rotate: 1.5 },
  { id: "photo-1571193161738-deaba9b6cc26", caption: "Focused Learning", rotate: -0.5 },
  { id: "photo-1721702754494-fdd7189f946c", caption: "Library Hours", rotate: 2 },
  { id: "photo-1578593139939-cccb1e98698c", caption: "Revision Class", rotate: -1.5 },
  { id: "photo-1511629091441-ee46146481b6", caption: "One-on-One Session", rotate: 1 },
];

/* =========================================================
   GLOBAL STYLES (injected)
   ========================================================= */
const GLOBAL_STYLES = `
  :root {
    --font-heading: 'Source Serif 4', 'Libre Baskerville', Georgia, serif;
    --font-body: 'Inter', 'Source Sans 3', 'Segoe UI', sans-serif;
  }

  @keyframes chalkWrite {
    0%   { opacity: 0; filter: blur(5px); transform: translateY(10px); }
    60%  { filter: blur(0.6px); }
    100% { opacity: 1; filter: blur(0.2px); transform: translateY(0); }
  }
  @keyframes strokeDraw {
    from { stroke-dashoffset: 3000; opacity: 0.4; }
    to   { stroke-dashoffset: 0;    opacity: 0.85; }
  }
  @keyframes dustFloat {
    0%   { opacity: 0.9; transform: translateY(0) scale(1); }
    100% { opacity: 0;   transform: translateY(-50px) translateX(12px) scale(0.1); }
  }
  @keyframes dusterMove {
    0%   { transform: translateX(-120%) skewX(-4deg); }
    100% { transform: translateX(120%)  skewX(-4deg); }
  }
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(7px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes noteSwing {
    0%, 100% { transform-origin: top center; transform: rotate(var(--rot)); }
    50%       { transform: rotate(calc(var(--rot) * -0.6)); }
  }

  .chalk {
    font-family: var(--font-heading);
    color: rgba(245,240,228,0.93);
    text-shadow: 0 0 12px rgba(245,240,228,0.15), 2px 2px 0 rgba(0,0,0,0.3);
    filter: blur(0.22px);
  }
  .chalk-blue  { color: rgba(170,210,255,0.92); text-shadow: 0 0 10px rgba(170,210,255,0.25), 1px 1px 0 rgba(0,0,0,0.3); filter: blur(0.22px); font-family: var(--font-heading); }
  .chalk-yellow{ color: rgba(255,230,120,0.92); text-shadow: 0 0 10px rgba(255,230,120,0.25), 1px 1px 0 rgba(0,0,0,0.3); filter: blur(0.22px); font-family: var(--font-heading); }
  .chalk-pink  { color: rgba(255,175,175,0.90); text-shadow: 0 0 10px rgba(255,175,175,0.22), 1px 1px 0 rgba(0,0,0,0.3); filter: blur(0.22px); font-family: var(--font-heading); }
  .chalk-green { color: rgba(160,230,140,0.92); text-shadow: 0 0 10px rgba(160,230,140,0.22), 1px 1px 0 rgba(0,0,0,0.3); filter: blur(0.22px); font-family: var(--font-heading); }

  .board-bg {
    background:
      radial-gradient(ellipse at 20% 20%, rgba(80,145,50,0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 75%, rgba(30,80,15,0.25) 0%, transparent 55%),
      linear-gradient(155deg, #1B3C0C 0%, #1E4110 40%, #193C0A 75%, #152E08 100%);
  }
  .board-noise {
    position:absolute; inset:0; pointer-events:none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.045;
    mix-blend-mode: overlay;
  }
  .wood-frame {
    background:
      repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,0,0.04) 7px, rgba(0,0,0,0.04) 8px),
      linear-gradient(170deg, #9E6428 0%, #C48B45 18%, #D4995A 36%, #C08645 54%, #A06030 72%, #8B5220 100%);
  }
  .cork-bg {
    background:
      repeating-linear-gradient(-45deg, rgba(80,45,10,0.06) 0px, rgba(80,45,10,0.06) 1px, transparent 1px, transparent 9px),
      repeating-linear-gradient(45deg, rgba(80,45,10,0.04) 0px, rgba(80,45,10,0.04) 1px, transparent 1px, transparent 9px),
      radial-gradient(ellipse at 35% 45%, rgba(195,135,65,0.35) 0%, transparent 60%),
      linear-gradient(140deg, #C28555 0%, #D49868 28%, #BC8248 56%, #C99262 100%);
  }
  .lined-paper {
    background-image:
      linear-gradient(rgba(37,99,235,0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(239,68,68,0.13) 1px, transparent 1px);
    background-size: 100% 30px, 68px 100%;
    background-position: 0 10px, 68px 0;
  }
  .desk-bg {
    background:
      repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(0,0,0,0.03) 9px, rgba(0,0,0,0.03) 10px),
      linear-gradient(170deg, #6B4220 0%, #8B5A30 22%, #A06838 52%, #8B5230 80%, #6B3F1E 100%);
  }
  .svg-chalk { stroke-dasharray:3000; stroke-dashoffset:3000; }
  .svg-chalk.drawn { animation: strokeDraw 2.8s ease-out forwards; }
  .chalk-anim { opacity:0; }
  .chalk-anim.vis { animation: chalkWrite 0.75s ease-out forwards; }
  .teacher-card-hover { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
  .teacher-card-hover:hover { z-index:10; box-shadow:0 20px 60px rgba(0,0,0,0.45) !important; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(90,144,60,0.35); border-radius:3px; }

  html { font-family: var(--font-body); }
  .font-mono-eq { font-family: 'JetBrains Mono', monospace; }
`;

/* =========================================================
   HOOKS
   ========================================================= */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

function useDuster() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "wiping" | "done">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && phase === "idle") {
          setPhase("wiping");
          setTimeout(() => setPhase("done"), 950);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, phase };
}

/* =========================================================
   CHALK SVG ILLUSTRATIONS
   ========================================================= */
function MathChalkSVG({ drawn }: { drawn: boolean }) {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md opacity-80" fill="none">
      {/* Coordinate axes */}
      <line x1="30" y1="170" x2="200" y2="170" stroke="rgba(245,240,228,0.5)" strokeWidth="1.5" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.1s" }} />
      <line x1="30" y1="30" x2="30" y2="170" stroke="rgba(245,240,228,0.5)" strokeWidth="1.5" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.2s" }} />
      {/* Parabola */}
      <path d="M 50 160 Q 115 30 180 155" stroke="rgba(170,210,255,0.85)" strokeWidth="2" strokeLinecap="round" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.5s" }} />
      {/* Quadratic label */}
      <text x="190" y="80" fill="rgba(245,240,228,0.88)" fontSize="14" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.5s" }}>y = ax² + bx + c</text>
      {/* Pythagorean theorem */}
      <polygon points="260,170 360,170 260,90" stroke="rgba(255,230,120,0.8)" strokeWidth="1.5" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.8s" }} />
      <text x="265" y="185" fill="rgba(255,230,120,0.85)" fontSize="12" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.8s" }}>a</text>
      <text x="368" y="185" fill="rgba(255,230,120,0.85)" fontSize="12" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.8s" }}>b</text>
      <text x="245" y="130" fill="rgba(255,230,120,0.85)" fontSize="12" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.8s" }}>c</text>
      {/* Right angle mark */}
      <polyline points="260,155 275,155 275,170" stroke="rgba(255,230,120,0.7)" strokeWidth="1.2" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1.2s" }} />
      {/* Formula */}
      <text x="30" y="25" fill="rgba(160,230,140,0.88)" fontSize="13" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2s" }}>a² + b² = c²</text>
      {/* Integration hint */}
      <text x="200" y="155" fill="rgba(255,175,175,0.85)" fontSize="22" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.3s" }}>∫ f(x)dx</text>
    </svg>
  );
}

function PhysicsChalkSVG({ drawn }: { drawn: boolean }) {
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md opacity-80" fill="none">
      {/* Wave */}
      <path d="M 20 100 C 50 60, 80 140, 110 100 C 140 60, 170 140, 200 100 C 230 60, 260 140, 290 100" stroke="rgba(170,210,255,0.8)" strokeWidth="2" strokeLinecap="round" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.3s" }} />
      <text x="300" y="108" fill="rgba(170,210,255,0.85)" fontSize="12" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.5s" }}>λ</text>
      {/* Arrow for force */}
      <line x1="50" y1="160" x2="150" y2="160" stroke="rgba(255,230,120,0.85)" strokeWidth="2.5" strokeLinecap="round" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.6s" }} />
      <polygon points="150,155 165,160 150,165" fill="rgba(255,230,120,0.85)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.3s 1.2s" }} />
      <text x="85" y="150" fill="rgba(255,230,120,0.9)" fontSize="13" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.4s" }}>F⃗</text>
      {/* Box being pushed */}
      <rect x="165" y="145" width="40" height="30" stroke="rgba(245,240,228,0.7)" strokeWidth="1.5" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1s" }} />
      <text x="174" y="165" fill="rgba(245,240,228,0.75)" fontSize="11" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2s" }}>m</text>
      {/* Ground line */}
      <line x1="30" y1="175" x2="240" y2="175" stroke="rgba(245,240,228,0.4)" strokeWidth="1" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.8s" }} />
      {/* F=ma */}
      <text x="270" y="50" fill="rgba(160,230,140,0.9)" fontSize="26" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.2s" }}>F = ma</text>
      {/* E=mc2 */}
      <text x="270" y="90" fill="rgba(255,175,175,0.88)" fontSize="22" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.5s" }}>E = mc²</text>
      {/* v = u+at */}
      <text x="270" y="130" fill="rgba(255,230,120,0.85)" fontSize="18" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.8s" }}>v = u + at</text>
    </svg>
  );
}

function ChemistryChalkSVG({ drawn }: { drawn: boolean }) {
  const cx = 80, cy = 100, r = 45;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const pts = hex.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 420 200" className="w-full max-w-md opacity-80" fill="none">
      {/* Benzene ring */}
      <polygon points={pts} stroke="rgba(160,230,140,0.85)" strokeWidth="2" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.3s" }} />
      <circle cx={cx} cy={cy} r={r * 0.55} stroke="rgba(160,230,140,0.6)" strokeWidth="1.5" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "0.9s" }} />
      <text x="65" y="178" fill="rgba(160,230,140,0.85)" fontSize="12" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.8s" }}>C₆H₆</text>
      {/* Water molecule */}
      <circle cx="240" cy="80" r="16" stroke="rgba(170,210,255,0.85)" strokeWidth="1.8" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1.1s" }} />
      <circle cx="200" cy="55" r="10" stroke="rgba(245,240,228,0.75)" strokeWidth="1.5" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1.4s" }} />
      <circle cx="280" cy="55" r="10" stroke="rgba(245,240,228,0.75)" strokeWidth="1.5" fill="none" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1.6s" }} />
      <line x1="228" y1="68" x2="210" y2="62" stroke="rgba(245,240,228,0.6)" strokeWidth="1.5" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "1.8s" }} />
      <line x1="252" y1="68" x2="270" y2="62" stroke="rgba(245,240,228,0.6)" strokeWidth="1.5" className={`svg-chalk ${drawn ? "drawn" : ""}`} style={{ animationDelay: "2s" }} />
      <text x="228" y="82" fill="rgba(170,210,255,0.9)" fontSize="11" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.2s" }}>O</text>
      <text x="194" y="57" fill="rgba(245,240,228,0.8)" fontSize="11" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.4s" }}>H</text>
      <text x="277" y="57" fill="rgba(245,240,228,0.8)" fontSize="11" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.4s" }}>H</text>
      <text x="210" y="108" fill="rgba(170,210,255,0.88)" fontSize="13" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.6s" }}>H₂O</text>
      {/* Reaction */}
      <text x="170" y="155" fill="rgba(255,230,120,0.88)" fontSize="13" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 2.8s" }}>2H₂ + O₂ → 2H₂O</text>
      {/* CO2 */}
      <text x="300" y="160" fill="rgba(255,175,175,0.85)" fontSize="18" fontFamily="var(--font-heading)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s 3s" }}>CO₂</text>
    </svg>
  );
}

/* =========================================================
   SHARED UI COMPONENTS
   ========================================================= */

// The Blackboard with wooden frame
function Board({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`wood-frame p-3 md:p-4 rounded-sm ${className}`} style={{ boxShadow: "0 8px 50px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)", ...style }}>
      {/* Top chalk tray ledge detail */}
      <div className="relative board-bg rounded-sm overflow-hidden" style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.45), inset 0 0 30px rgba(0,0,0,0.3)" }}>
        <div className="board-noise" />
        {/* Smudge marks */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 120px 60px at 20% 35%, rgba(255,255,255,0.025) 0%, transparent 100%), radial-gradient(ellipse 80px 40px at 75% 60%, rgba(255,255,255,0.018) 0%, transparent 100%), radial-gradient(ellipse 150px 30px at 55% 20%, rgba(255,255,255,0.012) 0%, transparent 100%)" }} />
        <div className="relative">{children}</div>
      </div>
      {/* Bottom chalk tray */}
      <div className="flex gap-2 mt-1.5 px-2 items-end">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: `${12 + i * 4}px`, height: "6px", background: `rgba(245,240,228,${0.55 + i * 0.06})`, transform: `rotate(${-2 + i}deg)` }} />
        ))}
        <div style={{ width: 32, height: 10, background: "rgba(180,160,130,0.6)", borderRadius: 2 }} title="duster" />
      </div>
    </div>
  );
}

// Duster Wipe Section — triggers on scroll enter
function DusterSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, phase } = useDuster();
  const showDust = phase === "wiping";

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Duster sweep overlay */}
      {showDust && (
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ animation: "dusterMove 0.85s ease-in-out forwards" }}>
          <div style={{ width: "30%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(210,230,200,0.5) 40%, rgba(230,245,220,0.65) 50%, rgba(210,230,200,0.5) 60%, transparent)", position: "absolute", inset: 0 }} />
          {/* Chalk dust particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${2 + Math.random() * 4}px`, height: `${2 + Math.random() * 4}px`,
              background: "rgba(245,240,228,0.85)",
              left: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
              animation: `dustFloat ${0.4 + Math.random() * 0.6}s ${Math.random() * 0.4}s ease-out forwards`,
            }} />
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== "idle" ? 1 : 0 }}
        transition={{ duration: 0.55, delay: phase === "done" ? 0.05 : 0.9 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Chalk rule divider
function ChalkRule() {
  return <div className="w-full h-px my-1 opacity-30" style={{ background: "repeating-linear-gradient(90deg, rgba(245,240,228,0.7) 0px, rgba(245,240,228,0.7) 8px, transparent 8px, transparent 12px)" }} />;
}

/* =========================================================
   NAVIGATION
   ========================================================= */
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "About", page: "about" },
  { label: "Gallery", page: "gallery" },
  { label: "Blog", page: "blog" },
  { label: "Contact", page: "contact" },
];

function Navbar({ page, setPage, dark, setDark }: { page: Page; setPage: (p: Page) => void; dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2 shadow-xl" : "py-3"}`}
      style={{ background: scrolled ? (dark ? "rgba(13,26,7,0.95)" : "rgba(44,80,22,0.97)") : "rgba(0,0,0,0)", backdropFilter: scrolled ? "blur(12px)" : "none" }}>
      <div className="max-w-[1440px] mx-auto px-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => { setPage("home"); setOpen(false); }} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "linear-gradient(135deg, #2C5016, #5A9040)", boxShadow: "0 2px 12px rgba(90,144,64,0.4)", fontFamily: "var(--font-body)" }}>SC</div>
          <div>
            <div className="chalk text-lg font-bold leading-none tracking-wide">Sai Coaching</div>
            <div className="text-xs font-medium tracking-widest uppercase opacity-60" style={{ color: "rgba(245,240,228,0.7)", fontFamily: "var(--font-body)" }}>Center</div>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, page: p }) => (
            <button key={p} onClick={() => setPage(p)}
              className="px-3 py-1.5 rounded transition-all duration-200"
              style={{
                fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 600, letterSpacing: "0.03em",
                color: page === p ? "rgba(255,230,120,0.95)" : "rgba(245,240,228,0.75)",
                textShadow: page === p ? "0 0 12px rgba(255,230,120,0.4)" : "none",
                background: page === p ? "rgba(255,255,255,0.07)" : "transparent",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full transition-colors" style={{ background: "rgba(245,240,228,0.1)", color: "rgba(245,240,228,0.8)" }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setPage("contact")} className="hidden md:flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition-all" style={{ background: "rgba(245,240,228,0.12)", color: "rgba(245,240,228,0.9)", border: "1px solid rgba(245,240,228,0.25)", fontFamily: "var(--font-body)" }}>
            Enquire Now <ArrowRight size={14} />
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2" style={{ color: "rgba(245,240,228,0.8)" }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 px-5 py-4 flex flex-col gap-1"
            style={{ background: dark ? "rgba(13,26,7,0.97)" : "rgba(44,80,22,0.97)", backdropFilter: "blur(12px)" }}>
            {NAV_ITEMS.map(({ label, page: p }) => (
              <button key={p} onClick={() => { setPage(p); setOpen(false); }} className="text-left px-3 py-2 rounded"
                style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600, color: page === p ? "rgba(255,230,120,0.95)" : "rgba(245,240,228,0.8)" }}>
                {label}
              </button>
            ))}
            <button onClick={() => { setPage("contact"); setOpen(false); }} className="mt-2 px-4 py-2.5 rounded text-sm font-semibold text-center" style={{ background: "rgba(245,240,228,0.12)", color: "rgba(245,240,228,0.9)", border: "1px solid rgba(245,240,228,0.25)", fontFamily: "var(--font-body)" }}>
              Enquire Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* =========================================================
   HOME PAGE
   ========================================================= */
function HeroSection({ setPage }: { setPage: (p: Page) => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-8 page-bg"
      style={{ background: "linear-gradient(170deg, #0A1506 0%, #0F1E08 60%, #0D1A07 100%)" }}>
      <div className="w-full max-w-[1440px]">
        <Board className="w-full">
          <div className="px-6 py-10 md:px-12 md:py-14 min-h-[60vh] flex flex-col justify-between">
            {/* Top corner annotations */}
            <div className="flex justify-between items-start">
              <div className="chalk text-sm opacity-60" style={{ transform: "rotate(-1deg)" }}>CBSE Coaching</div>
              <div className="chalk text-sm opacity-60 text-right" style={{ transform: "rotate(1deg)" }}>Home Tuition &amp; Online Classes</div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center py-8 gap-6">
              {/* Handwritten headline */}
              <div className="text-center">
                <div className={`chalk text-2xl md:text-3xl opacity-70 mb-2 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "0.1s" }}>
                  — Welcome to —
                </div>
                <h1 className={`chalk text-4xl sm:text-6xl md:text-7xl font-bold leading-none tracking-wide chalk-anim ${ready ? "vis" : ""}`}
                  style={{ animationDelay: "0.3s", textShadow: "0 0 40px rgba(245,240,228,0.12), 3px 3px 0 rgba(0,0,0,0.4)" }}>
                  {BRAND.name}
                </h1>
                <div className={`chalk text-2xl md:text-3xl mt-2 opacity-80 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "0.7s" }}>
                  {BRAND.location}
                </div>
              </div>

              {/* Equations row */}
              <div className={`flex flex-wrap justify-center gap-4 mt-2 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "1s" }}>
                {["x = (-b ± √D) / 2a", "F = ma", "ΔH = Q − W", "E = mc²"].map((eq, i) => (
                  <span key={i} className="font-mono-eq text-sm px-3 py-1 rounded" style={{ color: ["rgba(170,210,255,0.85)", "rgba(255,230,120,0.85)", "rgba(160,230,140,0.85)", "rgba(255,175,175,0.85)"][i], border: `1px solid ${["rgba(170,210,255,0.25)", "rgba(255,230,120,0.25)", "rgba(160,230,140,0.25)", "rgba(255,175,175,0.25)"][i]}`, fontFamily: "JetBrains Mono, monospace" }}>
                    {eq}
                  </span>
                ))}
              </div>

              {/* Tagline */}
              <p className={`chalk text-lg md:text-xl text-center max-w-lg opacity-75 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "1.3s", lineHeight: 1.5 }}>
                Where every lesson is a discovery, every equation tells a story, and every student becomes a problem-solver.
              </p>

              {/* CTA buttons */}
              <div className={`flex flex-col sm:flex-row gap-3 mt-2 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "1.6s" }}>
                <button onClick={() => setPage("about")} className="flex items-center gap-2 px-6 py-3 font-semibold rounded transition-all hover:scale-105" style={{ background: "rgba(245,240,228,0.12)", border: "2px solid rgba(245,240,228,0.45)", color: "rgba(245,240,228,0.93)", fontFamily: "var(--font-body)" }}>
                  Meet Our Faculty <ChevronRight size={18} />
                </button>
                <button onClick={() => setPage("contact")} className="flex items-center gap-2 px-6 py-3 font-semibold rounded transition-all hover:scale-105" style={{ background: "rgba(90,144,64,0.3)", border: "2px solid rgba(90,144,64,0.6)", color: "rgba(160,230,140,0.95)", fontFamily: "var(--font-body)" }}>
                  Enquire Now <Send size={16} />
                </button>
              </div>
            </div>

            {/* Bottom stats row */}
            <div className={`flex flex-wrap justify-center gap-6 md:gap-10 pt-4 chalk-anim ${ready ? "vis" : ""}`} style={{ animationDelay: "2s" }}>
              {[["3", "Subjects"], ["2", "Levels"], ["2", "Class Modes"], ["CBSE", "Board"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="chalk text-2xl md:text-3xl font-bold">{n}</div>
                  <div className="chalk text-sm opacity-60">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </Board>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center mt-8 gap-1" style={{ color: "rgba(245,240,228,0.4)" }}>
          <span className="chalk text-sm">scroll to continue the lesson</span>
          <ChevronDown size={20} style={{ animation: "scrollBounce 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

function SubjectsSection() {
  const math = useReveal();
  const phy = useReveal();
  const chem = useReveal();

  const panels = [
    { hook: math, title: "Mathematics", tag: "IX–XII", color: "chalk-blue", icon: <Calculator size={22} />, svg: <MathChalkSVG drawn={math.vis} />, desc: "Concept-first coaching that builds problem-solving confidence for every CBSE board exam." },
    { hook: phy, title: "Physics", tag: "XI–XII", color: "chalk-yellow", icon: <Atom size={22} />, svg: <PhysicsChalkSVG drawn={phy.vis} />, desc: "From first principles to numericals, taught the way physics is meant to be understood." },
    { hook: chem, title: "Chemistry", tag: "XI–XII", color: "chalk-green", icon: <Zap size={22} />, svg: <ChemistryChalkSVG drawn={chem.vis} />, desc: "Clear explanations of reactions and mechanisms, built for lasting exam-day recall." },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0F1E08 0%, #0D1A07 100%)" }}>
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <div className="chalk text-4xl md:text-5xl font-bold">What We Teach</div>
          <ChalkRule />
          <div className="chalk text-lg opacity-70 mt-2">Three sciences. One classroom. Unlimited potential.</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {panels.map(({ hook, title, tag, color, svg, desc }) => (
            <div ref={hook.ref} key={title}>
              <DusterSection>
                <Board className="h-full">
                  <div className="p-6 md:p-8 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className={`${color} text-2xl md:text-3xl font-bold`}>{title}</div>
                      <span className="chalk text-sm opacity-60 font-mono-eq" style={{ fontFamily: "JetBrains Mono, monospace" }}>{tag}</span>
                    </div>
                    <ChalkRule />
                    {/* SVG illustration */}
                    <div className="flex justify-center py-2">{svg}</div>
                    <ChalkRule />
                    {/* Description */}
                    <p className="chalk text-base opacity-80 leading-relaxed">{desc}</p>
                  </div>
                </Board>
              </DusterSection>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUsSection({ setPage }: { setPage: (p: Page) => void }) {
  const { ref, vis } = useReveal();
  const reasons = [
    { icon: <Award size={18} />, title: "Expert Faculty", desc: "Subject-specialist teachers with deep CBSE expertise from Class IX through XII" },
    { icon: <Users size={18} />, title: "Small Batch Sizes", desc: "Maximum 15 students per batch — every student gets personal attention" },
    { icon: <Clock size={18} />, title: "Flexible Schedules", desc: "Morning, afternoon & evening slots to fit your school timetable" },
    { icon: <BookOpen size={18} />, title: "Curated Study Material", desc: "In-house notes, question banks, and solved CBSE papers" },
    { icon: <Star size={18} />, title: "Home Tuition & Online Classes", desc: "Prefer learning at home or remotely? Both home tuition and online classes are available" },
    { icon: <CheckCircle size={18} />, title: "Doubt Sessions", desc: "Dedicated weekly doubt-clearing sessions at no extra cost" },
  ];

  return (
    <DusterSection>
      <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0D1A07 0%, #0F1E08 100%)" }}>
        <div className="max-w-[1440px] mx-auto">
          <Board>
            <div ref={ref} className="px-8 py-10 md:px-14 md:py-12">
              <div className="mb-8 text-center">
                <div className="chalk text-4xl md:text-5xl font-bold">Why Learn Here?</div>
                <ChalkRule />
                <div className="chalk text-lg opacity-65 mt-2">Six reasons, written in chalk, proven in results.</div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {reasons.map(({ icon, title, desc }, i) => (
                  <div key={title} className={`p-4 rounded chalk-anim ${vis ? "vis" : ""}`}
                    style={{ border: "1.5px solid rgba(245,240,228,0.18)", animationDelay: `${i * 0.12}s`, background: "rgba(245,240,228,0.03)" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{ color: "rgba(160,230,140,0.85)" }}>{icon}</div>
                      <div className="chalk-green text-lg font-bold">{title}</div>
                    </div>
                    <div className="chalk text-sm opacity-70 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>

              {/* Chalk underline emphasis */}
              <div className="mt-8 text-center">
                <div className="chalk text-xl opacity-80" style={{ transform: "rotate(-0.5deg)" }}>
                  ∴ Your child&apos;s success is our <span className="chalk-yellow">only equation.</span>
                </div>
                <button onClick={() => setPage("contact")} className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(245,240,228,0.1)", border: "2px solid rgba(245,240,228,0.35)", color: "rgba(245,240,228,0.9)", fontFamily: "var(--font-body)" }}>
                  Schedule a Free Demo Class <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Board>
        </div>
      </section>
    </DusterSection>
  );
}

function TeachersPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  const { ref, vis } = useReveal();
  return (
    <DusterSection>
      <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0D1A07 0%, #0F1E08 100%)" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Meet the Faculty</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">The minds behind the board.</div>
          </div>
          <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEACHERS.map(({ id, name, subject, pin, bio }, i) => (
              <div key={id} className={`chalk-anim ${vis ? "vis" : ""}`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="relative p-1" style={{ transform: `rotate(${[-1.5, 1, -0.5, 2][i]}deg)` }}>
                  {/* Pin */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full z-10 flex items-center justify-center shadow-lg"
                    style={{ background: pin, boxShadow: `0 3px 10px ${pin}60` }}>
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                  </div>
                  {/* Card */}
                  <div className="rounded shadow-2xl overflow-hidden teacher-card-hover" style={{ background: "rgba(245,240,228,0.06)", border: "1px solid rgba(245,240,228,0.15)" }}>
                    {/* Photo placeholder */}
                    <div className="aspect-[3/4] flex flex-col items-center justify-end pb-4 px-4 relative overflow-hidden"
                      style={{ background: "linear-gradient(180deg, rgba(30,56,20,0.4) 0%, rgba(20,40,12,0.6) 100%)", borderBottom: "1px solid rgba(245,240,228,0.1)" }}>
                      {/* Silhouette */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2">
                        <div className="w-16 h-16 rounded-full mx-auto mb-1" style={{ background: "rgba(245,240,228,0.12)", border: "2px dashed rgba(245,240,228,0.25)" }}>
                          <div className="w-full h-full flex items-center justify-center">
                            <GraduationCap size={28} style={{ color: "rgba(245,240,228,0.4)" }} />
                          </div>
                        </div>
                        {/* Standing body placeholder */}
                        <div className="w-24 h-28 mx-auto mt-1 rounded-t-full" style={{ background: "rgba(245,240,228,0.08)", border: "2px dashed rgba(245,240,228,0.18)" }} />
                      </div>
                      <div className="chalk text-xs opacity-40 text-center absolute bottom-2 w-full">Photo coming soon</div>
                    </div>
                    <div className="p-4">
                      <div className="chalk text-base font-bold">{name}</div>
                      <div className="chalk text-sm mt-0.5" style={{ color: pin, filter: "brightness(1.3)" }}>{subject}</div>
                      <div className="chalk text-xs opacity-60 mt-2 leading-snug">{bio}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setPage("about")} className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
              style={{ background: "rgba(245,240,228,0.08)", border: "2px solid rgba(245,240,228,0.28)", color: "rgba(245,240,228,0.85)", fontFamily: "var(--font-body)" }}>
              Full Faculty Profiles <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </DusterSection>
  );
}

function GalleryPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  const { ref, vis } = useReveal();
  return (
    <DusterSection>
      <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0F1E08 0%, #0D1A07 100%)" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Classroom Memories</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">Every photo is a story of a lesson learned.</div>
          </div>
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMGS.slice(0, 6).map(({ id, caption, rotate }, i) => (
              <div key={id + i} className={`chalk-anim ${vis ? "vis" : ""}`} style={{ animationDelay: `${i * 0.1}s`, transform: `rotate(${rotate}deg)` }}>
                <div className="bg-white p-2 pb-6 shadow-xl" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
                  <div className="overflow-hidden" style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3" }}>
                    <img src={`https://images.unsplash.com/${id}?w=400&h=300&fit=crop&auto=format`} alt={caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-600" style={{ fontFamily: "var(--font-heading)" }}>{caption}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setPage("gallery")} className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
              style={{ background: "rgba(245,240,228,0.08)", border: "2px solid rgba(245,240,228,0.28)", color: "rgba(245,240,228,0.85)", fontFamily: "var(--font-body)" }}>
              View Full Gallery <Camera size={16} />
            </button>
          </div>
        </div>
      </section>
    </DusterSection>
  );
}

function BlogPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  const { ref, vis } = useReveal();
  return (
    <DusterSection>
      <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0D1A07 0%, #0F1E08 100%)" }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Class Notes &amp; Blog</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">The lesson continues beyond the board.</div>
          </div>
          <div ref={ref} className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map(({ id, subject, subjectColor, title, excerpt, date, readTime, page: pg }, i) => (
              <div key={id} className={`chalk-anim ${vis ? "vis" : ""}`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="h-full rounded-sm overflow-hidden shadow-xl" style={{ background: "#FBF8F0", transform: `rotate(${[-0.5, 0.5, -0.3][i]}deg)` }}>
                  {/* Notebook header with lines */}
                  <div className="h-2" style={{ background: subjectColor }} />
                  <div className="lined-paper p-5 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: subjectColor + "20", color: subjectColor, fontFamily: "var(--font-body)" }}>{subject}</span>
                      <span className="text-xs text-gray-400" style={{ fontFamily: "var(--font-heading)" }}>pg. {pg}</span>
                    </div>
                    <h3 className="text-base font-bold leading-snug text-gray-800 mb-2" style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>{excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-3 mt-auto" style={{ fontFamily: "var(--font-body)" }}>
                      <span>{date}</span>
                      <span>{readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setPage("blog")} className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
              style={{ background: "rgba(245,240,228,0.08)", border: "2px solid rgba(245,240,228,0.28)", color: "rgba(245,240,228,0.85)", fontFamily: "var(--font-body)" }}>
              Read All Notes <BookOpen size={16} />
            </button>
          </div>
        </div>
      </section>
    </DusterSection>
  );
}

function CTASection({ setPage }: { setPage: (p: Page) => void }) {
  const { ref, vis } = useReveal();
  return (
    <DusterSection>
      <section className="py-16 px-4 sm:px-6 page-bg" style={{ background: "linear-gradient(180deg, #0F1E08 0%, #0A1506 100%)" }}>
        <div className="max-w-[1120px] mx-auto" ref={ref}>
          <Board>
            <div className="px-8 py-12 md:px-16 md:py-16 text-center">
              <div className={`chalk-anim ${vis ? "vis" : ""} space-y-4`}>
                <div className="chalk text-2xl opacity-65" style={{ transform: "rotate(-0.5deg)" }}>— Final Note —</div>
                <div className="chalk text-4xl md:text-6xl font-bold leading-tight">
                  Ready to Begin<br /><span className="chalk-yellow">Your Journey?</span>
                </div>
                <ChalkRule />
                <div className="chalk text-lg opacity-75 max-w-lg mx-auto leading-relaxed">
                  Join the students who have scored distinctions in CBSE with our guidance. The board is ready. The chalk is in hand.
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <button onClick={() => setPage("contact")} className="inline-flex items-center gap-2 px-8 py-4 rounded font-bold text-lg transition-all hover:scale-105"
                    style={{ background: "rgba(90,144,64,0.35)", border: "2px solid rgba(160,230,140,0.6)", color: "rgba(160,230,140,0.95)", fontFamily: "var(--font-body)" }}>
                    Enquire Now <Send size={18} />
                  </button>
                  <button onClick={() => setPage("about")} className="inline-flex items-center gap-2 px-8 py-4 rounded font-bold text-lg transition-all hover:scale-105"
                    style={{ background: "rgba(245,240,228,0.08)", border: "2px solid rgba(245,240,228,0.35)", color: "rgba(245,240,228,0.9)", fontFamily: "var(--font-body)" }}>
                    Meet Our Faculty <GraduationCap size={18} />
                  </button>
                </div>
                {/* Contact quick links */}
                <div className="flex flex-wrap justify-center gap-6 mt-6 opacity-80" style={{ fontFamily: "var(--font-body)" }}>
                  <a href={`tel:${BRAND.phone1Href}`} className="flex items-center gap-1.5 text-sm hover:opacity-100 transition-opacity"><Phone size={14} /> {BRAND.phone1}</a>
                  <a href={`tel:${BRAND.phone2Href}`} className="flex items-center gap-1.5 text-sm hover:opacity-100 transition-opacity"><Phone size={14} /> {BRAND.phone2}</a>
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-1.5 text-sm hover:opacity-100 transition-opacity"><Mail size={14} /> {BRAND.email}</a>
                  <div className="flex items-center gap-1.5 text-sm"><MapPin size={14} /> {BRAND.cityLine}</div>
                </div>
              </div>
            </div>
          </Board>
        </div>
      </section>
    </DusterSection>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div>
      <HeroSection setPage={setPage} />
      <SubjectsSection />
      <WhyUsSection setPage={setPage} />
      <TeachersPreviewSection setPage={setPage} />
      <GalleryPreviewSection setPage={setPage} />
      <BlogPreviewSection setPage={setPage} />
      <CTASection setPage={setPage} />
    </div>
  );
}

/* =========================================================
   ABOUT PAGE
   ========================================================= */
function AboutPage({ setPage }: { setPage: (p: Page) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { ref, vis } = useReveal();

  return (
    <div className="min-h-screen pt-20 page-bg" style={{ background: "linear-gradient(170deg, #0A1506 0%, #0D1A07 100%)" }}>
      {/* Cork board section */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Our Faculty</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">Pinned to the notice board — for you to know them.</div>
          </div>

          {/* Cork board */}
          <div className="cork-bg rounded-lg p-8 md:p-12 shadow-2xl" style={{ boxShadow: "0 12px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)", border: "8px solid #8B5220" }}>
            {/* Cork border detail */}
            <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEACHERS.map(({ id, name, subject, pin, rotation, bio, classes }, i) => (
                <div key={id} className={`chalk-anim ${vis ? "vis" : ""} cursor-pointer`} style={{ animationDelay: `${i * 0.18}s` }}
                  onClick={() => setSelected(selected === id ? null : id)}>
                  <div className="relative pt-4 teacher-card-hover" style={{ transform: `rotate(${rotation}deg)` }}>
                    {/* Push pin */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10" style={{ width: 18, height: 18, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${pin}EE, ${pin}88)`, boxShadow: `0 3px 8px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.3)` }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.45)", margin: "3px auto" }} />
                    </div>
                    {/* Paper card */}
                    <div className="bg-[#FFF8F0] shadow-xl overflow-hidden" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.35)", transform: selected === id ? "scale(1.06)" : "scale(1)", transition: "transform 0.3s" }}>
                      {/* Photo area */}
                      <div className="aspect-square flex flex-col items-center justify-center relative" style={{ background: "linear-gradient(180deg, #E8E0D0, #D8D0C0)" }}>
                        {/* Placeholder silhouette */}
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1" style={{ background: "rgba(100,80,60,0.2)", border: "2px dashed rgba(100,80,60,0.3)" }}>
                          <GraduationCap size={24} style={{ color: "rgba(100,80,60,0.5)" }} />
                        </div>
                        <div className="w-20 h-20 rounded-t-full" style={{ background: "rgba(100,80,60,0.15)", border: "2px dashed rgba(100,80,60,0.2)" }} />
                        <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400" style={{ fontFamily: "var(--font-heading)" }}>Photo Placeholder</div>
                        {/* Subject color strip */}
                        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: pin }} />
                      </div>
                      {/* Info */}
                      <div className="p-3 border-t border-gray-200">
                        <div className="text-sm font-bold text-gray-800" style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>{name}</div>
                        <div className="text-xs font-semibold mt-0.5" style={{ color: pin, fontFamily: "var(--font-body)" }}>{subject}</div>
                        <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>Classes {classes}</div>
                        {selected === id && (
                          <div className="mt-2 text-xs text-gray-600 leading-snug border-t border-gray-200 pt-2" style={{ fontFamily: "var(--font-body)" }}>{bio}</div>
                        )}
                        <div className="mt-1.5 text-xs text-gray-400 flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
                          {selected === id ? "↑ tap to close" : "→ tap to know more"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* School story on the board */}
      <DusterSection>
        <section className="py-14 px-4 sm:px-6">
          <div className="max-w-[1280px] mx-auto">
            <Board>
              <div className="px-8 py-12 md:px-14 md:py-14">
                <div className="chalk text-4xl md:text-5xl font-bold mb-4">Our Story</div>
                <ChalkRule />
                <div className="grid md:grid-cols-2 gap-10 mt-8">
                  <div className="space-y-4">
                    <div className="chalk text-xl font-bold chalk-yellow">How It All Started</div>
                    <div className="chalk text-base opacity-80 leading-relaxed">
                      {BRAND.name} was founded with one belief: that every student who struggles with Mathematics or Science is simply waiting for the right teacher. Our founders — passionate educators themselves — set up a small tuition room in {BRAND.location} and began with a handful of students.
                    </div>
                    <div className="chalk text-base opacity-80 leading-relaxed">
                      Since then, we've grown into a full CBSE coaching center for Classes IX through XII in Mathematics, Physics &amp; Chemistry — with home tuition and online classes for families who can't make it in. The board on our wall has never stopped being written upon.
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="chalk text-xl font-bold chalk-blue">Our Philosophy</div>
                    <div className="space-y-3">
                      {["Concepts before formulas — understand WHY before HOW", "No student is left behind — we teach at the student's pace", "Examination strategy is as important as knowledge", "A curious student is a successful student"].map((pt) => (
                        <div key={pt} className="chalk text-sm opacity-80 flex items-start gap-2">
                          <span className="chalk-green mt-0.5">∴</span> {pt}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 rounded" style={{ border: "1.5px dashed rgba(245,240,228,0.3)" }}>
                      <div className="chalk text-lg font-bold italic opacity-90" style={{ transform: "rotate(-0.5deg)" }}>
                        &quot;The best teachers don&apos;t give you answers — they give you the tools to find them.&quot;
                      </div>
                    </div>
                  </div>
                </div>
                {/* Stats row */}
                <div className="mt-10 pt-6" style={{ borderTop: "1.5px solid rgba(245,240,228,0.2)" }}>
                  <div className="flex flex-wrap justify-around gap-6">
                    {[["9th–12th", "Levels Taught"], ["CBSE", "Board"], ["2", "Class Modes"], ["4", "Expert Faculty"]].map(([n, l]) => (
                      <div key={l} className="text-center">
                        <div className="chalk text-3xl font-bold chalk-yellow">{n}</div>
                        <div className="chalk text-sm opacity-60">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Board>
          </div>
        </section>
      </DusterSection>

      <div className="text-center py-8">
        <button onClick={() => setPage("contact")} className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold"
          style={{ background: "rgba(245,240,228,0.08)", border: "2px solid rgba(245,240,228,0.3)", color: "rgba(245,240,228,0.85)", fontFamily: "var(--font-body)" }}>
          Get in Touch <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   GALLERY PAGE
   ========================================================= */
function GalleryPage() {
  const { ref, vis } = useReveal();
  const extended = [...GALLERY_IMGS, ...GALLERY_IMGS.slice(0, 3)];

  return (
    <div className="min-h-screen pt-20 page-bg" style={{ background: "linear-gradient(170deg, #0A1506 0%, #0D1A07 100%)" }}>
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Memory Wall</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">Moments from the classroom — pinned and cherished.</div>
          </div>

          {/* Corkboard-style gallery */}
          <div className="cork-bg rounded-lg p-8 md:p-12 shadow-2xl" style={{ border: "8px solid #8B5220" }}>
            <div ref={ref} className="columns-2 md:columns-3 gap-5 space-y-5">
              {extended.map(({ id, caption, rotate }, i) => (
                <div key={`${id}-${i}`} className={`break-inside-avoid chalk-anim ${vis ? "vis" : ""}`}
                  style={{ animationDelay: `${i * 0.08}s`, transform: `rotate(${rotate + (i % 2 === 0 ? 0.3 : -0.3)}deg)`, display: "inline-block", width: "100%", marginBottom: "1.25rem" }}>
                  <div className="bg-white p-2 pb-7 shadow-xl group cursor-pointer hover:scale-105 transition-transform" style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.45)" }}>
                    {/* Tape strips */}
                    {i % 3 === 0 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 opacity-50 rotate-1" style={{ background: "rgba(220,210,170,0.7)", borderRadius: 2 }} />}
                    <div className="overflow-hidden" style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3" }}>
                      <img
                        src={`https://images.unsplash.com/${id}?w=500&h=400&fit=crop&auto=format`}
                        alt={caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-center mt-2 text-gray-600 text-sm" style={{ fontFamily: "var(--font-heading)" }}>{caption}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="chalk text-center text-sm opacity-50 mt-6">
            Photos are illustrative placeholders — actual classroom and event photographs to be added.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   BLOG PAGE
   ========================================================= */
function BlogPage() {
  const { ref, vis } = useReveal();
  const allPosts = [
    ...BLOG_POSTS,
    { id: 4, subject: "Mathematics", subjectColor: "#6AAE45", title: "Trigonometry Simplified: The Unit Circle Approach", excerpt: "How visualising sine and cosine on a circle removes the need to memorise 45+ formulas.", date: "28 Jul 2025", readTime: "7 min read", page: 61 },
    { id: 5, subject: "Physics", subjectColor: "#4A90D9", title: "Understanding Electric Circuits: Kirchhoff's Laws Made Simple", excerpt: "KVL and KCL explained with real circuit diagrams and board exam numericals.", date: "22 Jul 2025", readTime: "9 min read", page: 74 },
    { id: 6, subject: "Chemistry", subjectColor: "#48A86A", title: "Periodic Table Patterns You Can Actually Remember", excerpt: "Trends in atomic radius, ionization energy, and electronegativity with mnemonics.", date: "16 Jul 2025", readTime: "5 min read", page: 29 },
  ];

  return (
    <div className="min-h-screen pt-20 page-bg" style={{ background: "linear-gradient(170deg, #0A1506 0%, #0D1A07 100%)" }}>
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Class Notes &amp; Blog</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">Teacher&apos;s notes — made open for every student.</div>
          </div>

          {/* Notebook header */}
          <div className="rounded-t-lg px-6 py-3 flex items-center gap-3" style={{ background: "#2C5016", borderBottom: "3px solid #1A3010" }}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="chalk text-sm opacity-70 ml-2">{BRAND.name} — Teacher&apos;s Notes 2025</span>
          </div>

          <div ref={ref} className="rounded-b-lg overflow-hidden shadow-2xl" style={{ background: "#FBF8F0" }}>
            {allPosts.map(({ id, subject, subjectColor, title, excerpt, date, readTime, page: pg }, i) => (
              <div key={id} className={`chalk-anim ${vis ? "vis" : ""} border-b border-gray-200 last:border-0`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`lined-paper px-6 md:px-10 py-6 flex gap-5 group cursor-pointer hover:bg-[#F5F1E8] transition-colors`}>
                  {/* Page number */}
                  <div className="text-2xl font-bold text-gray-200 shrink-0 w-8 text-right" style={{ fontFamily: "JetBrains Mono, monospace" }}>{pg}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: subjectColor + "18", color: subjectColor, fontFamily: "var(--font-body)" }}>{subject}</span>
                      <span className="text-xs text-gray-400" style={{ fontFamily: "var(--font-body)" }}>{date} · {readTime}</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 leading-snug mb-2 group-hover:text-gray-900" style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem" }}>{title}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{excerpt}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-semibold" style={{ color: subjectColor, fontFamily: "var(--font-body)" }}>
                      Read full note <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   CONTACT PAGE
   ========================================================= */
function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", grade: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { ref, vis } = useReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/fy6355128@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New enquiry from ${form.name || "a website visitor"} — ${BRAND.name}`,
          _template: "table",
          Name: form.name,
          Phone: form.phone,
          Email: form.email || "Not provided",
          "Class": form.grade || "Not specified",
          "Subject(s) Needed": form.subject || "Not specified",
          Message: form.message || "—",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pt-20 page-bg" style={{ background: "linear-gradient(170deg, #0A1506 0%, #0D1A07 100%)" }}>
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <div className="chalk text-4xl md:text-5xl font-bold">Teacher&apos;s Desk</div>
            <ChalkRule />
            <div className="chalk text-lg opacity-65 mt-2">Leave a note. We&apos;ll write back promptly.</div>
          </div>

          {/* Desk surface */}
          <div className="desk-bg rounded-lg p-8 md:p-12 shadow-2xl" style={{ border: "6px solid #5A3818", boxShadow: "0 12px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            {/* Desk items (decorative top bar) */}
            <div className="flex items-end gap-4 mb-8 pb-4" style={{ borderBottom: "2px solid rgba(245,240,228,0.1)" }}>
              {/* Pen holder */}
              <div className="w-8 h-12 rounded-b-full" style={{ background: "rgba(245,240,228,0.15)", border: "1px solid rgba(245,240,228,0.2)" }}>
                <div className="flex flex-col items-center gap-0.5 pt-1">
                  {[...Array(3)].map((_, i) => <div key={i} style={{ width: 3, height: 8, background: "rgba(245,240,228,0.5)", borderRadius: 1 }} />)}
                </div>
              </div>
              {/* Ruler */}
              <div className="h-3 flex-1 max-w-24 rounded" style={{ background: "rgba(220,180,100,0.3)", border: "1px solid rgba(220,180,100,0.4)" }}>
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="inline-block" style={{ width: "12.5%", height: "60%", borderRight: "1px solid rgba(220,180,100,0.5)" }} />)}
              </div>
              <div className="chalk text-sm opacity-40 flex-1 text-right">Drop an enquiry below ↓</div>
            </div>

            <div ref={ref} className="grid md:grid-cols-5 gap-8">
              {/* Contact info card */}
              <div className={`md:col-span-2 chalk-anim ${vis ? "vis" : ""}`}>
                <div className="bg-[#FBF8F0] rounded p-6 shadow-xl h-full" style={{ border: "1px solid rgba(100,70,30,0.2)" }}>
                  <div className="text-gray-800 font-bold text-xl mb-1" style={{ fontFamily: "var(--font-body)" }}>{BRAND.name}</div>
                  <div className="w-12 h-0.5 mb-4" style={{ background: "#2C5016" }} />
                  <div className="space-y-4">
                    {[
                      { icon: <MapPin size={16} />, label: "Address", val: BRAND.addressLine },
                      { icon: <Phone size={16} />, label: "Phone", val: BRAND.phone1, href: `tel:${BRAND.phone1Href}`, val2: BRAND.phone2, href2: `tel:${BRAND.phone2Href}` },
                      { icon: <Mail size={16} />, label: "Email", val: BRAND.email, href: `mailto:${BRAND.email}` },
                      { icon: <Clock size={16} />, label: "Hours", val: "Mon–Sat: 7 AM – 8 PM" /* TODO: confirm real hours */ },
                    ].map(({ icon, label, val, href, val2, href2 }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div style={{ color: "#2C5016", marginTop: 2 }}>{icon}</div>
                        <div>
                          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>{label}</div>
                          {href ? (
                            <div className="text-sm text-gray-700 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                              <a href={href} className="hover:text-[#2C5016] transition-colors">{val}</a>
                              {val2 && href2 && <> / <a href={href2} className="hover:text-[#2C5016] transition-colors">{val2}</a></>}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-700 leading-snug" style={{ fontFamily: "var(--font-body)" }}>{val}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Subjects taught */}
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-body)" }}>Subjects Offered</div>
                    {["Mathematics", "Physics", "Chemistry"].map((s, i) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-gray-700 mb-1" style={{ fontFamily: "var(--font-body)" }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: ["#6AAE45", "#4A90D9", "#48A86A"][i] }} /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enquiry form on paper */}
              <div className={`md:col-span-3 chalk-anim ${vis ? "vis" : ""}`} style={{ animationDelay: "0.2s" }}>
                {status === "sent" ? (
                  <div className="bg-[#FBF8F0] rounded p-8 shadow-xl flex flex-col items-center justify-center gap-4 h-full" style={{ border: "1px solid rgba(100,70,30,0.2)", minHeight: 320 }}>
                    <CheckCircle size={48} style={{ color: "#2C5016" }} />
                    <div className="text-xl font-bold text-gray-800" style={{ fontFamily: "var(--font-heading)" }}>Enquiry Received!</div>
                    <div className="text-sm text-gray-600 text-center" style={{ fontFamily: "var(--font-body)" }}>
                      Thank you for your interest. Our team will reach out within 24 hours to schedule a free demo class.
                    </div>
                    <button onClick={() => { setStatus("idle"); setForm({ name: "", phone: "", email: "", grade: "", subject: "", message: "" }); }} className="mt-2 text-sm underline" style={{ color: "#2C5016", fontFamily: "var(--font-body)" }}>Submit another enquiry</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-[#FBF8F0] rounded p-6 shadow-xl lined-paper" style={{ border: "1px solid rgba(100,70,30,0.2)" }}>
                    <div className="text-gray-800 font-bold text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>Student Enquiry Form</div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: "name", placeholder: "Student Name", type: "text", span: 2 },
                        { name: "phone", placeholder: "Phone Number", type: "tel", span: 1 },
                        { name: "email", placeholder: "Email Address", type: "email", span: 1 },
                      ].map(({ name, placeholder, type, span }) => (
                        <input key={name} type={type} placeholder={placeholder} value={(form as any)[name]}
                          onChange={e => setForm({ ...form, [name]: e.target.value })}
                          required={name !== "email"}
                          className="px-3 py-2.5 rounded text-sm text-gray-800 border focus:outline-none transition-all"
                          style={{ borderColor: "rgba(44,80,22,0.25)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.7)", gridColumn: `span ${span}` }} />
                      ))}
                      <select value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} required
                        className="col-span-1 px-3 py-2.5 rounded text-sm text-gray-700 border focus:outline-none"
                        style={{ borderColor: "rgba(44,80,22,0.25)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.7)" }}>
                        <option value="">Select Class</option>
                        {["IX", "X", "XI", "XII"].map(g => <option key={g} value={g}>{`Class ${g}`}</option>)}
                      </select>
                      <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="col-span-1 px-3 py-2.5 rounded text-sm text-gray-700 border focus:outline-none"
                        style={{ borderColor: "rgba(44,80,22,0.25)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.7)" }}>
                        <option value="">Subject(s) Needed</option>
                        {["Mathematics", "Science (Physics, Chemistry & Biology)", "Physics", "Chemistry", "All Three"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any specific requirements or questions..." rows={3}
                        className="col-span-2 px-3 py-2.5 rounded text-sm text-gray-800 border focus:outline-none resize-none"
                        style={{ borderColor: "rgba(44,80,22,0.25)", fontFamily: "var(--font-body)", background: "rgba(255,255,255,0.7)", gridColumn: "span 2" }} />
                    </div>
                    {status === "error" && (
                      <div className="mt-3 px-3 py-2 rounded text-sm" style={{ background: "rgba(212,24,61,0.08)", color: "#B0102E", fontFamily: "var(--font-body)", border: "1px solid rgba(212,24,61,0.25)" }}>
                        Something went wrong sending your enquiry. Please try again, or call us directly at {BRAND.phone1}.
                      </div>
                    )}
                    <button type="submit" disabled={status === "sending"} className="mt-4 w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:hover:scale-100"
                      style={{ background: "#2C5016", color: "#F5F0E8", fontFamily: "var(--font-body)", boxShadow: "0 4px 16px rgba(44,80,22,0.4)" }}>
                      {status === "sending" ? "Sending…" : <>Send Enquiry <Send size={16} /></>}
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center" style={{ fontFamily: "var(--font-body)" }}>
                      We typically respond within 24 hours during working days.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FOOTER
   ========================================================= */
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer style={{ background: "#080F04", borderTop: "1px solid rgba(245,240,228,0.08)" }}>
      <div className="max-w-[1440px] mx-auto px-5 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="chalk text-xl font-bold mb-1">{BRAND.name}</div>
          <div className="chalk text-sm opacity-50 mb-3">{BRAND.location}</div>
          <div className="text-xs opacity-50 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>CBSE coaching from Class 9 through Class 12 in Mathematics, Physics &amp; Chemistry. Home tuition and online classes available.</div>
        </div>
        {[
          { heading: "Pages", items: NAV_ITEMS.map(({ label, page: p }) => ({ label, page: p, href: undefined as string | undefined })) },
          { heading: "Subjects", items: [{ label: "Mathematics", page: "about" as Page, href: undefined as string | undefined }, { label: "Physics", page: "about" as Page, href: undefined }, { label: "Chemistry", page: "about" as Page, href: undefined }] },
          { heading: "Contact", items: [{ label: BRAND.phone1, page: "contact" as Page, href: `tel:${BRAND.phone1Href}` }, { label: BRAND.phone2, page: "contact" as Page, href: `tel:${BRAND.phone2Href}` }, { label: BRAND.email, page: "contact" as Page, href: `mailto:${BRAND.email}` }] },
        ].map(({ heading, items }) => (
          <div key={heading}>
            <div className="chalk text-sm font-bold opacity-60 uppercase tracking-widest mb-3">{heading}</div>
            <ul className="space-y-1.5">
              {items.map(({ label, page: p, href }) => (
                <li key={label}>
                  {href ? (
                    <a href={href} className="text-sm opacity-60 hover:opacity-90 transition-opacity text-left" style={{ fontFamily: "var(--font-body)" }}>{label}</a>
                  ) : (
                    <button onClick={() => setPage(p)} className="chalk text-sm opacity-60 hover:opacity-90 transition-opacity text-left">{label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center py-4" style={{ borderTop: "1px solid rgba(245,240,228,0.05)" }}>
        <div className="text-xs opacity-35" style={{ fontFamily: "var(--font-body)" }}>© 2025 {BRAND.name} · All rights reserved · CBSE Coaching, {BRAND.location}</div>
      </div>
    </footer>
  );
}

/* =========================================================
   LIGHT MODE WRAPPER (adjusts overall tones)
   ========================================================= */
function LightModeStyles() {
  return (
    <style>{`
      /* Light mode keeps the chalkboard-green identity but lifts every page
         and section background to a brighter, daytime shade of the same
         green — consistent across every page. Boards, the footer, and paper
         cards intentionally stay dark/light as designed, since a chalkboard
         and a sheet of paper don't change color with the room lights. */
      :root:not(.dark) .page-bg {
        background: linear-gradient(170deg, #3C7024 0%, #468226 50%, #3C7024 100%) !important;
      }
    `}</style>
  );
}

/* =========================================================
   MAIN APP
   ========================================================= */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleSetPage = (p: Page) => setPage(p);

  const pages: Record<Page, React.ReactNode> = {
    home: <HomePage setPage={handleSetPage} />,
    about: <AboutPage setPage={handleSetPage} />,
    gallery: <GalleryPage />,
    blog: <BlogPage />,
    contact: <ContactPage />,
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {!dark && <LightModeStyles />}
      <div className="min-h-screen overflow-x-hidden" style={{ background: dark ? "#0A1506" : "#F5F0E8", color: dark ? "#E8DFC8" : "#1A2510" }}>
        <Navbar page={page} setPage={handleSetPage} dark={dark} setDark={setDark} />
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {pages[page]}
          </motion.div>
        </AnimatePresence>
        <Footer setPage={handleSetPage} />
      </div>
    </>
  );
}
