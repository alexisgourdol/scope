"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IssueStatusIcon } from "@/components/issue-status-icon"
import { IssuePriorityIcon } from "@/components/issue-priority-icon"
import type { Issue, Project } from "@/db/schema"

const STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
]

const PRIORITIES = [
  { value: "none", label: "No priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

type IssueRow = Pick<Issue, "id" | "title" | "description" | "status" | "priority" | "projectId" | "createdAt" | "updatedAt">

export function IssueDetail({ issue, projects, isDemo }: { issue: IssueRow; projects: Project[]; isDemo?: boolean }) {
  const router = useRouter()
  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(issue.description ?? "")
  const [status, setStatus] = useState(issue.status)
  const [priority, setPriority] = useState(issue.priority)
  const [projectId, setProjectId] = useState(issue.projectId ?? "")
  const [editingDesc, setEditingDesc] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isDemo) return
    function onEditTitle() { titleRef.current?.focus(); titleRef.current?.select() }
    function onSetStatus(e: Event) {
      const value = (e as CustomEvent<string>).detail
      handleStatusChange(value)
    }
    document.addEventListener("scope:edit-title", onEditTitle)
    document.addEventListener("scope:set-status", onSetStatus)
    return () => {
      document.removeEventListener("scope:edit-title", onEditTitle)
      document.removeEventListener("scope:set-status", onSetStatus)
    }
  }, [isDemo]) // eslint-disable-line react-hooks/exhaustive-deps

  async function patch(fields: Record<string, unknown>) {
    await fetch(`/api/issues/${issue.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
    router.refresh()
  }

  async function handleTitleBlur() {
    if (title.trim() && title.trim() !== issue.title) {
      await patch({ title: title.trim() })
    }
  }

  async function handleDescriptionSave() {
    setEditingDesc(false)
    if (description !== (issue.description ?? "")) {
      await patch({ description: description || null })
    }
  }

  async function handleStatusChange(value: string) {
    setStatus(value as typeof status)
    await patch({ status: value })
  }

  async function handlePriorityChange(value: string) {
    setPriority(value as typeof priority)
    await patch({ priority: value })
  }

  async function handleProjectChange(value: string) {
    setProjectId(value)
    await patch({ projectId: value || null })
  }

  async function handleDelete() {
    await fetch(`/api/issues/${issue.id}`, { method: "DELETE" })
    router.push("/issues")
    router.refresh()
  }

  const currentProject = projects.find((p) => p.id === projectId)
  const statusLabel = STATUSES.find((s) => s.value === status)?.label ?? status
  const priorityLabel = PRIORITIES.find((p) => p.value === priority)?.label ?? priority

  const badgeClass = "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm"

  return (
    <div className="mx-auto max-w-3xl px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/issues" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Issues
        </Link>
        {!isDemo && (
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Title */}
      <textarea
        ref={titleRef}
        value={title}
        onChange={(e) => !isDemo && setTitle(e.target.value.slice(0, 200))}
        onBlur={() => !isDemo && handleTitleBlur()}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); titleRef.current?.blur() } }}
        readOnly={isDemo}
        rows={1}
        className={`mb-1 w-full resize-none bg-transparent text-2xl font-semibold leading-snug outline-none placeholder:text-muted-foreground ${isDemo ? "cursor-default" : ""}`}
        placeholder="Issue title"
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
      {!isDemo && 200 - title.length <= 40 && (
        <p className={`mb-3 text-right text-xs ${200 - title.length <= 10 ? "text-destructive" : "text-muted-foreground"}`}>
          {200 - title.length} characters left
        </p>
      )}

      {/* Metadata */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
        {isDemo ? (
          <>
            <span className={badgeClass}>
              <IssueStatusIcon status={status} />
              <span>{statusLabel}</span>
            </span>
            <span className={badgeClass}>
              <IssuePriorityIcon priority={priority} />
              <span>{priorityLabel}</span>
            </span>
            {currentProject && (
              <span className={badgeClass}>{currentProject.name}</span>
            )}
          </>
        ) : (
          <>
            {/* Status */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 hover:bg-muted transition-colors text-sm">
                <IssueStatusIcon status={status} />
                <span>{statusLabel}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {STATUSES.map((s) => (
                  <DropdownMenuItem key={s.value} onClick={() => handleStatusChange(s.value)} className="flex items-center gap-2">
                    <IssueStatusIcon status={s.value} />
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 hover:bg-muted transition-colors text-sm">
                <IssuePriorityIcon priority={priority} />
                <span>{priorityLabel}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {PRIORITIES.map((p) => (
                  <DropdownMenuItem key={p.value} onClick={() => handlePriorityChange(p.value)} className="flex items-center gap-2">
                    <IssuePriorityIcon priority={p.value} />
                    {p.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Project */}
            {projects.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 hover:bg-muted transition-colors text-sm">
                  <span>{currentProject?.name ?? "No project"}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleProjectChange("")}>No project</DropdownMenuItem>
                  {projects.map((p) => (
                    <DropdownMenuItem key={p.id} onClick={() => handleProjectChange(p.id)}>
                      {p.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        )}
      </div>

      {/* Description */}
      <div className="min-h-[120px]">
        {!isDemo && editingDesc ? (
          <textarea
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            onKeyDown={(e) => { if (e.key === "Escape") handleDescriptionSave() }}
            placeholder="Add a description… (markdown supported)"
            className="w-full min-h-[200px] resize-y bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
          />
        ) : (
          <div
            onClick={() => !isDemo && setEditingDesc(true)}
            className={`rounded-md p-1 -mx-1 transition-colors min-h-[80px] ${!isDemo ? "cursor-text hover:bg-muted/40" : ""}`}
          >
            {description ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            ) : !isDemo ? (
              <p className="text-sm text-muted-foreground">Add a description…</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
