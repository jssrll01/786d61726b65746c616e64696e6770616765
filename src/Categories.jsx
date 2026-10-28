const cats = [
  ['Electronics', '💻'], ['Fashion', '👗'], ['Beauty & Personal Care', '✨'],
  ['Home & Living', '🛋️'], ['Groceries & Pantry', '🧺'], ['Sports & Outdoors', '🏃'],
];
export default function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-6xl px-5 py-24">
      <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Explore the marketplace</h2>
      <p className="mt-3 text-slate-600">Browse across categories.</p>
      <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cats.map(([n, e]) => (
          <li key={n}>
            <a href="#top" className="flex h-full flex-col rounded-3xl bg-gradient-to-br from-white to-slate-100 p-6 shadow-[0_10px_30px_rgba(15,23,42,.07)] ring-1 ring-slate-200 transition hover:-translate-y-1 focus-visible:-translate-y-1">
              <span className="text-4xl" aria-hidden="true">{e}</span>
              <span className="mt-6 text-lg font-extrabold">{n}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
