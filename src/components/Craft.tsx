import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { education, profile, skills, cases } from "../config";
import { prefersReducedMotion } from "../hooks";

gsap.registerPlugin(ScrollTrigger);

export default function Craft() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
      gsap.from(el, { opacity: 0, y: 36, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
    gsap.from(".path__line", { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: ".path__list", start: "top 70%", end: "bottom 70%", scrub: true } });
  }, { scope: root });

  return (
    <div ref={root}>
      <section className="craft wrap" id="craft" aria-labelledby="craft-h">
        <div className="craft__intro reveal">
          <p className="mono eyebrow">The craft</p>
          <h2 id="craft-h" className="display">How I <i>work.</i></h2>
          <p className="craft__approach">{profile.approach}</p>
        </div>
        <div className="skills">
          {skills.map((s) => (
            <div className="skill reveal" key={s.group}>
              <h3>{s.group}</h3>
              <p className="mono skill__why">{s.why}</p>
              <p className="skill__items">{s.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="path wrap" id="path" aria-labelledby="path-h">
        <p className="mono eyebrow reveal">The path</p>
        <h2 id="path-h" className="display reveal">From Python backend to <i>production GenAI.</i></h2>
        <div className="path__list">
          <span className="path__line" aria-hidden="true" />
          {cases.map((c) => (
            <div className="path__item reveal" key={c.n}>
              <p className="mono">{c.period}</p>
              <h3>{c.role} <em>at {c.org}</em></h3>
              <p>{c.kicker}</p>
            </div>
          ))}
          {education.map((e) => (
            <div className="path__item path__item--edu reveal" key={e.what}>
              <p className="mono">{e.when}</p>
              <h3>{e.what}</h3>
              {e.detail && <p>{e.detail}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
