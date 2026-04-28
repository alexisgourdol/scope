"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProjectRow = {
  id: string
  name: string
  issueCount: number
  createdAt: Date
  updatedAt: Date
}

export function ProjectList({ projects, isDemo }: { projects: ProjectRow[]; isDemo?: boolean }) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName("")
    setCreating(false)
    router.refresh()
  }

  function startEdit(p: ProjectRow) {
    setEditingId(p.id)
    setEditName(p.name)
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    })
    setEditingId(null)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Projects</h1>
        {!isDemo && (
          <Button size="sm" onClick={() => setCreating(true)}>
            New project
          </Button>
        )}
      </div>

      <div className="divide-y rounded-md border">
        {creating && (
          <form onSubmit={handleCreate} className="flex items-center gap-2 px-3 py-2">
            <Input
              autoFocus
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { setCreating(false); setNewName("") } }}
              className="h-8 text-sm"
            />
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
              <Check className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0"
              onClick={() => { setCreating(false); setNewName("") }}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        {projects.length === 0 && !creating && (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No projects yet.
          </div>
        )}

        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5">
            {!isDemo && editingId === p.id ? (
              <>
                <Input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit(p.id)
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  className="h-8 text-sm"
                />
                <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={() => handleEdit(p.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={() => setEditingId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">
                  {p.issueCount} {p.issueCount === 1 ? "issue" : "issues"}
                </span>
                {!isDemo && (
                  <>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => startEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
