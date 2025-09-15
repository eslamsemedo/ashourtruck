"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="min-h-[60vh] bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-white/70">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
        >
          Try again
        </button>
      </div>
    </section>
  );
}