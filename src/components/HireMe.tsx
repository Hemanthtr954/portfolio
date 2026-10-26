import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { profile } from "../config";
import { prefersReducedMotion } from "../hooks";

gsap.registerPlugin(ScrollTrigger);

/* Stage coordinate system: 1000 x 600. Button centre (640,250). Hand lower-left. */
const BTN = { x: 640, y: 250, w: 380 };
const ATTACH_X = BTN.x - BTN.w / 2 + 8;
// Fingertip anchors (hand) -> attach points (button left edge). Irregular on purpose.
const STRINGS = [
  { s: [298, 436], e: [ATTACH_X, 222], bow: 60, seed: 0.3 },
  { s: [320, 452], e: [ATTACH_X, 238], bow: -36, seed: 1.1 },
  { s: [345, 462], e: [ATTACH_X, 252], bow: 44, seed: 2.0 },
  { s: [362, 478], e: [ATTACH_X, 266], bow: -52, seed: 2.9 },
  { s: [217, 404], e: [ATTACH_X, 280], bow: 30, seed: 3.7 },
] as const;

const pathFor = (i: number, t: number, px: number, py: number) => {
  const { s, e, bow, seed } = STRINGS[i];
  const sway = Math.sin(t * 0.9 + seed) * 6 + px * 9;
  const lift = Math.cos(t * 0.7 + seed) * 4 + py * 7;
  const dx = e[0] - s[0], dy = e[1] - s[1];
  const c1x = s[0] + dx * 0.3, c1y = s[1] + dy * 0.3 + bow * 0.45 + sway + lift;
  const c2x = s[0] + dx * 0.72, c2y = s[1] + dy * 0.72 - bow * 0.35 + sway * 0.6;
  return `M${s[0]} ${s[1]} C${c1x} ${c1y} ${c2x} ${c2y} ${e[0]} ${e[1]}`;
};

