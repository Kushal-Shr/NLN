export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 pb-10 pt-24">
      {children}
    </div>
  );
}
