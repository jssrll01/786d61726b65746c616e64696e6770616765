import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { CONFIG } from './config';
import { FrameStore, loadManifest } from './frames';
import { useStore } from './store';
import Overlay from './Overlay';

const dims = (b) => [b.naturalWidth || b.width, b.naturalHeight || b.height];

const avgColor = (img) => {
  try {
    const t = document.createElement('canvas');
    t.width = t.height = 1;
    const x = t.getContext('2d');
    x.drawImage(img, 0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data;
    return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')';
  } catch (e) { return null; }
};

function paint(ctx, c, img, alpha) {
  const [iw, ih] = dims(img);
  const pick = CONFIG.fit === 'contain' ? Math.min : Math.max;
  const s = pick(c.width / iw, c.height / ih);
  const w = iw * s, h = ih * s;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, (c.width - w) * CONFIG.focusX, (c.height - h) * CONFIG.focusY, w, h);
}

export default function Film() {
  const section = useRef(null);
  const canvas = useRef(null);
  const store = useRef(null);
  const count = useRef(0);
  const target = useRef(0);
  const current = useRef(0);
  const shown = useRef('');
  const way = useRef(1);
  const raf = useRef(0);
  const lastT = useRef(0);
  const [failed, setFailed] = useState(false);
  const reduced = useStore((s) => s.reduced);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });

  const draw = (force) => {
    const c = canvas.current, S = store.current;
    if (!c || !S || !c.width) return;
    const pos = current.current;
    const i = CONFIG.blend ? Math.floor(pos) : Math.round(pos);
    const f = CONFIG.blend ? pos - i : 0;
    const a = S.pick(i);
    if (a < 0) return;
    const key = a + ':' + (f > 0.04 ? Math.round(f * 8) : 0);
    if (!force && key === shown.current) return;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = CONFIG.smoothQuality;
    ctx.globalAlpha = 1;
    ctx.fillStyle = CONFIG.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    paint(ctx, c, S.maps[a], 1);
    if (f > 0.04 && a === i && S.maps[i + 1]) paint(ctx, c, S.maps[i + 1], f);
    ctx.globalAlpha = 1;
    shown.current = key;
  };

  const tick = (t) => {
    const dt = lastT.current ? Math.min(0.1, (t - lastT.current) / 1000) : 0.016;
    lastT.current = t;
    const diff = target.current - current.current;
    if (Math.abs(diff) < 0.01) {
      current.current = target.current;
      draw(false);
      raf.current = 0;
      lastT.current = 0;
      return;
    }
    way.current = diff > 0 ? 1 : -1;
    current.current += diff * (1 - Math.exp(-dt * CONFIG.smoothing));
    if (store.current) store.current.ensure(Math.round(current.current), way.current);
    draw(false);
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
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    loadManifest(portrait ? 'frames-m' : 'frames').then((m) => {
      if (dead) return;
      count.current = m.count;
      const start = reduced ? 0 : Math.round(Math.max(0, Math.min(1, scrollYProgress.get())) * (m.count - 1));
      current.current = start; target.current = start;
      const S = new FrameStore(m.dir, m.count, { maxInflight: CONFIG.maxInflight });
      store.current = S;
      S.onDecoded = (i) => {
        if (dead) return;
        if (!S.sized) {
          S.sized = true;
          const [w, h] = dims(S.maps[i]);
          S.setWindow(w, h, CONFIG.windowMB);
          const col = avgColor(S.maps[i]);
          if (col && section.current) section.current.style.background = col;
          if (reduced) S.halted = true;
        }
        draw(false);
      };
      S.start(start, CONFIG.concurrency, (ok) => {
        if (dead) return;
        if (!ok) setFailed(true); else S.ensure(start, 1, true);
      });
    }).catch((e) => { console.error('[film]', e.message); if (!dead) setFailed(true); });
    return () => {
      dead = true;
      if (store.current) { store.current.destroy(); store.current = null; }
      cancelAnimationFrame(raf.current); raf.current = 0;
    };
    // eslint-disable-next-line
  }, [reduced]);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const el = c.parentElement;
    const fit = () => {
      const r = el.getBoundingClientRect();
      let dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      const px = r.width * r.height * dpr * dpr;
      if (px > CONFIG.maxPixels) dpr *= Math.sqrt(CONFIG.maxPixels / px);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      shown.current = '';
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

  const height = reduced || failed ? '100lvh' : 'calc(100svh + ' + CONFIG.scrollSeconds * CONFIG.pxPerSecond + 'px)';

  return (
    <section id="film" ref={section} style={{ height, background: CONFIG.bg }} aria-label="XMARKET animation">
      <div className="film-stage sticky top-0 w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="XMARKET animation" />
        {failed && <p className="absolute inset-0 grid place-items-center text-sm font-semibold tracking-[0.3em] text-slate-400">ANIMATION UNAVAILABLE</p>}
      </div>
    </section>
  );
}
