"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Pencil, Trash2, Check, X, Archive, ArchiveRestore, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type ProjectRow = {
  id: string
  name: string
  issueCount: number
  openIssueCount: number
  doneActiveCount: number
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

type Props = {
  projects: ProjectRow[]
  isDemo?: boolean
  showArchived: boolean
}

export function ProjectList({ projects, isDemo, showArchived }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [archivingProject, setArchivingProject] = useState<ProjectRow | null>(null)
  const [archiveDone, setArchiveDone] = useState(true)
  const [isPending, startTransition] = useTransition()

  function toggleArchivedView() {
    const params = new URLSearchParams(searchParams.toString())
    if (showArchived) params.delete("showArchived")
    else params.set("showArchived", "true")
    router.push(`${pathname}?${params.toString()}`)
  }

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
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (!res.ok) {
      alert("Could not delete project. Move or delete its issues first.")
      return
    }
    router.refresh()
  }

  async function handleArchiveConfirm() {
    if (!archivingProject) return
    await fetch(`/api/projects/${archivingProject.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive", archiveDone }),
    })
    setArchivingProject(null)
    startTransition(() => router.refresh())
  }

  async function handleUnarchive(id: string) {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unarchive" }),
    })
    startTransition(() => router.refresh())
  }

  const hasOpenIssues = (archivingProject?.openIssueCount ?? 0) > 0

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-8 space-y-1">
        <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-accent">
          WORKSPACE / PROJECTS
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleArchivedView}
              className={`flex items-center gap-1.5 rounded-btn px-2.5 py-1 text-xs font-medium transition-colors ${
                showArchived
                  ? "bg-accent/20 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Archive className="h-3.5 w-3.5" />
              {showArchived ? "Viewing archived" : "Show archived"}
            </button>
            {!isDemo && !showArchived && (
              <Button size="sm" onClick={() => setCreating(true)}>
                New project
              </Button>
            )}
          </div>
        </div>
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
            {showArchived ? "No archived projects." : "No projects yet."}
          </div>
        )}

        {projects.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5">
            {!isDemo && !showArchived && editingId === p.id ? (
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
                  showArchived ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => handleUnarchive(p.id)}
                      title="Unarchive project"
                    >
                      <ArchiveRestore className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => startEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-accent"
                        onClick={() => { setArchivingProject(p); setArchiveDone(true) }}
                        title="Archive project"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Archive confirmation dialog */}
      <Dialog open={!!archivingProject} onOpenChange={(open) => { if (!open) setArchivingProject(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive &ldquo;{archivingProject?.name}&rdquo;?</DialogTitle>
          </DialogHeader>

          {hasOpenIssues && (
            <div className="flex gap-3 rounded-md border border-accent/30 bg-accent-subtle p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-foreground">
                <span className="font-medium">{archivingProject?.openIssueCount} open {archivingProject?.openIssueCount === 1 ? "issue" : "issues"}</span> will be archived along with this project.
              </p>
            </div>
          )}

          {!hasOpenIssues && (archivingProject?.doneActiveCount ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">
              All issues in this project are already archived. Ready to archive.
            </p>
          )}

          {(archivingProject?.doneActiveCount ?? 0) > 0 && (
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:bg-muted/50">
              <input
                type="checkbox"
                checked={archiveDone}
                onChange={(e) => setArchiveDone(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm">
                Also archive {archivingProject?.doneActiveCount} Done {archivingProject?.doneActiveCount === 1 ? "issue" : "issues"}
              </span>
            </label>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setArchivingProject(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleArchiveConfirm}
              disabled={isPending}
              className={hasOpenIssues ? "bg-accent hover:bg-accent-hover text-accent-foreground" : ""}
            >
              {hasOpenIssues ? "Archive anyway" : "Archive project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
