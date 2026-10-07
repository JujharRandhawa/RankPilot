import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15,118,110,0.92) 0%, rgba(20,32,51,0.88) 48%, rgba(234,88,12,0.55) 100%), url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22><path fill=%22none%22 stroke=%22rgba(255,255,255,0.08)%22 stroke-width=%221%22 d=%22M0 80h160M80 0v160%22/></svg>')",
          backgroundSize: "cover, 48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-glow/30 blur-3xl animate-pulse-soft" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse-soft" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between animate-rise">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              RankPilot
            </span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Open app
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 md:py-20">
          <p className="animate-rise font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            RankPilot
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-2xl text-2xl font-semibold leading-snug text-white/95 sm:text-3xl">
            Autonomous SEO content engine with live analytics.
          </h1>
          <p className="animate-rise-delay mt-4 max-w-xl text-base leading-relaxed text-teal-50/90 sm:text-lg">
            Research keywords, generate optimized drafts, score on-page SEO, and
            track simulated organic growth — built as a complete college project
            demo.
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-teal-50"
            >
              Launch dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/engine"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Try content engine
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/15 py-4 text-sm text-white/70">
          Demo-ready · Mock APIs · Next.js + TypeScript
        </footer>
      </div>
    </div>
  );
}
