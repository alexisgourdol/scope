import { db } from "@/db"
import { projects } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

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
  revalidatePath("/", "layout")
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const { id } = await params
  try {
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, USER_ID)))
  } catch {
    return NextResponse.json({ error: "Could not delete project" }, { status: 409 })
  }
  revalidatePath("/", "layout")
  return NextResponse.json({ ok: true })
}
