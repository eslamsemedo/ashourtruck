export default function Loading() {
  return (
    <section className="w-full bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-white/10" />
          <div className="space-y-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-40 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}