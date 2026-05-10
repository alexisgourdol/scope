"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Check, X, Link as LinkIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type LinkSlot = { url: string; label: string }

type Props = {
  projectId: string
  links: [LinkSlot, LinkSlot, LinkSlot]
  isDemo?: boolean
}

export function ProjectLinks({ projectId, links: initialLinks, isDemo }: Props) {
  const router = useRouter()
  const [links, setLinks] = useState(initialLinks)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [draftUrl, setDraftUrl] = useState("")
  const [draftLabel, setDraftLabel] = useState("")

  function startEdit(idx: number) {
    setEditingIdx(idx)
    setDraftUrl(links[idx].url)
    setDraftLabel(links[idx].label)
  }

  function cancelEdit() {
    setEditingIdx(null)
    setDraftUrl("")
    setDraftLabel("")
  }

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim()
    if (!trimmed) return ""
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    return `https://${trimmed}`
  }

  async function saveEdit(idx: number) {
    const next: [LinkSlot, LinkSlot, LinkSlot] = [...links] as [LinkSlot, LinkSlot, LinkSlot]
    next[idx] = { url: normalizeUrl(draftUrl), label: draftLabel.trim() }
    setLinks(next)
    setEditingIdx(null)
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "links",
        link1Url: next[0].url || null,
        link1Label: next[0].label || null,
        link2Url: next[1].url || null,
        link2Label: next[1].label || null,
        link3Url: next[2].url || null,
        link3Label: next[2].label || null,
      }),
    })
    router.refresh()
  }

  async function removeLink(idx: number) {
    const next: [LinkSlot, LinkSlot, LinkSlot] = [...links] as [LinkSlot, LinkSlot, LinkSlot]
    next[idx] = { url: "", label: "" }
    setLinks(next)
    await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "links",
        link1Url: next[0].url || null,
        link1Label: next[0].label || null,
        link2Url: next[1].url || null,
        link2Label: next[1].label || null,
        link3Url: next[2].url || null,
        link3Label: next[2].label || null,
      }),
    })
    router.refresh()
  }

  const filledCount = links.filter((l) => l.url).length
  const nextEmpty = links.findIndex((l) => !l.url)
  const canAdd = !isDemo && nextEmpty !== -1 && editingIdx === null

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Links</span>
      </div>

      <div className="space-y-1">
        {links.map((link, idx) => {
          if (!link.url && editingIdx !== idx) return null

          if (editingIdx === idx) {
            return (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  autoFocus
                  placeholder="https://..."
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(idx)
                    if (e.key === "Escape") cancelEdit()
                  }}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Label (optional)"
                  value={draftLabel}
                  onChange={(e) => setDraftLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(idx)
                    if (e.key === "Escape") cancelEdit()
                  }}
                  className="h-8 w-36 text-sm"
                />
                <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={() => saveEdit(idx)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          }

          return (
            <div key={idx} className="group flex items-center gap-2">
              <a
                href={/^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {link.label || link.url}
              </a>
              {!isDemo && (
                <span className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => startEdit(idx)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeLink(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </span>
              )}
            </div>
          )
        })}

        {filledCount === 0 && editingIdx === null && (
          <p className="text-sm text-muted-foreground">No links yet.</p>
        )}

        {canAdd && (
          <button
            onClick={() => startEdit(nextEmpty)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add link
          </button>
        )}
      </div>
    </div>
  )
}
