import { ReactNode, useEffect, useRef } from "react";
import { useLowMotion } from "../hooks";

type Props = {
  /** Always-visible (dim) layer */
  base: ReactNode;
  /** Layer uncovered by the beam */
  reveal: ReactNode;
  radius?: number;       // px, beam radius
  feather?: number;      // 0..1, how soft the edge is
  ambient?: number;      // 0..1, ambient glow strength
  className?: string;
  label?: string;
};

/**
 * Reusable torchlight. The pointer is tracked with rAF and written to CSS custom
 * properties on the container (no React re-renders). The reveal layer is masked by a
 * radial gradient, so real content is uncovered rather than a circle drawn on top.
 * Touch: drag or tap moves the beam (vertical scrolling stays enabled).
 * Low-power / reduced-motion: the reveal layer is shown statically, mask disabled.
 */
export default function Flashlight({ base, reveal, radius = 230, feather = 0.55, ambient = 0.35, className = "", label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const low = useLowMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || low) return;
    let raf = 0;
    let tx = el.clientWidth * 0.62, ty = el.clientHeight * 0.4; // target
    let cx = tx, cy = ty;                                         // eased current
    let r = radius;
    let active = false;
    const hard = Math.round((1 - feather) * 100);

    const set = () => {
      el.style.setProperty("--fx", `${cx}px`);
      el.style.setProperty("--fy", `${cy}px`);
      el.style.setProperty("--fr", `${r}px`);
      el.style.setProperty("--fh", `${hard}%`);
    };
    const loop = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      set();
      raf = active ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      tx = e.clientX - b.left; ty = e.clientY - b.top; kick();
    };
    const enter = (e: PointerEvent) => { active = true; el.dataset.lit = "1"; r = e.pointerType === "touch" ? radius * 0.8 : radius; move(e); };
    const leave = () => { el.dataset.lit = "0"; };
    const io = new IntersectionObserver(([en]) => { active = en.isIntersecting; if (active) kick(); }, { threshold: 0.01 });
    io.observe(el);
    el.dataset.ambient = String(ambient);
    el.style.setProperty("--fa", String(ambient));
    set();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", enter, { passive: true });
    el.addEventListener("pointerenter", enter, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", enter);
      el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave);
    };
  }, [low, radius, feather, ambient]);

  return (
    <div ref={ref} className={`fl ${low ? "fl--static" : ""} ${className}`} data-lit="0" aria-label={label}>
      <div className="fl__base">{base}</div>
      <div className="fl__glow" aria-hidden="true" />
      <div className="fl__reveal">{reveal}</div>
    </div>
  );
}
