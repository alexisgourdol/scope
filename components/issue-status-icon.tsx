import { Circle, CircleDot, CircleCheckBig } from "lucide-react"

const CONFIG = {
  backlog:     { icon: Circle,         className: "text-status-backlog" },
  todo:        { icon: Circle,         className: "text-status-todo" },
  in_progress: { icon: CircleDot,      className: "text-status-progress" },
  done:        { icon: CircleCheckBig, className: "text-status-done" },
} as const

type Status = keyof typeof CONFIG

export function IssueStatusIcon({ status }: { status: string }) {
  const { icon: Icon, className } = CONFIG[status as Status] ?? CONFIG.backlog
  return <Icon className={`h-4 w-4 flex-shrink-0 ${className}`} />
}
