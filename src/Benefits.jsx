const items = [
  ['Browse', 'Explore products and stores in XMARKET.'],
  ['Pay your way', 'Use your Xwallet balance, Xcards or vouchers at checkout.'],
  ['Track orders', 'Follow your orders from the app.'],
  ['Earn', 'Collect Loyalty Points and take part in Play Time.'],
];
export default function Benefits() {
  return (
    <section id="how" className="bg-slate-50 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">How it works</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <div key={t} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <span className="text-sm font-black text-brand">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-extrabold">{t}</h3>
              <p className="mt-2 text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
