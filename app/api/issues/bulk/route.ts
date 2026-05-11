import { db } from "@/db"
import { issues } from "@/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { NextResponse } from "next/server"

const VALID_STATUSES = ["backlog", "todo", "in_progress", "done"] as const
type Status = (typeof VALID_STATUSES)[number]

export async function POST(request: Request) {
  if ((await getSession()) === "demo") {
    return NextResponse.json({ error: "Read-only in demo mode" }, { status: 403 })
  }

  const body = await request.json()
  const { ids, action, status } = body as {
    ids: string[]
    action: "archive" | "unarchive" | "status"
    status?: Status
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 })
  }

  const where = and(eq(issues.userId, USER_ID), inArray(issues.id, ids))

  if (action === "archive") {
    await db.update(issues).set({ archivedAt: new Date(), updatedAt: new Date() }).where(where)
  } else if (action === "unarchive") {
    await db.update(issues).set({ archivedAt: null, updatedAt: new Date() }).where(where)
  } else if (action === "status") {
    if (!status || !(VALID_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: "Valid status required" }, { status: 400 })
    }
    await db.update(issues).set({ status, updatedAt: new Date() }).where(where)
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, count: ids.length })
}
