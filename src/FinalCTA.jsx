import { motion } from 'framer-motion';
import { CONFIG } from './config';
export default function FinalCTA() {
  return (
    <section className="px-5 pb-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl rounded-[2rem] bg-gradient-to-br from-brand to-violet-accent px-6 py-16 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Your next great find starts here.</h2>
        <p className="mx-auto mt-4 max-w-md text-blue-50">Explore XMARKET and discover a world of products and offers.</p>
        <a href={CONFIG.appUrl} className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-brand">Explore XMARKET</a>
      </motion.div>
    </section>
  );
}
