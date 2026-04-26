"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { Project } from "@/db/schema"

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectRef = useRef<HTMLSelectElement>(null)
  const current = searchParams.get("project") ?? ""

  useEffect(() => {
    function handler() { selectRef.current?.focus() }
    document.addEventListener("scope:focus-filter", handler)
    return () => document.removeEventListener("scope:focus-filter", handler)
  }, [])

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("project", value)
    else params.delete("project")
    router.push(`${pathname}?${params.toString()}`)
  }

  if (projects.length === 0) return null

  return (
    <select
      ref={selectRef}
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-md border border-input bg-background px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="">All projects</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  )
}
