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
    const active = pathname === href
    return `flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
      active
        ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-medium"
        : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/60"
    }`
  }

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <div className="flex h-11 items-center border-b border-[var(--sidebar-border)] px-4">
        <span className="text-sm font-semibold tracking-tight">Scope</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <Link href="/issues" className={navClass("/issues")}>
          Issues
        </Link>
        <Link href="/projects" className={navClass("/projects")}>
          Projects
        </Link>

        {projects.length > 0 && (
          <div className="pt-4">
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
      </nav>

      <div className="border-t border-[var(--sidebar-border)] p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-[var(--sidebar-accent)]/60 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
