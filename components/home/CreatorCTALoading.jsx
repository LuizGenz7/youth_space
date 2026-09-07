export default function CreatorCTALoading() {
  return (
    <section className="px-5 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl bg-slate-100 px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
            <div className="h-5 w-5 rounded-full bg-slate-200" />
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Your space.
            <span className="block text-slate-400">Your opportunity.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Showcase your work, connect with people and let your talent get
            discovered on Youth Space.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <div className="h-12 w-full rounded-xl bg-slate-200 sm:w-48" />
            <div className="h-12 w-full rounded-xl border border-slate-200 bg-white sm:w-40" />
          </div>
        </div>
      </div>
    </section>
  );
}
