"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Archive, ArchiveRestore, CheckSquare, ChevronDown } from "lucide-react"
import { IssueStatusIcon } from "@/components/issue-status-icon"
import { IssuePriorityIcon } from "@/components/issue-priority-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_ORDER = ["backlog", "todo", "in_progress", "done"] as const
const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

function formatRelative(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

type IssueRow = {
  id: string
  title: string
  status: string
  priority: string
  updatedAt: Date
  archivedAt: Date | null
  projectName: string | null
}

type Props = {
  issues: IssueRow[]
  showArchived: boolean
  projectFilter?: string
  isDemo: boolean
}

export function IssueList({ issues, showArchived, projectFilter, isDemo }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const selectionMode = selectedIds.size > 0

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function toggleArchivedView() {
    const params = new URLSearchParams(searchParams.toString())
    if (showArchived) params.delete("showArchived")
    else params.set("showArchived", "true")
    router.push(`${pathname}?${params.toString()}`)
    clearSelection()
  }

  async function bulkAction(action: "archive" | "unarchive" | "status", status?: string) {
    if (isDemo) return
    const ids = Array.from(selectedIds)
    await fetch("/api/issues/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action, status }),
    })
    clearSelection()
    startTransition(() => router.refresh())
  }

  const grouped = STATUS_ORDER.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    items: issues.filter((i) => i.status === s),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      {/* archived toggle */}
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={toggleArchivedView}
          className={`flex items-center gap-1.5 rounded-btn px-2.5 py-1 text-xs font-medium transition-colors ${
            showArchived
              ? "bg-accent/20 text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Archive className="h-3.5 w-3.5" />
          {showArchived ? "Viewing archived" : "Show archived"}
        </button>
      </div>

      {issues.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-sm">
            {showArchived
              ? "No archived issues."
              : projectFilter
              ? "No issues in this project."
              : "No issues yet."}
          </p>
          {!showArchived && (
            <p className="mt-1 text-xs">
              Press{" "}
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs">
                C
              </kbd>{" "}
              to create one.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ status, label, items }) => (
            <div key={status}>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {label}
                <span className="rounded-pill bg-muted px-1.5 py-0.5 text-xs">
                  {items.length}
                </span>
              </h2>
              <div className="divide-y rounded-lg border shadow-card">
                {items.map((issue) => (
                  <div
                    key={issue.id}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 transition-colors ${
                      selectedIds.has(issue.id)
                        ? "bg-accent/10"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    {/* checkbox */}
                    <button
                      onClick={() => toggleSelect(issue.id)}
                      aria-label="Select issue"
                      className={`shrink-0 transition-opacity ${
                        selectionMode || selectedIds.has(issue.id)
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-colors ${
                          selectedIds.has(issue.id)
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-background"
                        }`}
                      >
                        {selectedIds.has(issue.id) && (
                          <CheckSquare className="h-3 w-3" />
                        )}
                      </div>
                    </button>

                    <IssuePriorityIcon priority={issue.priority} />
                    <IssueStatusIcon status={issue.status} />

                    <Link
                      href={`/issues/${issue.id}`}
                      className="flex flex-1 items-center gap-3 text-sm"
                      tabIndex={selectionMode ? -1 : 0}
                    >
                      <span className="flex-1">{issue.title}</span>
                      {issue.projectName && (
                        <span className="text-xs text-muted-foreground">
                          {issue.projectName}
                        </span>
                      )}
                      <span className="w-16 text-right text-xs text-muted-foreground">
                        {formatRelative(issue.updatedAt)}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* floating bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-pill bg-foreground px-4 py-2.5 shadow-card-dark">
            <span className="text-sm font-medium text-background">
              {selectedIds.size} selected
            </span>

            <div className="h-4 w-px bg-background/20" />

            {/* status dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isPending || isDemo}
                className="flex items-center gap-1 rounded-btn bg-background/15 px-2.5 py-1 text-xs font-medium text-background outline-none transition-colors hover:bg-background/25 disabled:opacity-50"
              >
                Set status…
                <ChevronDown className="h-3 w-3 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center">
                {(["backlog", "todo", "in_progress", "done"] as const).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => bulkAction("status", s)}>
                    {STATUS_LABELS[s]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => bulkAction(showArchived ? "unarchive" : "archive")}
              disabled={isPending || isDemo}
              className="flex items-center gap-1.5 rounded-btn bg-background/15 px-2.5 py-1 text-xs font-medium text-background transition-colors hover:bg-background/30 active:bg-background/40 disabled:opacity-50"
            >
              {showArchived ? (
                <><ArchiveRestore className="h-3.5 w-3.5" /> Unarchive</>
              ) : (
                <><Archive className="h-3.5 w-3.5" /> Archive</>
              )}
            </button>

            <button
              onClick={clearSelection}
              className="text-xs text-background/60 hover:text-background"
              aria-label="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
