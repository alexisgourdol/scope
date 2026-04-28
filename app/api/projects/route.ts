import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { NextResponse } from "next/server"

export async function GET() {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, USER_ID))
    .orderBy(desc(projects.updatedAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const { name } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  const [project] = await db
    .insert(projects)
    .values({ name: name.trim(), userId: USER_ID })
    .returning()
  return NextResponse.json(project, { status: 201 })
}
