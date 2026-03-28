export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10">
      {children}
    </div>
  );
}
