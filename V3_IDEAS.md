# V3 Ideas — Scope

This file is the pressure release valve for scope creep. When I think of something cool to add mid-build, it goes here, not into V2. The point is to capture the idea so I don't lose it, then immediately get back to building V2.

Format: short bullet, no need to be precious. I can polish later if I actually pursue V3.

---

## Already Committed for Phase 3 (Post-V2)

These came out of the V2 planning conversation and are pre-loaded:

- **Google SSO** via Supabase Auth — replace placeholder auth. Portfolio narrative: "I implemented SSO migration." Architectural prep is already in V1 (every record has `user_id`).
- **Github SSO** via Supabase Auth — alternative to Google for tech users
- **GitHub integration** — link issues to commits/PRs by issue ID in commit message
- **Activity log** per issue (status changes over time)

---

## Captured During V1 / V2 Build

Anything thought of while building goes here. Don't filter — capture first, evaluate later.

- **Claude tester agent** — give Claude a way to "see" and interact with the live site for automated QA; meta/tooling, not a user feature
- **Latency / caching** — filtering feels slightly slow; measure before optimising, likely a Vercel cold-start or DB round-trip issue

---

## Themes Worth Exploring Eventually

Looser ideas. Not committed to anything; just brainstorming surface.

- **Drag-and-drop in list view** — reorder issues within a status group (Kanban has DnD; list view could too)
- **Separate demo view from Supabase** — to avoid showing the main contributor's projects and issues (started with dogfooding), have a separate data connection (possibly just an embedded sqlite ? ) for external visitors. Might be an item completely dropped if Google SSO is implemented easily.(mostly free once SSO is in)

- **Cmd+K command palette** — Linear's signature feature, deferred from V1/V2 because it wasn't load-bearing. Good demo of "look how easy it is to extend the keyboard system I built."
- **Multi-device by user** — same single user, but on phone and laptop with synced state (mostly free once SSO is in)
- **Issue templates** — pre-fill common issue types (bug report, feature request)
- **Inline issue creation** from the list view (press C, type title, enter — no modal)
- **Smarter filtering** — saved filters as named views
- **Keyboard navigation between issues** in the list (J/K to move, Enter to open)
- **Markdown toolbar** for description editing
- **Search** across issue titles and descriptions
- **Subtle animations** for status transitions (Linear-style polish)
- **Custom domains** for users — actually monetizable wedge

---

## Ideas Considered and Rejected

If I think about something, decide against it, log it here so I don't relitigate the decision.

-
