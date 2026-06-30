export default function AppLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-white px-6 py-4">
        <div className="h-4 w-40 rounded-full bg-ink-100" />
        <div className="mt-3 h-7 w-64 rounded-full bg-ink-100" />
      </div>
      <main className="mx-auto w-full max-w-[1500px] space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-28 rounded-3xl border border-line bg-white shadow-soft" />
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="h-96 rounded-3xl border border-line bg-white shadow-soft" />
          <div className="h-64 rounded-3xl border border-line bg-white shadow-soft" />
        </div>
      </main>
    </div>
  );
}
