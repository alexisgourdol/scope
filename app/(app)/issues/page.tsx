import { db } from "@/db"
import { issues, projects } from "@/db/schema"
import { and, desc, eq, ilike, isNotNull, isNull, or } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { NewIssueButton } from "@/components/new-issue-button"
import { ProjectFilter } from "@/components/project-filter"
import { IssueList } from "@/components/issue-list"
import { KanbanView } from "@/components/kanban-view"
import { ViewToggle } from "@/components/view-toggle"
import { SearchBar } from "@/components/search-bar"
import { Suspense } from "react"
import { cookies } from "next/headers"

type SearchParams = Promise<{
  project?: string
  showArchived?: string
  view?: string
  q?: string
}>

export default async function IssuesPage({ searchParams }: { searchParams: SearchParams }) {
  const { project: projectFilter, showArchived: showArchivedParam, view, q } = await searchParams
  const searchQuery = q?.trim() ?? ""
  const showArchived = showArchivedParam === "true"
  const cookieStore = await cookies()
  const savedView = cookieStore.get("scope_view")?.value
  const activeView = view === "board" ? "board" : (!view && savedView === "board") ? "board" : "list"

  const baseWhere = and(
    eq(issues.userId, USER_ID),
    showArchived ? isNotNull(issues.archivedAt) : isNull(issues.archivedAt),
    projectFilter ? eq(issues.projectId, projectFilter) : undefined,
    searchQuery
      ? or(ilike(issues.title, `%${searchQuery}%`), ilike(issues.description, `%${searchQuery}%`))
      : undefined
  )

  const [session, issueRows, projectList] = await Promise.all([
    getSession(),
    db
      .select({
        id: issues.id,
        title: issues.title,
        status: issues.status,
        priority: issues.priority,
        updatedAt: issues.updatedAt,
        archivedAt: issues.archivedAt,
        projectName: projects.name,
      })
      .from(issues)
      .leftJoin(projects, eq(issues.projectId, projects.id))
      .where(baseWhere)
      .orderBy(desc(issues.updatedAt)),
    db.select().from(projects).where(eq(projects.userId, USER_ID)).orderBy(projects.name),
  ])

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Issues</h1>
        <div className="flex items-center gap-2">
          <Suspense>
            <SearchBar key={searchQuery} defaultValue={searchQuery} />
          </Suspense>
          <Suspense>
            <ProjectFilter projects={projectList} />
          </Suspense>
          <Suspense>
            <ViewToggle view={activeView} />
          </Suspense>
          <NewIssueButton
            projects={projectList}
            isDemo={session === "demo"}
            defaultProjectId={projectFilter}
          />
        </div>
      </div>

      {activeView === "board" ? (
        <KanbanView issues={issueRows} />
      ) : (
        <IssueList
          issues={issueRows}
          showArchived={showArchived}
          projectFilter={projectFilter}
          searchQuery={searchQuery}
          isDemo={session === "demo"}
        />
      )}
    </div>
  )
}
