import { PageContainer } from "@/components/ui/page-container"

export default function ProjectsLoading() {
  return (
    <PageContainer width="default">
      <div className="mb-8 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="divide-y rounded-md border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" style={{ maxWidth: `${30 + i * 15}%` }} />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
