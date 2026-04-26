import Link from "next/link"

export default function IssueNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium">Issue not found.</p>
      <p className="text-xs text-muted-foreground">It may have been deleted.</p>
      <Link href="/issues" className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors">
        Back to issues
      </Link>
    </div>
  )
}
