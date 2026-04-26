import { Circle, CircleDot, CircleCheckBig } from "lucide-react"

const CONFIG = {
  backlog: { icon: Circle, className: "text-gray-400" },
  todo: { icon: Circle, className: "text-gray-600" },
  in_progress: { icon: CircleDot, className: "text-amber-500" },
  done: { icon: CircleCheckBig, className: "text-green-500" },
} as const

type Status = keyof typeof CONFIG

export function IssueStatusIcon({ status }: { status: string }) {
  const { icon: Icon, className } = CONFIG[status as Status] ?? CONFIG.backlog
  return <Icon className={`h-4 w-4 flex-shrink-0 ${className}`} />
}
