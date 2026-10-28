import { useState } from 'react';
const links = [['Home', '#top'], ['Explore', '#categories'], ['Rewards', '#rewards'], ['How It Works', '#how']];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="text-xl font-black tracking-tight text-slate-900">X<span className="text-brand">MARKET</span></a>
        <nav className="hidden gap-8 md:flex" aria-label="Main">
          {links.map(([l, h]) => <a key={l} href={h} className="text-sm font-semibold text-slate-700 hover:text-brand">{l}</a>)}
        </nav>
        <button className="rounded-lg p-2 md:hidden" aria-expanded={open} aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
          <span className="block h-0.5 w-6 bg-slate-900" /><span className="mt-1.5 block h-0.5 w-6 bg-slate-900" /><span className="mt-1.5 block h-0.5 w-6 bg-slate-900" />
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="mx-4 rounded-2xl bg-white p-4 shadow-xl md:hidden">
          {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-semibold text-slate-800">{l}</a>)}
        </nav>
      )}
    </header>
  );
}
