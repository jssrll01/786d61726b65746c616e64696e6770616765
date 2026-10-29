import { motion, useTransform } from 'framer-motion';

const chips = [
  ['Xwallet', 'Balance', 'left', '22%', 0.04, 0.34, 40],
  ['Xcards', 'Gift cards', 'right', '30%', 0.14, 0.44, 70],
  ['Play Time', 'Earn points', 'left', '46%', 0.28, 0.6, 55],
  ['Bundle Deals', 'Save together', 'right', '54%', 0.42, 0.74, 85],
  ['Loyalty Points', 'Earn rewards', 'left', '66%', 0.58, 0.9, 45],
  ['Vouchers', 'Promo codes', 'right', '72%', 0.7, 1.0, 75],
];

function Chip({ p, c }) {
  const [t, s, side, top, a, b, depth] = c;
  const fade = 0.07;
  const opacity = useTransform(p, [a, a + fade, b - fade, b], [0, 1, 1, 0]);
  const y = useTransform(p, [0, 1], [depth, -depth]);
  const scale = useTransform(p, [a, (a + b) / 2, b], [0.92, 1, 0.96]);
  return (
    <motion.div style={{ opacity, y, scale, top, [side]: '4%' }}
      className="absolute flex items-center gap-2" aria-hidden="true">
      {side === 'right' && <span className="h-px w-6 bg-blue-500/60 sm:w-12" />}
      <div className="rounded-2xl bg-white/75 px-3 py-2 shadow-[0_12px_30px_rgba(37,99,235,.18)] ring-1 ring-white backdrop-blur sm:px-4 sm:py-3">
        <p className="text-xs font-extrabold text-slate-900 sm:text-sm">{t}</p>
        <p className="text-[10px] text-slate-500 sm:text-xs">{s}</p>
      </div>
      {side === 'left' && <span className="h-px w-6 bg-blue-500/60 sm:w-12" />}
    </motion.div>
  );
}

export default function Overlay({ progress }) {
  const sweep = useTransform(progress, [0, 1], ['-60%', '160%']);
  const floor = useTransform(progress, [0, 0.5, 1], [0.7, 1.1, 0.8]);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div style={{ x: sweep }} className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-soft-light" />
      <motion.div style={{ scaleX: floor }} className="absolute bottom-[14%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-slate-900/20 blur-xl" />
      {[['left-4 top-20', 'border-l-2 border-t-2'], ['right-4 top-20', 'border-r-2 border-t-2'], ['bottom-6 left-4', 'border-b-2 border-l-2'], ['bottom-6 right-4', 'border-b-2 border-r-2']].map(([pos, b]) => (
        <span key={pos} className={`absolute h-6 w-6 border-blue-500/50 ${pos} ${b}`} />
      ))}
      {chips.map((c) => <Chip key={c[0]} p={progress} c={c} />)}
    </div>
  );
}
