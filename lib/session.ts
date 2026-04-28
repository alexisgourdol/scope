import { cookies } from "next/headers"
import { SESSION_COOKIE, getSessionType, type SessionType } from "@/lib/auth"

export async function getSession(): Promise<SessionType> {
  const jar = await cookies()
  return getSessionType(jar.get(SESSION_COOKIE)?.value)
}
