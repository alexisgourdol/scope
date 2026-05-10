"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { LayoutList, LayoutDashboard } from "lucide-react"

export function ViewToggle({ view }: { view: "list" | "board" }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setView(v: "list" | "board") {
    document.cookie = `scope_view=${v}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    const params = new URLSearchParams(searchParams.toString())
    if (v === "list") params.delete("view")
    else params.set("view", v)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center rounded-md border border-border bg-muted p-0.5">
      <button
        onClick={() => setView("list")}
        aria-label="List view"
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
          view === "list"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutList className="h-3.5 w-3.5" />
        List
      </button>
      <button
        onClick={() => setView("board")}
        aria-label="Board view"
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
          view === "board"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Board
      </button>
    </div>
  )
}