export default function HireMe() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const handRef = useRef<SVGGElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // tilt (Framer Motion)
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [9, -9]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 180, damping: 18 });

  useGSAP(() => {
    const reduce = prefersReducedMotion();
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    paths.forEach((p, i) => p.setAttribute("d", pathFor(i, 0, 0, 0)));

    if (reduce) { gsap.set(".hm__btnwrap, .hm__hand, .hm__title", { opacity: 1 }); return; }

    // entrance + string drawing
    paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } });
    tl.from(".hm__title span", { yPercent: 110, stagger: 0.08, duration: 1, ease: "power4.out" })
      .from(".hm__hand", { x: -60, y: 50, opacity: 0, duration: 1.1, ease: "power3.out" }, 0.2)
      .to(paths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: "power2.inOut" }, 0.5)
      .from(".hm__btnwrap", { x: 80, opacity: 0, scale: 0.9, duration: 1, ease: "back.out(1.5)" }, 0.6)
      .add(() => paths.forEach((p) => gsap.set(p, { strokeDasharray: "none" })));

    // gentle hand pulls
    const pull = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    pull.to(handRef.current, { x: -5, y: 3, rotation: -1.2, svgOrigin: "300 450", duration: 1.6, ease: "sine.inOut" });

    let visible = false;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? pull.play() : pull.pause(); }, { threshold: 0.1 });
    if (stage.current) io.observe(stage.current);

    // string sway + pointer reaction, only while visible
    const tick = () => {
      if (!visible) return;
      const t = gsap.ticker.time;
      paths.forEach((p, i) => p.setAttribute("d", pathFor(i, t, pointer.current.x, pointer.current.y)));
    };
    gsap.ticker.add(tick);
    const move = (e: PointerEvent) => {
      const b = stage.current?.getBoundingClientRect(); if (!b) return;
      pointer.current.x = ((e.clientX - b.left) / b.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - b.top) / b.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { gsap.ticker.remove(tick); io.disconnect(); pull.kill(); window.removeEventListener("pointermove", move); };
  }, { scope: root });

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - b.left) / b.width - 0.5) * 2);
    my.set(((e.clientY - b.top) / b.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  const close = useCallback(() => { setOpen(false); btnRef.current?.focus(); }, []);

  return (
    <section className="hm" id="hire" ref={root} aria-labelledby="hire-h">
      <h2 id="hire-h" className="hm__title display"><span>Got a hard</span><span>problem? <i>Pull me in.</i></span></h2>

      <div className="hm__stage" ref={stage}>
        <svg className="hm__svg" viewBox="0 0 1000 600" aria-hidden="true" focusable="false">
          <defs>
            <filter id="hm-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          <ellipse cx="300" cy="560" rx="230" ry="16" fill="#000" opacity=".12" filter="url(#hm-soft)" />
          <g ref={handRef} className="hm__hand" fill="none" stroke="#111" strokeLinecap="round" strokeLinejoin="round">
            {/* hand-drawn forearm + palm + fingers reaching up-right, pinching the strings */}
            <path d="M92 600 C110 540 140 500 178 470 C200 452 232 448 262 446" strokeWidth="3" />
            <path d="M126 600 C140 560 170 528 210 508 C236 496 262 492 286 492" strokeWidth="2.2" />
            <path d="M262 446 C288 430 318 412 334 400 C340 396 346 400 342 407 C334 420 318 432 304 444" strokeWidth="2.6" />
            <path d="M286 492 C314 470 344 438 356 418 C362 410 370 414 366 422 C356 442 336 468 318 486" strokeWidth="2.6" />
            <path d="M318 486 C342 470 370 446 380 426 C384 420 392 424 390 430 C380 452 358 478 340 492" strokeWidth="2.4" />
            <path d="M340 492 C360 482 386 462 396 444 C400 438 408 442 406 448 C396 468 376 492 354 504" strokeWidth="2.2" />
            <path d="M262 446 C250 420 246 396 254 372 C258 360 270 362 270 372 C270 392 276 414 290 430" strokeWidth="2.4" />
            <path d="M200 520 C214 534 240 540 262 534" strokeWidth="1.4" opacity=".6" />
            <path d="M180 482 C196 476 214 476 228 482" strokeWidth="1.2" opacity=".5" />
            <path d="M232 470 L246 462 M240 478 L256 470" strokeWidth="1" opacity=".55" />
          </g>
          {STRINGS.map((_, i) => (
            <path key={i} ref={(el) => { pathRefs.current[i] = el; }} fill="none" stroke="#0d0d0d" strokeWidth={i % 2 ? 1 : 1.4} strokeLinecap="round" />
          ))}
        </svg>

        <div className="hm__btnwrap" style={{ left: `${(BTN.x / 1000) * 100}%`, top: `${(BTN.y / 600) * 100}%`, width: `${(BTN.w / 1000) * 100}%` }}>
        <motion.button
          ref={btnRef}
          className="hm__btn"
          style={{ rotateX: rx, rotateY: ry }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={() => setOpen(true)}
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-haspopup="dialog"
          aria-expanded={open}
          initial="rest"
        >
          <span className="hm__label">LET’S COLLABORATE</span>
          <motion.span className="hm__sweep" aria-hidden="true" variants={{ rest: { x: "-120%" } }} whileHover={{ x: "120%", transition: { duration: 0.9, ease: "easeInOut" } }} />
        </motion.button>
        </div>
        <p className="hm__touch mono">Tap the button to get in touch</p>
      </div>

      <AnimatePresence>{open && <ContactOverlay onClose={close} />}</AnimatePresence>
    </section>
  );
}

function ContactOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const f = Array.from(ref.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);

  const mail = `mailto:${profile.email}?subject=${encodeURIComponent("Let’s work together")}`;
  const project = `mailto:${profile.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent("Hi Hemanth,\n\nI’d like to talk about a project:\n\n")}`;
  return (
    <motion.div className="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div ref={ref} className="ov__card" role="dialog" aria-modal="true" aria-labelledby="ov-h"
        initial={{ y: 40, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 24, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}>
        <button ref={closeRef} className="ov__close" onClick={onClose} aria-label="Close contact panel">Close ✕</button>
        <p className="mono eyebrow">Let’s collaborate</p>
        <h2 id="ov-h">Tell me what you’re building.</h2>
        <ul className="ov__list">
          <li><span className="mono">Email</span><a href={mail}>{profile.email}</a></li>
          <li><span className="mono">LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin.replace("https://www.", "")}</a></li>
          <li><span className="mono">GitHub</span><a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github.replace("https://", "")}</a></li>
        </ul>
        <motion.a className="ov__cta" href={project} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>Start a Project →</motion.a>
      </motion.div>
    </motion.div>
  );
}
