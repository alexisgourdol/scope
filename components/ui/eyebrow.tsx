import Link from "next/link"

export type EyebrowSegment = {
  label: string
  href?: string
}

export function Eyebrow({ segments }: { segments: EyebrowSegment[] }) {
  return (
    <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-accent">
      {segments.map((seg, i) => (
        <span key={i}>
          {seg.href ? (
            <Link
              href={seg.href}
              className="transition-colors hover:text-accent-hover"
            >
              {seg.label}
            </Link>
          ) : (
            <span className={i === segments.length - 1 ? "text-accent" : ""}>
              {seg.label}
            </span>
          )}
          {i < segments.length - 1 && (
            <span className="mx-1.5 text-accent/50" aria-hidden="true">
              /
            </span>
          )}
        </span>
      ))}
    </p>
  )
}
