import { db } from "@/db"
import { projects, issues } from "@/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { USER_ID } from "@/lib/auth"
import { getSession } from "@/lib/session"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ProjectLinks } from "@/components/project-links"
import { PageContainer } from "@/components/ui/page-container"
import { Eyebrow } from "@/components/ui/eyebrow"

type Props = { params: Promise<{ id: string }> }

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params

  const [session, project, issueCount] = await Promise.all([
    getSession(),
    db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.userId, USER_ID)),
    }),
    db.$count(issues, and(eq(issues.projectId, id), isNull(issues.archivedAt))),
  ])

  if (!project) notFound()

  const isDemo = session === "demo"

  const links: [{ url: string; label: string }, { url: string; label: string }, { url: string; label: string }] = [
    { url: project.link1Url ?? "", label: project.link1Label ?? "" },
    { url: project.link2Url ?? "", label: project.link2Label ?? "" },
    { url: project.link3Url ?? "", label: project.link3Label ?? "" },
  ]

  return (
    <PageContainer width="default">
      <Link
        href="/projects"
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Projects
      </Link>

      <div className="mb-3">
        <Eyebrow
          segments={[
            { label: "Scope", href: "/issues" },
            { label: "Projects", href: "/projects" },
            { label: project.name },
          ]}
        />
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{issueCount} open {issueCount === 1 ? "issue" : "issues"}</p>
        </div>
        <Link
          href={`/issues?project=${id}`}
          className="flex items-center gap-1.5 rounded-btn border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View issues
        </Link>
      </div>

      <div className="rounded-md border p-4">
        <ProjectLinks projectId={id} links={links} isDemo={isDemo} />
      </div>
    </PageContainer>
  )
}
