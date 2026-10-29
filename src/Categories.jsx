import { Store, Zap, Percent, Gift, Wallet, CreditCard, Ticket } from 'lucide-react';
const feats = [
  ['XMALL', 'Shop the XMARKET mall.', Store],
  ['Flash Sale', 'Time-limited offers.', Zap],
  ['Save More', 'Find ways to save.', Percent],
  ['Bundle Deals', 'Save together.', Gift],
  ['Xwallet', 'Your XMARKET balance.', Wallet],
  ['Xcards', 'Gift cards.', CreditCard],
  ['Vouchers', 'Promo codes.', Ticket],
];
export default function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-6xl px-5 py-24">
      <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Inside XMARKET</h2>
      <p className="mt-3 text-slate-600">What you will find in the XMARKET app.</p>
      <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {feats.map(([n, d, Icon]) => (
          <li key={n} className="rounded-3xl bg-gradient-to-br from-white to-slate-100 p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-200">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white" aria-hidden="true"><Icon size={24} /></span>
            <p className="mt-5 text-lg font-extrabold">{n}</p>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
