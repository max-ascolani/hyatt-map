# Plans

This directory contains all project plans for the The Newporter Members Club project. Every plan follows a consistent structure to ensure thorough investigation, clear execution, and proper documentation.

## Directory Structure

```
plans/
  active/          Plans currently being worked on
  standby/         Plans paused (waiting for results, blocked, or deprioritized)
  archive/         Completed plans
  future_features/ Ideas and proposals not yet planned
```

## Naming Convention

All plan files use **lowercase** with a **date prefix**:

```
YYYY-MM-DD-short-description.md
```

Examples:
- `2026-02-27-interactive-competition-map.md`
- `2026-03-01-membership-tier-pricing.md`

## Plan Template

Every plan must follow this structure:

```markdown
# [Plan Title]

**Created:** YYYY-MM-DD
**Status:** active | standby | archived
**Type:** feature | research | infrastructure | strategy

## Context

Brief description of the problem, feature, or change. Why does this plan exist?
What is the expected outcome?

## Phase 0 — Investigation & Validation

- [ ] Task 1
- [ ] Task 2
- [ ] ...
- [ ] Update subsequent phases with findings

## Phase 1 — [Description]

- [ ] Task 1
- [ ] Task 2
- [ ] ...

## Phase N-1 — Testing & Review

- [ ] Review all deliverables
- [ ] Verify accuracy of data
- [ ] ...

## Phase N — Documentation & Cleanup

- [ ] Update reference/ if affected
- [ ] Verify all tasks checked off
- [ ] Move plan to plans/archive/
```

## Phase Rules

### Phase 0 — Investigation & Validation

Phase 0 is **always** the first phase. No building happens. Its purpose is to deeply understand the problem space and validate every assumption before work begins. Phase 0 must:

1. **Investigate extensively.** Read every relevant source, document, and reference. Don't skim — understand the full picture before proposing what to build.

2. **Test assumptions.** If the plan assumes "this data is available" or "this API supports X" — verify it. Never take anything for granted.

3. **Check for duplication.** Before proposing new deliverables — confirm that equivalent work doesn't already exist. Reuse first, create only when necessary.

4. **Audit subsequent phases.** Read through Phase 1+ with a critical eye:
   - Are there gaps? Steps that are vague or hand-wavy?
   - Are hard problems brushed over?
   - Are dependencies between phases clear?

5. **Surface blockers.** If Phase 0 reveals major issues — missing data, cost concerns, conflicting requirements — **stop and raise them** before proceeding.

6. **Update the plan.** After investigation, rewrite Phases 1+ with concrete details.

### Phase 1+ — Execution

These are the action phases. Rules:

- **Check off tasks as they're completed.** Each `- [ ]` becomes `- [x]` when done.
- **One phase at a time.** Complete and verify a phase before moving to the next.
- **If a phase reveals new work**, add tasks to the current or a future phase rather than doing undocumented work.

### Penultimate Phase — Testing & Review

The second-to-last phase is **always** a dedicated review:

- Verify all deliverables are complete and accurate
- Test any interactive/technical components
- Review data for errors or outdated information
- Get stakeholder feedback where needed

### Final Phase — Documentation & Cleanup

The last phase is **always** about wrapping up:

- [ ] Ensure all tasks across all phases are checked off
- [ ] Update any affected docs in `reference/`
- [ ] Remove any temporary files or scaffolding
- [ ] Move the plan file from `plans/active/` to `plans/archive/`

## Plan Lifecycle

```
active/     You're working on it right now
    |
    |--- (paused/blocked) ---> standby/
    |                              |
    |<-- (resumed) ---------------|
    |
    v
archive/    All phases complete, docs updated
```

- **Active -> Standby:** When work is paused — waiting for external results, blocked by another task, or temporarily deprioritized.
- **Standby -> Active:** When work resumes. Review Phase 0 findings first in case anything has changed.
- **Active -> Archive:** When every task in every phase is checked off and the final documentation phase is complete.

## Tips

- **Keep plans focused.** One plan = one deliverable or one workstream.
- **Be concrete.** "Research competitors" is bad. "Identify all private clubs within 15-minute drive of the Hyatt with their amenities and pricing" is good.
- **Link to files.** Reference specific paths so future readers can find relevant material quickly.
- **Record decisions.** When Phase 0 reveals multiple approaches, document why one was chosen over others.
- **Don't delete standby plans.** They contain valuable investigation work.
