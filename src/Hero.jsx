import { motion } from 'framer-motion';
import { CONFIG } from './config';
const up = (d) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d } });
export default function Hero() {
  return (
    <section className="grid min-h-svh place-items-center bg-gradient-to-b from-white to-slate-100 px-6 text-center">
      <div className="max-w-3xl pt-16">
        <motion.p {...up(0)} className="text-xs font-bold tracking-[0.3em] text-brand">EXPLORE. SHOP. SAVE.</motion.p>
        <motion.h1 {...up(0.1)} className="mt-4 text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">A BETTER WAY TO SHOP.</motion.h1>
        <motion.p {...up(0.2)} className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Discover products, explore great deals, and enjoy a smarter shopping experience with XMARKET.
        </motion.p>
        <motion.div {...up(0.3)} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={CONFIG.appUrl} className="rounded-full bg-brand px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25">Explore XMARKET</a>
          <a href="#rewards" className="rounded-full border border-slate-300 bg-white px-8 py-3.5 font-bold text-slate-800">Discover Rewards</a>
        </motion.div>
      </div>
    </section>
  );
}
