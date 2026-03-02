# Codex / Claude Strategy

## Goal

Use AI coding agents (Codex, Claude, Copilot) as
**mechanical implementers**, not designers.

The design documents are the source of truth.
Agents follow them exactly.

---

## Design Authority

The following documents are authoritative:

- docs/design.md
- docs/migration-philosophy.md

If an agent suggestion conflicts with these documents,
the documents win.

---

## Allowed Agent Responsibilities

Agents may:

- Scaffold files and folders
- Implement interfaces and helpers
- Add tests
- Apply repetitive refactors
- Implement new schema versions + migrations

Agents may NOT:

- Invent new public APIs
- Change architectural boundaries
- Introduce Firebase imports into core logic
- Remove schemaVersion or migrations

---

## Hard Constraints (repeat in prompts)

Always include this in agent prompts:

> Do not import Firebase anywhere except `src/adapters/**`.  
> Core and time utilities must be Firebase-free.

---

## Recommended Prompt Structure

1. State the phase (core, adapters, example, refactor)
2. Reference the design docs explicitly
3. Specify stopping points
4. Require tests and passing builds

---

## Example Prompt Snippet

```text
Treat docs/design.md and docs/migration-philosophy.md as authoritative.
Do not reinterpret them.

Implement migration helpers exactly as described.
Do not invent APIs.
Stop after tests pass.
Review Checklist After Agent Runs

 No Firebase imports in core/time

 schemaVersion present in persisted types

 Migrations are pure functions

 Domain objects use Date, not Timestamp

 pnpm test passes

 pnpm build passes

Why This Matters

Agents are fast but forgetful.
These documents provide:

Memory

Guardrails

Consistency
```
