# Companies

One folder per company, named by `company_id` (kebab-case Latin brand name):

```text
companies/
└── <company-id>/
    ├── company.md            Stage 1 — from ../_templates/company.md
    ├── product-analysis.md   Stage 2 — from ../_templates/product-analysis.md
    ├── opportunities.md      Stage 3 — from ../_templates/opportunities.md
    ├── outreach.md           Stage 4 — from ../_templates/outreach.md
    └── evidence/             Optional screenshots of public pages
```

Create only the files for stages that have actually been reached. Check [`../registry.csv`](../registry.csv) for duplicates before creating a folder, and add or update the company's registry row in the same change.

Full rules: [discovery/README.md](../README.md).
