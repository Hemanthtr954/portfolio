import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { cases } from "../config";
import { prefersReducedMotion } from "../hooks";
import Flashlight from "./Flashlight";

gsap.registerPlugin(ScrollTrigger);

export default function Cases() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>(".case").forEach((el) => {
      gsap.from(el.querySelectorAll(".case__title .ln > span"), { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 75%" } });
      gsap.from(el.querySelector(".case__visual"), { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 70%" } });
      gsap.from(el.querySelectorAll(".case__proof li"), { opacity: 0, y: 24, stagger: 0.12, duration: 0.8, scrollTrigger: { trigger: el.querySelector(".case__proof"), start: "top 85%" } });
      gsap.to(el.querySelector(".case__num"), { yPercent: -25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.from(".work__head", { opacity: 0, y: 30, duration: 1, scrollTrigger: { trigger: ".work__head", start: "top 85%" } });
  }, { scope: root });

  return (
    <section className="work" id="work" ref={root} aria-labelledby="work-h">
      <div className="wrap work__head">
        <p className="mono eyebrow">Selected work — three case files</p>
        <h2 id="work-h" className="display">Real systems, <i>told as stories.</i></h2>
        <p className="work__sub">Each file pairs what I owned at work with a public, runnable reference build you can read and run yourself.</p>
      </div>

      {cases.map((c, i) => (
        <article className={`case case--${i + 1} wrap`} key={c.n} aria-labelledby={`case-${c.n}`}>
          <div className="case__num" aria-hidden="true">{c.n}</div>
          <div className="case__head">
            <p className="mono eyebrow">{c.org} · {c.role} · {c.period}</p>
            <h3 id={`case-${c.n}`} className="case__title">
              {c.title.split(" & ").map((t, k, a) => <span className="ln" key={k}><span>{t}{k < a.length - 1 ? " &" : ""}</span></span>)}
            </h3>
            <p className="case__kicker">{c.kicker}</p>
          </div>

          <div className="case__visual">
            <Flashlight
              radius={180}
              label={`${c.org} case visual. Move your pointer to reveal detail.`}
              base={<div className="viz viz--dim"><VizBase i={i} /></div>}
              reveal={<div className="viz viz--lit"><VizLit i={i} /></div>}
            />
          </div>

          <div className="case__body">
            <p className="case__problem"><span className="mono">The problem</span>{c.problem}</p>
            <ul className="case__did">{c.did.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>

          <ul className="case__proof" aria-label="Outcomes reported on my resume">
            {c.proof.map((p) => <li key={p.k}><b>{p.k}</b><span>{p.v}</span></li>)}
          </ul>

          <ul className="case__stack" aria-label="Technologies">{c.stack.map((s) => <li key={s} className="mono">{s}</li>)}</ul>

          <div className="case__links">
            <motion.a href={c.repo} target="_blank" rel="noopener noreferrer" className="btn-line"
              whileHover={{ x: 6 }} whileTap={{ scale: 0.97 }}>
              {c.repoLabel} on GitHub <span aria-hidden="true">↗</span>
            </motion.a>
            <p className="mono case__note">{c.note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

/* Hand-built SVG "plates" for each case (no stock imagery). Dim = outline, Lit = annotated. */
function VizBase({ i }: { i: number }) {
  return <Plate i={i} lit={false} />;
}
function VizLit({ i }: { i: number }) {
  return <Plate i={i} lit />;
}

function Plate({ i, lit }: { i: number; lit: boolean }) {
  const stroke = lit ? "#f0b429" : "#6d6a62";
  const ink = lit ? "#efe9dc" : "#4b4943";
  if (i === 0) {
    const bars = [34, 52, 71, 46, 88, 63, 29, 77];
    return (
      <svg viewBox="0 0 600 360" role="img" aria-label="Risk factor contribution plate">
        <g fill="none" stroke={stroke} strokeWidth="1">
          <line x1="40" y1="180" x2="560" y2="180" />
          {bars.map((b, k) => <rect key={k} x={60 + k * 62} y={k % 2 ? 180 : 180 - b * 1.6} width="38" height={b * 1.6} fill={lit ? (k % 2 ? "#c1352b33" : "#f0b42933") : "none"} />)}
        </g>
        <text x="40" y="32" fill={ink} fontFamily="JetBrains Mono" fontSize="12">SHAP · feature-level reason indicators</text>
        <text x="40" y="340" fill={ink} fontFamily="JetBrains Mono" fontSize="12">utilization · repayment · account history · inquiries</text>
        {lit && <text x="330" y="70" fill="#f0b429" fontFamily="Instrument Serif" fontStyle="italic" fontSize="26">why this score?</text>}
      </svg>
    );
  }
  if (i === 1) {
    const dots = Array.from({ length: 70 }, (_, k) => ({ x: 60 + ((k * 73) % 480), y: 60 + ((k * 47) % 240), c: k % 3 }));
    const colors = ["#f0b429", "#c1352b", "#5b8def"];
    return (
      <svg viewBox="0 0 600 360" role="img" aria-label="Metadata classification scatter plate">
        {dots.map((d, k) => <circle key={k} cx={d.x} cy={d.y} r={lit ? 6 : 4} fill={lit ? colors[d.c] : "none"} stroke={lit ? "none" : stroke} />)}
        <text x="40" y="32" fill={ink} fontFamily="JetBrains Mono" fontSize="12">titles · synopses · genres · language</text>
        {lit && <text x="330" y="340" fill="#f0b429" fontFamily="Instrument Serif" fontStyle="italic" fontSize="26">confidence decides who reviews</text>}
      </svg>
    );
  }
  const steps = ["Intake", "Assign", "Approve", "Escalate", "Close"];
  return (
    <svg viewBox="0 0 600 360" role="img" aria-label="Workflow stages plate">
      <g fill="none" stroke={stroke}>
        <path d="M60 180 H540" />
        {steps.map((s, k) => (
          <g key={s}>
            <circle cx={60 + k * 120} cy="180" r="16" fill={lit ? "#f0b429" : "none"} />
            <text x={60 + k * 120} y={k % 2 ? 236 : 132} textAnchor="middle" fill={ink} fontFamily="JetBrains Mono" fontSize="12" stroke="none">{s}</text>
          </g>
        ))}
      </g>
      <text x="40" y="32" fill={ink} fontFamily="JetBrains Mono" fontSize="12">request lifecycle</text>
      {lit && <text x="330" y="330" fill="#f0b429" fontFamily="Instrument Serif" fontStyle="italic" fontSize="26">every step on the record</text>}
    </svg>
  );
}
