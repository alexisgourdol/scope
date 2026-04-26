import { db } from "@/db"
import { projects } from "@/db/schema"
import { eq } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, USER_ID))
    .orderBy(projects.name)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar projects={userProjects} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
