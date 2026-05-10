const CONFIG = {
  none:    "bg-priority-none",
  low:     "bg-priority-low",
  medium:  "bg-priority-medium",
  high:    "bg-priority-high",
  urgent:  "bg-priority-urgent",
} as const

type Priority = keyof typeof CONFIG

export function IssuePriorityIcon({ priority }: { priority: string }) {
  const cls = CONFIG[priority as Priority] ?? CONFIG.none
  return <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${cls}`} />
}
