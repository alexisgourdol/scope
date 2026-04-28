import { db } from "@/db"
import { issues, projects } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import Link from "next/link"
import { NewIssueButton } from "@/components/new-issue-button"
import { IssueStatusIcon } from "@/components/issue-status-icon"
import { IssuePriorityIcon } from "@/components/issue-priority-icon"
import { ProjectFilter } from "@/components/project-filter"
import { Suspense } from "react"

const STATUS_ORDER = ["backlog", "todo", "in_progress", "done"] as const
const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

function formatRelative(date: Date) {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "today"
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

type SearchParams = Promise<{ project?: string }>

export default async function IssuesPage({ searchParams }: { searchParams: SearchParams }) {
  const { project: projectFilter } = await searchParams

  const whereClause = projectFilter
    ? and(eq(issues.userId, USER_ID), eq(issues.projectId, projectFilter))
    : eq(issues.userId, USER_ID)

  const [session, issueRows, projectList] = await Promise.all([
    getSession(),
    db
      .select({
        id: issues.id,
        title: issues.title,
        status: issues.status,
        priority: issues.priority,
        updatedAt: issues.updatedAt,
        projectName: projects.name,
      })
      .from(issues)
      .leftJoin(projects, eq(issues.projectId, projects.id))
      .where(whereClause)
      .orderBy(desc(issues.updatedAt)),
    db.select().from(projects).where(eq(projects.userId, USER_ID)).orderBy(projects.name),
  ])

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: issueRows.filter((i) => i.status === status),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Issues</h1>
        <div className="flex items-center gap-2">
          <Suspense>
            <ProjectFilter projects={projectList} />
          </Suspense>
          <NewIssueButton projects={projectList} isDemo={session === "demo"} />
        </div>
      </div>

      {issueRows.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-sm">{projectFilter ? "No issues in this project." : "No issues yet."}</p>
          {!session || session === "admin" ? (
            <p className="mt-1 text-xs">Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-xs">C</kbd> to create one.</p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ status, label, items }) => (
            <div key={status}>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {label}
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{items.length}</span>
              </h2>
              <div className="divide-y rounded-md border">
                {items.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <IssuePriorityIcon priority={issue.priority} />
                    <IssueStatusIcon status={issue.status} />
                    <span className="flex-1 text-sm">{issue.title}</span>
                    {issue.projectName && (
                      <span className="text-xs text-muted-foreground">{issue.projectName}</span>
                    )}
                    <span className="w-16 text-right text-xs text-muted-foreground">
                      {formatRelative(issue.updatedAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
