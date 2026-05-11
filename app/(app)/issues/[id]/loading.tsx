import { PageContainer } from "@/components/ui/page-container"

export default function IssueDetailLoading() {
  return (
    <PageContainer width="narrow">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-3 h-3 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mb-8 flex gap-2">
        <div className="h-8 w-24 animate-pulse rounded-md border bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded-md border bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded-md border bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
      </div>
    </PageContainer>
  )
}
