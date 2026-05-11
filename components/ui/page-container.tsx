type Width = "narrow" | "default" | "wide"

const widths: Record<Width, string> = {
  narrow: "max-w-2xl",
  default: "max-w-3xl",
  wide: "max-w-[1120px]",
}

export function PageContainer({
  width = "default",
  children,
  className = "",
}: {
  width?: Width
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto ${widths[width]} px-6 py-8 md:px-8 ${className}`}>
      {children}
    </div>
  )
}
