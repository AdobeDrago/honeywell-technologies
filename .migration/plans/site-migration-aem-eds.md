# Full Site Migration to AEM Edge Delivery Services (Document Authoring)

## Overview
- **Scope:** Full site — discover all URLs, group into page templates, migrate by template.
- **Project type:** Document Authoring (da.live).
- **Design approach:** Match the original site closely (extract design tokens and per-block styles).
- **Source URL:** `https://honeywellbt.stage.honeywell.com/us/en`

## Prerequisites
- [ ] Confirm/auto-detect project type and the project-specific Block Library endpoint.
- [ ] Verify the local preview environment renders content correctly.
- [ ] Confirm access to the staging source (it is a `*.stage.honeywell.com` host — check it is reachable and does not require auth/VPN for crawling).

## Phase 1 — Discovery & Scope
- [ ] Discover all site URLs under `/us/en` (via sitemap or crawl).
- [ ] Analyze pages and group similar ones into page templates.
- [ ] Produce a site catalog (page templates with names, URLs, descriptions).
- [ ] Generate a migration scope report (templates, block inventory, page counts).
- [ ] Review the catalog together and confirm which templates to migrate.

## Phase 2 — Page & Block Analysis
- [ ] For each template, analyze a representative page's content structure and sections.
- [ ] Identify required block variants and authoring decisions.
- [ ] Detect reusable existing blocks vs. new block variants needed.
- [ ] Map DOM selectors to block variants in the page templates.

## Phase 3 — Import Infrastructure
- [ ] Generate block parsers for each block variant.
- [ ] Generate page transformers (cleanup, sections, media handling).
- [ ] Build the bundled import script for the discovered templates.
- [ ] Validate the page-template schema.

## Phase 4 — Content Import
- [ ] Run the import per template across all matched URLs.
- [ ] Produce content documents in the content workspace.
- [ ] Verify imported content renders in the preview.

## Phase 5 — Design Migration (Match Original)
- [ ] Extract global design tokens (colors, typography, spacing) from the source.
- [ ] Apply site-level styling.
- [ ] Style each block variant to match the original, with visual verification.

## Phase 6 — Navigation & Footer
- [ ] Migrate and instrument the header/navigation (desktop, mobile, megamenu as applicable).
- [ ] Migrate and instrument the footer.
- [ ] Validate nav and footer structure against the original.

## Phase 7 — Visual Critique & QA
- [ ] Run full-site visual critique comparing migrated pages against originals.
- [ ] Fix styling and structural discrepancies.
- [ ] Spot-check representative pages per template in the preview.

## Checklist
- [ ] Prerequisites: project type/Block Library confirmed and source reachable
- [ ] Phase 1: Discovery & scope catalog complete and reviewed
- [ ] Phase 2: Page/block analysis and mappings complete
- [ ] Phase 3: Import infrastructure generated and validated
- [ ] Phase 4: Content imported and verified in preview
- [ ] Phase 5: Design tokens and block styling applied to match original
- [ ] Phase 6: Navigation and footer migrated and validated
- [ ] Phase 7: Full-site visual critique and QA fixes complete

> Note: Execution requires Execute mode. The source URL (`https://honeywellbt.stage.honeywell.com/us/en`) is now set — approve this plan and switch to Execute mode to begin Phase 1 (Discovery & Scope).
