# Memory: index.md
Updated: just now

# Project Memory

## Core
React, react-router-dom to TanStack Start migration. Supabase backend.
`public.profiles` uses `id` for queries, NEVER `user_id`.
Enterprise navy/blue. High roundedness (cards 2xl-3xl, buttons xl). Max-widths: 1280px public, 1440px content, 1600px admin.
Dashboard architecture uses sidebar-led command centers (3-column layout). Unauthenticated users redirect to `/showcase/*`.
Admin endpoints strictly isolated. Meaningful writes require explicit entitlement checks and audit tracking.
Private authenticated routes must enforce no-index SEO rules.
Master Sign-Off Matrix at docs/qa/MASTER-SIGN-OFF-MATRIX.md is binding: no gate flips green without repo + data + UI + test evidence; reels = special priority.

## Memories
- [Master Sign-Off Matrix](mem://process/master-sign-off-matrix) — 13 binding release gates, evidence rules, domain→gate map
- [QA Framework Execution](mem://process/qa-framework-execution) — D01..D28 per-domain Run 1/2/3/4 handling
- [Frontend Stack](mem://tech/frontend-stack) — React/Router to TanStack Start migration, shell architecture
- [Branding & Design](mem://style/branding-and-design) — Enterprise navy/blue, reusable GigvoraLogo
- [Database Schema](mem://tech/database-schema) — Supabase profiles uses id vs user_id
- [Layout Architecture](mem://tech/layout-architecture) — DashboardLayout topStrip, mainCanvas, rightRail, bottomSection
- [Visual Posture](mem://style/visual-posture) — High roundedness, variable shell gutter, strict max-widths
- [Marketplace Differentiation](mem://features/marketplace-differentiation) — Gigs (productized) vs Services (consultative)
- [Governance & Safety](mem://tech/governance-and-safety) — Entitlement checks, audit tracking for writes
- [Creation Studio](mem://features/creation-studio) — Multi-step wizards and Block Editor for media
- [Enterprise Navigation](mem://features/enterprise-navigation) — Dashboard sidebar mapped to top-level domains
- [Shell Architecture](mem://tech/shell-architecture) — 3-column workstation layout, excluded from Feed/Jobs/Settings
- [Access Gating](mem://features/access-gating) — Free/Pro/Team/Enterprise tiers, EntitlementGate, PlanUpgradeDrawer
- [Overlay System](mem://tech/overlay-system) — Drawers, Inspectors, HoverCards, Popouts, Wizards
- [Governance Incident Mode](mem://features/governance-incident-mode) — Global emergency posture toggle
- [Security Authentication](mem://features/security-authentication) — Lockout thresholds, 4-rule password validation
- [Project Workspaces](mem://features/project-workspaces) — Internal vs Client-Visible execution views
- [Navigation Architecture](mem://features/navigation-architecture) — Global nav 8 intent categories
- [Profile System](mem://features/profile-system) — 11-tab profiles, social metrics, unified file upload
- [Privacy & Trust](mem://features/privacy-and-trust) — Recruiting privacy strictly contained to Recruiter Pro
- [Social Personality](mem://style/social-personality) — Avatars, status rings, hover-lift, staggered animations
- [Search & Command Center](mem://features/search-and-command-center) — ⌘K discovery across 10 categories
- [Admin Isolation](mem://tech/admin-isolation) — Strict internal vs public separation for admin routes
- [Shell Variants System](mem://tech/shell-variants-system) — Layout rules governing containment and spacing
- [User Roles](mem://features/user-roles) — User, Professional, Enterprise role mappings
- [Work Management Hub](mem://features/work-management-hub) — /work aggregation, InboxCounter, TaskTray
- [Commercial Builders](mem://features/commercial-builders) — 10-step draftable wizards for core objects
- [BYOK Integrations](mem://tech/byok-integrations) — Bring Your Own Key AI/CRM setup
- [Recruitment Unification](mem://features/recruitment-unification) — Unified /hire namespace for candidate management
- [Media Ecosystem](mem://features/media-ecosystem) — Reels, Video Center, Podcast monetization
- [Networking Hub](mem://features/networking-hub) — Business cards, relationship follow-up queues
- [Advanced Filtering System](mem://features/advanced-filtering-system) — AdvancedFilterPanel with 15-25 context filters
- [Navigation & Shortcuts](mem://features/navigation-and-shortcuts) — Mega menus, ⌘K, G+key, compact avatar dropdown
- [Global Management Pages](mem://features/global-management-pages) — Analytics, purchases, donations, pages centers
- [Admin Terminal Architecture](mem://tech/admin-terminal-architecture) — Isolated environment ribbon, operational dashboards
- [Experience Launchpad](mem://features/experience-launchpad) — /pathways, /challenges for early-talent cohorts
- [Messaging System](mem://features/messaging-system) — Multi-tab Chat Bubble, hidden on mobile
- [Navigation Standards](mem://style/navigation-standards) — Explicit back buttons, AutoBackNav, full-page events
- [Company Intelligence](mem://features/company-intelligence) — Deep operational and exec movement data
- [AI Workspace Suite](mem://features/ai-workspace-suite) — Gigvora AI, internal assistants, BYOK/Credits
- [Public Showcase Pages](mem://features/public-showcase-pages) — Unauthenticated redirect to public discovery pages
- [SEO & Metadata System](mem://tech/seo-and-metadata-system) — usePageMeta, PageSEO, strict no-indexing rules
- [System Status Page](mem://features/system-status-page) — /status public health monitoring
- [Mobile Optimization Strategy](mem://tech/mobile-optimization-strategy) — MobileDashboardNav, floating UI hidden
- [Auth Experience Design](mem://style/auth-experience-design) — Minimal aesthetic, Gigvora mark, no blue bg
- [Dashboard Architecture](mem://features/dashboard-architecture) — Sidebar-led command centers
