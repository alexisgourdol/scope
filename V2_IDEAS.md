# V2 Ideas — Scope

This file is the pressure release valve for scope creep. When I think of something cool to add mid-build, it goes here, not into V1. The point is to capture the idea so I don't lose it, then immediately get back to building V1.

Format: short bullet, no need to be precious. I can polish later if I actually pursue V2.

---

## Already Committed for Phase 2 (Post-V1)

These came out of the planning conversation and are pre-loaded:

- **Google SSO** via Supabase Auth — replace placeholder auth. Portfolio narrative: "I implemented SSO migration." Architectural prep is already in V1 (every record has user_id).
- **Cmd+K command palette** — Linear's signature feature, deferred from V1 because it wasn't load-bearing. Good demo of "look how easy it is to extend the keyboard system I built."

---

## Captured During V1 Build

Anything I think of while building goes here. Don't filter — capture first, evaluate later.

- **Kanban view** — gap-closing feature vs Linear; significant new view
- **Archive issues** — Done issues clutter the list over time; auto-archive after 14 days of inactivity
- **Project links** — attach up to 3 URLs (GitHub, docs, etc.) with optional label to a project; needs new DB columns + UI section
- **Claude tester agent** — give Claude a way to "see" and interact with the live site for automated QA; meta/tooling, not a user feature
- **Latency / caching** — filtering feels slightly slow; measure before optimising, likely a Vercel cold-start or DB round-trip issue

---

## Themes Worth Exploring Eventually

Looser ideas. Not committed to anything; just brainstorming surface.

- **Multi-device by user** — same single user, but on phone and laptop with synced state (this is mostly free once SSO is in)
- **Issue templates** — pre-fill common issue types (bug report, feature request)
- **Drag-and-drop status changes** in the list view
- **Inline issue creation** from the list view (press C, type title, enter — no modal)
- **Smarter filtering** — saved filters as named views
- **Bulk actions** — select multiple issues, change status/project together
- **Keyboard navigation between issues** in the list (J/K to move, Enter to open)
- **Activity log** per issue (status changes over time)
- **GitHub integration** — link issues to commits/PRs by issue ID in commit message
- **Markdown toolbar** for description editing
- **Search** across issue titles and descriptions
- **Subtle animations** for status transitions (Linear-style polish)
- **Custom domains** for users — actually monetizable wedge

---

## Ideas Considered and Rejected

If I think about something, decide against it, log it here so I don't relitigate the decision.

-
