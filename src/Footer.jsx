import { CONFIG } from './config';
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-5 py-10 text-center">
      <p className="text-xl font-black">X<span className="text-brand">MARKET</span></p>
      <p className="mt-2 text-sm text-slate-600">Your World of Great Deals. Explore. Shop. Save.</p>
      <p className="mt-6 text-xs text-slate-500">© {CONFIG.copyrightYear} XMARKET</p>
    </footer>
  );
}
