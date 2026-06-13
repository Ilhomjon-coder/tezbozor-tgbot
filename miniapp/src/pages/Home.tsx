import { texts } from '@tezbozor/shared';

// Single styled placeholder home screen. Demonstrates the design tokens wired
// into the Tailwind theme (brand green/orange, Montserrat/Inter, radii,
// shadows). NOT the real home — the product grid, banner and nav come in Phase 3.
export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-gutter py-10">
      <main className="w-full max-w-content flex flex-col items-center text-center gap-6">
        <img src="/tezbozor-mark.svg" alt={texts.appName} className="h-20 w-20" />

        <div>
          <h1 className="font-heading text-h1 text-brand-green">{texts.appName}</h1>
          <p className="mt-1 font-body text-ink-600">{texts.home.tagline}</p>
        </div>

        <section className="w-full rounded-lg bg-card p-6 text-left shadow-md">
          <h2 className="mb-2 font-heading text-h3 text-ink-900">{texts.home.greeting}</h2>
          <p className="font-body leading-relaxed text-ink-600">{texts.home.placeholder}</p>
        </section>

        <span className="inline-flex items-center rounded-pill bg-brand-orange-light px-3 py-1 text-xs font-semibold text-brand-orange-dark">
          Phase 0 · walking skeleton
        </span>
      </main>
    </div>
  );
}
