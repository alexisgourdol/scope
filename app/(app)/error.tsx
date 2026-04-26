"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-medium">Something went wrong.</p>
      <p className="text-xs text-muted-foreground">{error.message}</p>
      <Button size="sm" variant="outline" onClick={reset}>Try again</Button>
    </div>
  )
}
