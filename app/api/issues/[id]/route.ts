import { db } from "@/db"
import { issues } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(issues)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(issues.id, id), eq(issues.userId, USER_ID)))
    .returning()

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Params) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const { id } = await params
  await db.delete(issues).where(and(eq(issues.id, id), eq(issues.userId, USER_ID)))
  return NextResponse.json({ ok: true })
}
