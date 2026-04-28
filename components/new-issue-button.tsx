"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Project } from "@/db/schema"

const SELECT_CLASS =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"

const TITLE_MAX = 200

export function NewIssueButton({
  projects,
  isDemo,
  defaultProjectId,
}: {
  projects: Project[]
  isDemo?: boolean
  defaultProjectId?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("backlog")
  const [priority, setPriority] = useState("none")
  const [projectId, setProjectId] = useState(defaultProjectId ?? "")
  const [loading, setLoading] = useState(false)

  // inline project creation
  const [creatingProject, setCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [extraProjects, setExtraProjects] = useState<Project[]>([])
  const newProjectRef = useRef<HTMLInputElement>(null)

  const allProjects = [...projects, ...extraProjects]

  useEffect(() => {
    setProjectId(defaultProjectId ?? "")
  }, [defaultProjectId])

  useEffect(() => {
    if (isDemo) return
    function handler() { setOpen(true) }
    document.addEventListener("scope:create-issue", handler)
    return () => document.removeEventListener("scope:create-issue", handler)
  }, [isDemo])

  useEffect(() => {
    if (creatingProject) newProjectRef.current?.focus()
  }, [creatingProject])

  if (isDemo) return null

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setTitle("")
      setStatus("backlog")
      setPriority("none")
      setProjectId(defaultProjectId ?? "")
      setCreatingProject(false)
      setNewProjectName("")
      setExtraProjects([])
    }
  }

  async function handleCreateProject() {
    if (!newProjectName.trim()) { setCreatingProject(false); return }
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProjectName.trim() }),
    })
    if (res.ok) {
      const created = await res.json()
      setExtraProjects((prev) => [...prev, created])
      setProjectId(created.id)
    }
    setCreatingProject(false)
    setNewProjectName("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status, priority, projectId: projectId || null }),
    })
    setLoading(false)
    handleOpenChange(false)
    router.refresh()
  }

  const remaining = TITLE_MAX - title.length
  const nearLimit = remaining <= 40

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        New issue
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New issue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1">
              <Input
                placeholder="Issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                autoFocus
              />
              {nearLimit && (
                <p className={`text-right text-xs ${remaining <= 10 ? "text-destructive" : "text-muted-foreground"}`}>
                  {remaining} characters left
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT_CLASS}>
                  <option value="backlog">Backlog</option>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className={SELECT_CLASS}>
                  <option value="none">No priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Project</label>
              {creatingProject ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={newProjectRef}
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreateProject() }
                      if (e.key === "Escape") { setCreatingProject(false); setNewProjectName("") }
                    }}
                    className="h-8 text-sm"
                  />
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={handleCreateProject}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={() => { setCreatingProject(false); setNewProjectName("") }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={SELECT_CLASS}>
                    <option value="">No project</option>
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCreatingProject(true)}
                    className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + New
                  </button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || loading}>
                {loading ? "Creating…" : "Create issue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
