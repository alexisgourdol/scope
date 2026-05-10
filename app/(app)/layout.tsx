import { db } from "@/db"
import { projects } from "@/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { Sidebar } from "@/components/sidebar"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { HelpModal } from "@/components/help-modal"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [userProjects, session] = await Promise.all([
    db.select().from(projects).where(and(eq(projects.userId, USER_ID), isNull(projects.archivedAt))).orderBy(projects.name),
    getSession(),
  ])

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <KeyboardShortcuts />
      <HelpModal />
      <Sidebar projects={userProjects} isDemo={session === "demo"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
