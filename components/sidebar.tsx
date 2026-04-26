"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Project } from "@/db/schema"

export function Sidebar({ projects }: { projects: Project[] }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  function navClass(href: string) {
    const active = pathname === href || (href !== "/issues" && pathname.startsWith(href))
    return `flex items-center rounded-md px-3 py-1.5 text-sm transition-colors whitespace-nowrap ${
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
    }`
  }

  return (
    <aside className="flex w-full flex-shrink-0 flex-col border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:h-full md:w-56 md:border-b-0 md:border-r">
      <div className="flex h-11 items-center border-b border-sidebar-border px-4">
        <span className="text-sm font-semibold tracking-tight">Scope</span>
      </div>

      {/* On mobile: horizontal nav row. On desktop: vertical nav. */}
      <div className="flex flex-row items-center gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:items-stretch md:overflow-x-hidden md:overflow-y-auto">
        <Link href="/issues" className={navClass("/issues")}>Issues</Link>
        <Link href="/projects" className={navClass("/projects")}>Projects</Link>

        {projects.length > 0 && (
          <div className="hidden pt-4 md:block">
            <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className={navClass(`/projects/${p.id}`)}>
                {p.name}
              </Link>
            ))}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="ml-auto flex items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 md:hidden"
        >
          Sign out
        </button>
      </div>

      {/* Desktop sign out */}
      <div className="hidden border-t border-sidebar-border p-2 md:block">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
