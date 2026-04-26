export default function ProjectsLoading() {
  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="divide-y rounded-md border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" style={{ maxWidth: `${30 + i * 15}%` }} />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
