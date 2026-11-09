# Lead Research

> **Status:** PROPOSED · **Source:** Playbook v1.0 §5.3–5.4 · **Updated:** 2026-11-09
>
> **Related:** [Discovery data rules](../discovery/README.md) · [Company record template](../discovery/_templates/company.md) · [External resources](../references/external-resources.md)

## 1. Potential lead research sources

Suggested public starting points (their current content and accessibility must be checked):

- [Tehran Index — companies](https://tehranindex.com/companies): Iranian technology-company discovery.
- [Cafe Bazaar](https://cafebazaar.net/): Iranian Android apps, product categories, developers.
- [Myket](https://myket.ir/): Another Iranian Android-app discovery source.
- [LinkedIn](https://www.linkedin.com/): Company profiles and decision-maker identification.
- Official company websites, feature pages, app documentation, help centers, and public product demonstrations.

Avoid assuming access to any private product interface or dataset. Manual analysis of public-facing features is different from technical testing requiring customer consent.

## 2. Lead record: minimum fields

A company CRM record should include:

```text
company_id
company_name
website
product_name
product_url
segment
company_description
public_product_features
likely_buyer_role
verified_business_contact
contact_source
technical_integration_clues
hypothesized_customer_pain
prospect_score
research_evidence_urls
confidence_and_unknowns
outreach_status
last_contact_date
next_action
owner
```

### How these fields are implemented

The [company record template](../discovery/_templates/company.md) implements every field above. It also adds fields needed for the segment comparison and agent traceability: `company_name_fa`, `product_type`, `sub_category`, `company_size_estimate`, `score_status`, `blocker`, `discovered_by`, `discovered_on`, `last_updated`, and a per-criterion score breakdown. `outreach_status` is tracked as `pipeline_stage` using the stages in the [sales pipeline](sales-pipeline.md).
