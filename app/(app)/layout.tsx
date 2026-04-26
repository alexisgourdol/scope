import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { HelpModal } from "@/components/help-modal"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, USER_ID))
    .orderBy(projects.name)

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <KeyboardShortcuts />
      <HelpModal />
      <Sidebar projects={userProjects} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
