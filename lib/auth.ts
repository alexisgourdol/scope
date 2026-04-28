export const USER_ID = "a1b2c3d4-e5f6-4789-abcd-ef0123456789"
export const SESSION_COOKIE = "scope_session"

export type SessionType = "admin" | "demo" | null

export function getSessionType(cookieValue: string | undefined): SessionType {
  if (!cookieValue) return null
  if (process.env.AUTH_SECRET && cookieValue === process.env.AUTH_SECRET) return "admin"
  if (process.env.DEMO_SECRET && cookieValue === process.env.DEMO_SECRET) return "demo"
  return null
}

export function isAuthenticated(cookieValue: string | undefined): boolean {
  return getSessionType(cookieValue) !== null
}
