import { db } from "@/db"
import { projects } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const { name } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  const [updated] = await db
    .update(projects)
    .set({ name: name.trim(), updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, USER_ID)))
    .returning()
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, USER_ID)))
  return NextResponse.json({ ok: true })
}
