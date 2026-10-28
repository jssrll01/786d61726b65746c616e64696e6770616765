import { useEffect } from 'react';
import Lenis from 'lenis';
import { CONFIG } from './config';
import { useStore } from './store';
import Header from './Header';
import Hero from './Hero';
import Film from './Film';
import Categories from './Categories';
import Benefits from './Benefits';
import Rewards from './Rewards';
import FinalCTA from './FinalCTA';
import Footer from './Footer';

export default function App() {
  const reduced = useStore((s) => s.reduced);
  useEffect(() => {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!desktop || reduced) return;
    const lenis = new Lenis({ lerp: CONFIG.lenisLerp, autoRaf: true });
    return () => lenis.destroy();
  }, [reduced]);
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Film />
        <Categories />
        <Benefits />
        <Rewards />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
