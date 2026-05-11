import { PageContainer } from "@/components/ui/page-container"

export default function IssuesLoading() {
  return (
    <PageContainer width="wide">
      <div className="mb-6 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-8">
        {[6, 4, 3].map((count, i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="divide-y rounded-md border">
              {Array.from({ length: count }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-sm bg-muted" />
                  <div className="h-4 w-4 flex-shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-muted" style={{ maxWidth: `${50 + Math.random() * 40}%` }} />
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
