import Link from "next/link";
import PageContainer from "@/components/shared/PageContainer";

export default function HomePage() {
  return (
    <PageContainer>
    <main className="space-y-6">
      <p className="text-sm uppercase tracking-[0.2em] text-stealth-muted">
        Stealth Workspace
      </p>
      <h1 className="text-3xl font-semibold text-stealth-text">
        Calm, private, and ready to build.
      </h1>
      <p className="max-w-2xl text-stealth-muted">
        This app uses Next.js App Router with TypeScript and Tailwind CSS in a
        deep teal and slate gray stealth theme.
      </p>
      <div className="flex gap-3">
        <Link
          className="rounded-lg bg-stealth-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          href="/onboarding"
        >
          Go to Onboarding
        </Link>
        <Link
          className="rounded-lg border border-white/15 bg-stealth-card px-4 py-2 text-sm font-medium text-stealth-text transition hover:border-white/30"
          href="/board"
        >
          Open Board
        </Link>
      </div>
    </main>
    </PageContainer>
  );
}
