import { db } from "@/db"
import { issues } from "@/db/schema"
import { eq, desc, isNull, isNotNull, and } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const showArchived = searchParams.get("showArchived") === "true"

  const rows = await db
    .select()
    .from(issues)
    .where(
      showArchived
        ? and(eq(issues.userId, USER_ID), isNotNull(issues.archivedAt))
        : and(eq(issues.userId, USER_ID), isNull(issues.archivedAt))
    )
    .orderBy(desc(issues.updatedAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const body = await request.json()
  const { title, status, priority, projectId } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const [issue] = await db
    .insert(issues)
    .values({
      title: title.trim(),
      status: status ?? "backlog",
      priority: priority ?? "none",
      projectId: projectId || null,
      userId: USER_ID,
    })
    .returning()

  return NextResponse.json(issue, { status: 201 })
}
