"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IssuePriorityIcon } from "@/components/issue-priority-icon"
import { IssueStatusIcon } from "@/components/issue-status-icon"

const STATUS_ORDER = ["backlog", "todo", "in_progress", "done"] as const
type Status = (typeof STATUS_ORDER)[number]

const STATUS_LABELS: Record<Status, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
}

type IssueRow = {
  id: string
  title: string
  status: string
  priority: string
  updatedAt: Date
  archivedAt: Date | null
  projectName: string | null
}

function KanbanCard({
  issue,
  isDragging = false,
}: {
  issue: IssueRow
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: issue.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-md border bg-background p-3 shadow-sm transition-shadow ${
        isDragging ? "opacity-50 shadow-card" : "cursor-grab hover:shadow-card active:cursor-grabbing"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <IssuePriorityIcon priority={issue.priority} />
        <Link
          href={`/issues/${issue.id}`}
          onClick={(e) => e.stopPropagation()}
          className="line-clamp-2 flex-1 text-sm font-medium leading-snug hover:text-accent"
        >
          {issue.title}
        </Link>
      </div>
      {issue.projectName && (
        <p className="pl-[18px] text-xs text-muted-foreground">{issue.projectName}</p>
      )}
    </div>
  )
}

function KanbanColumn({
  status,
  label,
  issues,
  isOver,
}: {
  status: Status
  label: string
  issues: IssueRow[]
  isOver: boolean
}) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <IssueStatusIcon status={status} />
        <h2 className="text-sm font-medium">{label}</h2>
        <span className="rounded-pill bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {issues.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-lg border p-2 transition-colors ${
          isOver ? "border-accent/50 bg-accent/5" : "border-border bg-muted/30"
        }`}
      >
        <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <KanbanCard key={issue.id} issue={issue} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function KanbanView({ issues: initialIssues }: { issues: IssueRow[] }) {
  const router = useRouter()
  const [issues, setIssues] = useState(initialIssues)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<Status | null>(null)
  const [, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const activeIssue = activeId ? issues.find((i) => i.id === activeId) : null

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragOver({ over }: DragOverEvent) {
    if (!over) { setOverColumn(null); return }
    // over.id is either a column status or another card's id
    const col = STATUS_ORDER.find((s) => s === over.id)
    if (col) {
      setOverColumn(col)
    } else {
      const overIssue = issues.find((i) => i.id === over.id)
      setOverColumn(overIssue ? (overIssue.status as Status) : null)
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    setOverColumn(null)
    if (!over) return

    const activeIssue = issues.find((i) => i.id === active.id)
    if (!activeIssue) return

    // Determine target column: over could be a column id or a card id
    const targetCol = STATUS_ORDER.find((s) => s === over.id)
      ?? (issues.find((i) => i.id === over.id)?.status as Status | undefined)

    if (!targetCol) return

    const sameColumn = activeIssue.status === targetCol

    if (sameColumn) {
      // Reorder within column
      setIssues((prev) => {
        const colItems = prev.filter((i) => i.status === targetCol)
        const others = prev.filter((i) => i.status !== targetCol)
        const oldIdx = colItems.findIndex((i) => i.id === active.id)
        const newIdx = colItems.findIndex((i) => i.id === over.id)
        if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return prev
        return [...others, ...arrayMove(colItems, oldIdx, newIdx)]
      })
    } else {
      // Move to different column
      setIssues((prev) =>
        prev.map((i) => (i.id === activeIssue.id ? { ...i, status: targetCol } : i))
      )
      fetch(`/api/issues/${activeIssue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetCol }),
      }).then(() => startTransition(() => router.refresh()))
    }
  }

  const columns = STATUS_ORDER.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    items: issues.filter((i) => i.status === s),
  }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ status, label, items }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            issues={items}
            isOver={overColumn === status}
          />
        ))}
      </div>

      <DragOverlay>
        {activeIssue ? (
          <div className="w-64 rounded-md border bg-background p-3 shadow-card opacity-90">
            <div className="mb-2 flex items-center gap-2">
              <IssuePriorityIcon priority={activeIssue.priority} />
              <span className="line-clamp-2 flex-1 text-sm font-medium leading-snug">
                {activeIssue.title}
              </span>
            </div>
            {activeIssue.projectName && (
              <p className="pl-[18px] text-xs text-muted-foreground">{activeIssue.projectName}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
