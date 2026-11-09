# Conventions & Status Labels

> **Status:** Reference · **Source:** Playbook v1.0 document-status note & Appendix B · **Updated:** 2026-11-09

## Document status

These documents are a strategy and execution working set, **not** a validated market study or a final legal/financial plan.

- Items tagged **DECIDED** reflect explicit choices made by the founder.
- Items tagged **PROPOSED**, **HYPOTHESIS**, or **TO VALIDATE** are recommendations or assumptions that must be tested.

## Assumption labels

| Label | Meaning |
|---|---|
| **DECIDED** | A strategic preference selected by ENSA's founder. It may change after evidence, but currently guides planning. |
| **PROPOSED** | An operating practice or package recommended for initial testing. |
| **HYPOTHESIS** | A claim about buyer behavior, ROI, cost, pricing, or segment attractiveness that requires evidence. |
| **TO VALIDATE** | An unresolved point that must be verified before financial commitments, public claims, or production deployment. |
| **TO DECIDE** | A canvas block or choice still awaiting a founder decision. |

### What counts as validation

A proposition becomes meaningfully validated when supported by observable facts such as buyer interviews, written approvals, paid engagements, measured agent outcomes, actual vendor quotations, code/integration tests, or authoritative professional/legal advice.

## Currency and pricing

- Currency amounts refer to **millions of Iranian toman** (written **M**), unless noted otherwise.
- All prices exclude applicable taxes and third-party usage costs unless a signed quotation says otherwise.
- Price ranges are **launch hypotheses**, not verified Iranian market benchmarks.

## Document header convention

Every document in `docs/` (outside `discovery/` and `templates/`) starts with a header like:

```markdown
# Title

> **Status:** <label> · **Source:** Playbook v1.0 §<n> · **Updated:** YYYY-MM-DD
>
> **Related:** [Other doc](path.md) · ...
```

- Update the **Updated** date whenever the content changes.
- **Source** points to the section of the original [Playbook v1.0](../references/source/ENSA_AI_Business_Model_Canvas_and_Operating_Playbook_v1.0.md) the content came from. New content can say `Source: new` or name the evidence.
- Discovery records use YAML frontmatter instead — see [discovery/README.md](../discovery/README.md).

## Dates and names

- Use ISO dates (`YYYY-MM-DD`, Gregorian). Add Solar Hijri dates in parentheses where a source uses them (e.g. figures for 1405).
- File and folder names: lowercase kebab-case, Latin characters.
