import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!process.env.AUTH_SECRET || password !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const jar = await cookies()
  jar.set(SESSION_COOKIE, process.env.AUTH_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })

  return NextResponse.json({ ok: true })
}
