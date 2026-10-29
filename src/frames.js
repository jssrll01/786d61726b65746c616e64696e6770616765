const base = import.meta.env.BASE_URL;
const url = (dir, i) => `${base}${dir}/f${String(i + 1).padStart(4, '0')}.webp`;

async function tryManifest(dir) {
  try {
    const res = await fetch(`${base}${dir}/manifest.json`, { cache: 'no-cache' });
    if (!res.ok) return null;
    const m = await res.json();
    return m && m.count > 0 ? { ...m, dir } : null;
  } catch (e) { return null; }
}

export async function loadManifest(preferred) {
  const m = (await tryManifest(preferred)) || (preferred !== 'frames' ? await tryManifest('frames') : null);
  if (!m) throw new Error('Frame manifest missing. Run: sh scripts/extract-frames.sh');
  return m;
}

async function decodeBlob(blob) {
  if (self.createImageBitmap) {
    try { return await createImageBitmap(blob); } catch (e) { /* fall back below */ }
  }
  const u = URL.createObjectURL(blob);
  const img = new Image();
  img.src = u;
  try { await img.decode(); } finally { URL.revokeObjectURL(u); }
  return img;
}

export class FrameStore {
  constructor(dir, count, opts) {
    this.dir = dir; this.count = count;
    this.max = (opts && opts.maxInflight) || 4;
    this.blobs = new Array(count).fill(null);
    this.maps = new Array(count).fill(null);
    this.pending = new Set();
    this.dead = false; this.halted = false; this.sized = false;
    this.fwd = 24; this.back = 8;
    this.center = 0; this.way = 1; this.lastKey = '';
    this.onDecoded = null;
  }

  setWindow(w, h, mb) {
    const n = Math.max(16, Math.floor((mb * 1048576) / (w * h * 4)));
    this.fwd = Math.max(12, Math.floor(n * 0.8));
    this.back = Math.max(4, n - this.fwd);
  }

  async fetchOne(i) {
    for (let t = 0; t < 2 && !this.blobs[i] && !this.dead; t++) {
      try {
        const r = await fetch(url(this.dir, i));
        if (r.ok) this.blobs[i] = await r.blob();
      } catch (e) { /* retry once */ }
    }
    return !!this.blobs[i];
  }

  async start(first, concurrency, onFirst) {
    const ok = await this.fetchOne(first);
    onFirst(ok);
    if (!ok) return;
    const order = [];
    for (let i = 0; i < this.count; i++) if (i !== first) order.push(i);
    const rank = (a) => Math.abs(a - first) + (a < first ? 0.5 : 0);
    order.sort((a, b) => rank(a) - rank(b));
    let next = 0;
    const worker = async () => {
      while (!this.dead && !this.halted && next < order.length) {
        const i = order[next++];
        await this.fetchOne(i);
        if (i >= this.center - this.back && i <= this.center + this.fwd) this.ensure(this.center, this.way, true);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  range() {
    const a = this.way > 0 ? this.back : this.fwd;
    const b = this.way > 0 ? this.fwd : this.back;
    return [Math.max(0, this.center - a), Math.min(this.count - 1, this.center + b)];
  }

  ensure(center, way, force) {
    const key = center + ':' + way;
    if (!force && key === this.lastKey) return;
    this.lastKey = key; this.center = center; this.way = way;
    const [lo, hi] = this.range();
    for (let i = 0; i < this.count; i++) {
      const m = this.maps[i];
      if (m && (i < lo || i > hi)) { if (m.close) m.close(); this.maps[i] = null; }
    }
    const want = (i) => i >= lo && i <= hi && this.blobs[i] && !this.maps[i] && !this.pending.has(i);
    const span = Math.max(hi - center, center - lo);
    for (let d = 0; d <= span && this.pending.size < this.max; d++) {
      const list = d === 0 ? [center] : [center + way * d, center - way * d];
      for (const i of list) {
        if (this.pending.size >= this.max) break;
        if (want(i)) this.decode(i);
      }
    }
  }

  decode(i) {
    this.pending.add(i);
    decodeBlob(this.blobs[i]).then((bm) => {
      this.pending.delete(i);
      const [lo, hi] = this.range();
      if (this.dead || this.maps[i] || i < lo || i > hi) { if (bm.close) bm.close(); }
      else { this.maps[i] = bm; if (this.onDecoded) this.onDecoded(i); }
      if (!this.dead) this.ensure(this.center, this.way, true);
    }).catch(() => { this.pending.delete(i); });
  }

  pick(want) {
    const w = Math.max(0, Math.min(this.count - 1, want));
    if (this.maps[w]) return w;
    for (let d = 1; d <= 120; d++) {
      if (w - d >= 0 && this.maps[w - d]) return w - d;
      if (w + d < this.count && this.maps[w + d]) return w + d;
    }
    return -1;
  }

  destroy() {
    this.dead = true;
    for (let i = 0; i < this.count; i++) { const m = this.maps[i]; if (m && m.close) m.close(); this.maps[i] = null; this.blobs[i] = null; }
  }
}
