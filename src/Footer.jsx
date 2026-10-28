import { CONFIG } from './config';
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row">
        <div>
          <p className="text-xl font-black">X<span className="text-brand">MARKET</span></p>
          <p className="mt-2 max-w-xs text-sm text-slate-600">Your World of Great Deals. Explore. Shop. Save.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-6 text-sm font-semibold text-slate-700">
          <a href="#top">Home</a><a href="#categories">Explore</a><a href="#rewards">Rewards</a><a href="#how">How It Works</a>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-slate-500">© {CONFIG.copyrightYear} XMARKET</p>
    </footer>
  );
}
