const base = import.meta.env.BASE_URL;
const name = (i) => `${base}frames/f${String(i + 1).padStart(4, '0')}.webp`;

export async function loadManifest() {
  const res = await fetch(`${base}frames/manifest.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Frame manifest missing. Run: sh scripts/extract-frames.sh');
  const m = await res.json();
  if (!m.count || m.count < 1) throw new Error('Frame manifest is empty');
  return m;
}

function loadOne(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = async () => {
      try { if (img.decode) await img.decode(); } catch (e) { /* draw anyway */ }
      resolve(img);
    };
    img.onerror = () => resolve(null);
    img.src = name(i);
  });
}

// Loads frame 0 first, then the rest with limited concurrency. One retry per failed frame.
export function createLoader(count, { onFrame }) {
  const frames = new Array(count).fill(null);
  let aborted = false;
  let loaded = 0;
  async function get(i) {
    let img = await loadOne(i);
    if (!img && !aborted) img = await loadOne(i);
    if (aborted) return;
    if (img) { frames[i] = img; loaded += 1; }
    onFrame(i, loaded, !!img);
  }
  async function start(concurrency) {
    await get(0);
    let next = 1;
    const worker = async () => {
      while (!aborted && next < count) { const i = next++; await get(i); }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }
  return { frames, start, abort: () => { aborted = true; } };
}

// Index of the closest loaded frame to `want`, or -1.
export function nearest(frames, want) {
  const n = frames.length;
  const w = Math.max(0, Math.min(n - 1, want));
  if (frames[w]) return w;
  for (let d = 1; d < n; d++) {
    if (w - d >= 0 && frames[w - d]) return w - d;
    if (w + d < n && frames[w + d]) return w + d;
  }
  return -1;
}
