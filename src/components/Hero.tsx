import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../config";
import { prefersReducedMotion } from "../hooks";
import Flashlight from "./Flashlight";

const portraits = import.meta.glob("../assets/portrait.*", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const portraitUrl = Object.values(portraits)[0];

function Headline({ lit }: { lit?: boolean }) {
  return (
    <h1 className={`hero__h ${lit ? "is-lit" : ""}`}>
      <span className="ln"><span>Models</span></span>
      <span className="ln"><span>that <i>ship.</i></span></span>
      <span className="ln"><span>Systems that</span></span>
      <span className="ln"><span><i>explain</i> themselves.</span></span>
    </h1>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduce = prefersReducedMotion();
    if (reduce) { gsap.set(".hero [data-in]", { opacity: 1 }); return; }
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__grain", { opacity: 0, duration: 0.8 })
      .from(".hero .ln > span", { yPercent: 115, duration: 1.2, stagger: 0.09 }, 0.1)
      .from(".hero__mono", { opacity: 0, y: 12, duration: 0.8, stagger: 0.08 }, 0.6)
      .from(".hero__portrait", { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.out" }, 0.3)
      .from(".hero__rule", { scaleX: 0, transformOrigin: "left", duration: 1.2 }, 0.5);
    gsap.to(".hero__portrait img, .hero__mono-mark", {
      yPercent: -8, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
  }, { scope: root });

  const portrait = (
    <figure className={`hero__portrait ${portraitUrl ? "" : "hero__portrait--mono"}`} aria-label={`${profile.name} portrait`}>
      {portraitUrl ? <img src={portraitUrl} alt={`Portrait of ${profile.name}`} /> : (
        <div className="hero__mono-mark" role="img" aria-label="HT monogram"><span>H</span><span>T</span></div>
      )}
      <figcaption className="mono">Fig. 01 — {profile.first}, {profile.location}</figcaption>
    </figure>
  );

  return (
    <header className="hero" ref={root} id="top">
      <div className="hero__grain" aria-hidden="true" />
      <nav className="nav" aria-label="Primary">
        <a href="#top" className="nav__mark">HT<span>.</span></a>
        <ul>
          <li><a href="#work">Work</a></li>
          <li><a href="#craft">Craft</a></li>
          <li><a href="#path">Path</a></li>
          <li><a href="#hire" className="nav__cta">Hire me</a></li>
        </ul>
      </nav>

      <div className="hero__meta">
        <p className="mono hero__mono">Vol. 06 — The AI/ML engineer file</p>
        <p className="mono hero__mono">{profile.location} · 6+ years</p>
      </div>
      <div className="hero__rule" aria-hidden="true" />

      <Flashlight
        className="hero__fl"
        label="Interactive headline. Move your pointer to light it up."
        radius={260}
        base={<Headline />}
        reveal={
          <>
            <Headline lit />
            <span className="note note--a mono">recall <b>+~8%</b> on higher-risk cases</span>
            <span className="note note--b mono">retrieval <b>+~11%</b> relevant docs</span>
            <span className="note note--c mono">F1 <b>+~9%</b> over baseline</span>
            <span className="note note--d mono">150K+ records · 50K+ metadata records</span>
          </>
        }
      />
      {portrait}

      <div className="hero__foot">
        <p className="hero__lede hero__mono" data-in>{profile.summary}</p>
        <a className="hero__scroll mono" href="#work" aria-label="Scroll to selected work">Scroll ↓</a>
      </div>
      <p className="mono hero__hint hero__mono" aria-hidden="true">move your cursor / drag to switch on the light</p>
    </header>
  );
}
