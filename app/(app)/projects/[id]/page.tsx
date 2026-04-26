import { redirect } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  redirect(`/issues?project=${id}`)
}
