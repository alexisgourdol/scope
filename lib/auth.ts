export const USER_ID = "a1b2c3d4-e5f6-4789-abcd-ef0123456789"
export const SESSION_COOKIE = "scope_session"

export function isAuthenticated(cookieValue: string | undefined): boolean {
  return !!process.env.AUTH_SECRET && cookieValue === process.env.AUTH_SECRET
}
