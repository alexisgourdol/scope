import { db } from "@/db"
import { projects, issues } from "@/db/schema"
import { and, eq, isNull, isNotNull, sql } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { ProjectList } from "@/components/project-list"

type SearchParams = Promise<{ showArchived?: string }>

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const { showArchived: showArchivedParam } = await searchParams
  const showArchived = showArchivedParam === "true"

  const [session, rows] = await Promise.all([
    getSession(),
    db
      .select({
        id: projects.id,
        name: projects.name,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        archivedAt: projects.archivedAt,
        issueCount: sql<number>`count(${issues.id})::int`,
        openIssueCount: sql<number>`count(case when ${issues.archivedAt} is null and ${issues.status} != 'done' then 1 end)::int`,
      })
      .from(projects)
      .leftJoin(issues, eq(issues.projectId, projects.id))
      .where(
        and(
          eq(projects.userId, USER_ID),
          showArchived ? isNotNull(projects.archivedAt) : isNull(projects.archivedAt)
        )
      )
      .groupBy(projects.id)
      .orderBy(projects.name),
  ])

  return <ProjectList projects={rows} isDemo={session === "demo"} showArchived={showArchived} />
}
