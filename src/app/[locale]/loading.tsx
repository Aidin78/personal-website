export default function LocaleLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8" aria-busy="true" aria-live="polite">
      <div className="space-y-8">
        <div className="h-3 w-24 animate-pulse bg-border" />
        <div className="space-y-3">
          <div className="h-10 w-3/4 max-w-md animate-pulse bg-surface" />
          <div className="h-4 w-full max-w-xl animate-pulse bg-border" />
          <div className="h-4 w-5/6 max-w-lg animate-pulse bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-40 animate-pulse border border-border bg-surface" />
          <div className="h-40 animate-pulse border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
