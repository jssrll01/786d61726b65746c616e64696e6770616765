export default function Rewards() {
  return (
    <section id="rewards" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
      <div>
        <p className="text-xs font-bold tracking-[0.3em] text-violet-accent">REWARDS</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Play, collect, and unlock.</h2>
        <p className="mt-4 text-slate-600">XMARKET offers loyalty points and activities such as streaks and mystery boxes. Availability and outcomes depend on current XMARKET programs.</p>
      </div>
      <div className="relative mx-auto h-64 w-full max-w-sm" aria-hidden="true">
        <div className="absolute inset-x-6 top-4 h-44 rotate-[-6deg] rounded-3xl bg-gradient-to-br from-slate-100 to-slate-300 shadow-xl ring-1 ring-white" />
        <div className="absolute inset-x-6 top-10 h-44 rotate-[4deg] rounded-3xl bg-gradient-to-br from-brand to-violet-accent shadow-2xl" />
        <div className="absolute left-1/2 top-24 grid h-28 w-28 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-white via-slate-200 to-slate-400 text-4xl font-black text-brand shadow-2xl ring-4 ring-white">X</div>
      </div>
    </section>
  );
}
