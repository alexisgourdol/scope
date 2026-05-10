const CONFIG = {
  none: "bg-muted-foreground/30",
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-orange-500",
  urgent: "bg-red-500",
} as const

type Priority = keyof typeof CONFIG

export function IssuePriorityIcon({ priority }: { priority: string }) {
  const cls = CONFIG[priority as Priority] ?? CONFIG.none
  return <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-sm ${cls}`} />
}
