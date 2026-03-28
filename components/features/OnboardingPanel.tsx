type OnboardingPanelProps = {
  title: string;
  description: string;
};

export default function OnboardingPanel({
  title,
  description,
}: OnboardingPanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-stealth-card p-5">
      <h2 className="text-lg font-semibold text-stealth-text">{title}</h2>
      <p className="mt-2 text-sm text-stealth-muted">{description}</p>
    </section>
  );
}
