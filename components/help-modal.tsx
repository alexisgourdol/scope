"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const SHORTCUTS = [
  { key: "C", description: "Create new issue" },
  { key: "E", description: "Edit issue title (on detail page)" },
  { key: "1", description: "Set status: Backlog (on detail page)" },
  { key: "2", description: "Set status: Todo (on detail page)" },
  { key: "3", description: "Set status: In Progress (on detail page)" },
  { key: "4", description: "Set status: Done (on detail page)" },
  { key: "/", description: "Focus project filter" },
  { key: "?", description: "Show this help" },
]

export function HelpModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handler() { setOpen((v) => !v) }
    document.addEventListener("scope:show-help", handler)
    return () => document.removeEventListener("scope:show-help", handler)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm">
          <tbody className="divide-y">
            {SHORTCUTS.map(({ key, description }) => (
              <tr key={key} className="flex items-center justify-between py-2">
                <td className="text-muted-foreground">{description}</td>
                <td>
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {key}
                  </kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  )
}
