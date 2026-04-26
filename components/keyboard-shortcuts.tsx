"use client"

import { useEffect } from "react"

function isEditing() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || tag === "select" || (el as HTMLElement).isContentEditable
}

function dispatch(name: string, detail?: unknown) {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}

const STATUS_KEYS: Record<string, string> = {
  "1": "backlog",
  "2": "todo",
  "3": "in_progress",
  "4": "done",
}

export function KeyboardShortcuts() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isEditing()) return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case "c":
        case "C":
          dispatch("scope:create-issue")
          break
        case "e":
        case "E":
          e.preventDefault()
          dispatch("scope:edit-title")
          break
        case "?":
          dispatch("scope:show-help")
          break
        case "/":
          e.preventDefault()
          dispatch("scope:focus-filter")
          break
        default:
          if (STATUS_KEYS[e.key]) {
            dispatch("scope:set-status", STATUS_KEYS[e.key])
          }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return null
}
