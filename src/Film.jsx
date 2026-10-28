import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { CONFIG } from './config';
import { createLoader, loadManifest, nearest } from './frames';
import { useStore } from './store';

export default function Film() {
  const section = useRef(null);
  const canvas = useRef(null);
  const loader = useRef(null);
  const count = useRef(0);
  const target = useRef(0);
  const current = useRef(0);
  const shown = useRef(-1);
  const raf = useRef(0);
  const lastT = useRef(0);
  const [failed, setFailed] = useState(false);
  const reduced = useStore((s) => s.reduced);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  const draw = (force = false) => {
    const c = canvas.current;
    const L = loader.current;
    if (!c || !L || !c.width) return;
    const idx = nearest(L.frames, Math.round(current.current));
    if (idx < 0) return;
    if (!force && idx === shown.current) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const img = L.frames[idx];
    const cw = c.width, ch = c.height;
    const pick = CONFIG.fit === 'cover' ? Math.max : Math.min;
    const s = pick(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.globalAlpha = 1;
    ctx.fillStyle = CONFIG.bg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    shown.current = idx;
  };

  const tick = (t) => {
    const dt = lastT.current ? Math.min(0.1, (t - lastT.current) / 1000) : 0.016;
    lastT.current = t;
    const diff = target.current - current.current;
    if (Math.abs(diff) < 0.02) {
      current.current = target.current;
      draw();
      raf.current = 0;
      lastT.current = 0;
      return;
    }
    current.current += diff * (1 - Math.exp(-dt * CONFIG.smoothing));
    draw();
    raf.current = requestAnimationFrame(tick);
  };

  const kick = () => {
    if (!raf.current && !document.hidden) { lastT.current = 0; raf.current = requestAnimationFrame(tick); }
  };

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced || !count.current) return;
    target.current = Math.max(0, Math.min(1, v)) * (count.current - 1);
    kick();
  });

  useEffect(() => {
    let dead = false;
    loadManifest().then((m) => {
      if (dead) return;
      count.current = m.count;
      const start = reduced ? 0 : Math.round(Math.max(0, Math.min(1, scrollYProgress.get())) * (m.count - 1));
      current.current = start; target.current = start;
      const L = createLoader(m.count, {
        onFrame: (i, loaded, ok) => {
          if (dead) return;
          if (i === 0 && !ok) { setFailed(true); return; }
          if (ok && Math.abs(i - current.current) < 1.5) { shown.current = -1; draw(true); }
        },
      });
      loader.current = L;
      L.start(CONFIG.concurrency).then(() => { if (!dead) { shown.current = -1; draw(true); } });
    }).catch((e) => { console.error('[film]', e.message); if (!dead) setFailed(true); });
    return () => { dead = true; if (loader.current) loader.current.abort(); cancelAnimationFrame(raf.current); raf.current = 0; };
    // eslint-disable-next-line
  }, [reduced]);

  useEffect(() => {
    const el = canvas.current?.parentElement;
    if (!el || !canvas.current) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const r = el.getBoundingClientRect();
      canvas.current.width = Math.max(1, Math.round(r.width * dpr));
      canvas.current.height = Math.max(1, Math.round(r.height * dpr));
      shown.current = -1;
      draw(true);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    const vis = () => { if (document.hidden) { cancelAnimationFrame(raf.current); raf.current = 0; } else kick(); };
    document.addEventListener('visibilitychange', vis);
    return () => { ro.disconnect(); document.removeEventListener('visibilitychange', vis); };
    // eslint-disable-next-line
  }, []);

  const height = reduced || failed ? '100lvh' : `calc(100svh + ${CONFIG.scrollSeconds * CONFIG.pxPerSecond}px)`;

  return (
    <section id="film" ref={section} style={{ height, background: CONFIG.bg }} aria-label="XMARKET animation">
      <div className="film-stage sticky top-0 w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="XMARKET animation" />
        {failed && <p className="absolute inset-0 grid place-items-center text-sm font-semibold tracking-[0.3em] text-slate-400">ANIMATION UNAVAILABLE</p>}
      </div>
    </section>
  );
}
