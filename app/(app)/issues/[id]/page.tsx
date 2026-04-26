import { db } from "@/db"
import { issues, projects } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { notFound } from "next/navigation"
import { IssueDetail } from "@/components/issue-detail"

type Props = { params: Promise<{ id: string }> }

export default async function IssueDetailPage({ params }: Props) {
  const { id } = await params

  const [row] = await db
    .select({
      id: issues.id,
      title: issues.title,
      description: issues.description,
      status: issues.status,
      priority: issues.priority,
      projectId: issues.projectId,
      createdAt: issues.createdAt,
      updatedAt: issues.updatedAt,
    })
    .from(issues)
    .where(and(eq(issues.id, id), eq(issues.userId, USER_ID)))

  if (!row) notFound()

  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, USER_ID))
    .orderBy(projects.name)

  return <IssueDetail issue={row} projects={projectList} />
}
