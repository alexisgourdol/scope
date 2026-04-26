import { db } from "@/db"
import { projects, issues } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { ProjectList } from "@/components/project-list"

export default async function ProjectsPage() {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      issueCount: sql<number>`count(${issues.id})::int`,
    })
    .from(projects)
    .leftJoin(issues, eq(issues.projectId, projects.id))
    .where(eq(projects.userId, USER_ID))
    .groupBy(projects.id)
    .orderBy(projects.name)

  return <ProjectList projects={rows} />
}
