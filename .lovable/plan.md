

# Gigvora — Complete Enterprise Frontend Plan (All Phases)

This plan saves the **full detailed master plan** as `/src/docs/GIGVORA_MASTER_PLAN.md` and then implements across **15 phases** covering every feature, every page, every system.

---

## Deliverable 1: Master Plan .md File

A comprehensive markdown file (~3000+ lines) saved at `/src/docs/GIGVORA_MASTER_PLAN.md` containing:

- All 20 sections from the planning pack verbatim
- Complete route map (300+ URLs)
- Every dashboard widget per role
- Every page per domain
- Two-level top bar spec (top: logo, search, calendar, notifications, Creation Studio, Gigvora Ads, Recruiter Pro, Sales Navigator, Enterprise Connect, avatar; bottom: mega menu nav links)
- All mega menu contents
- Component inventory
- State inventory
- ML/AI touchpoints
- Real-time surfaces
- Video interview system
- Calendar system
- Advanced project management (in-project chat, multi-freelancer, pay dispersion, milestones, task delegation, objectives, finance tracking, escrow, disputes)
- Advanced gig management (full timeline, submissions, reviews, step updates, package builder, revisions)
- LinkedIn-level feed, profiles, pages, groups
- Support center, terms, privacy, about, user agreements
- Networking with built-in video

---

## Deliverable 2: Full 15-Phase Implementation

### Phase 1 — Foundation & Shells
- Design tokens (colors, typography, spacing, shadows)
- Tailwind config extension
- 3 layout shells: PublicShell, LoggedInPageShell, DashboardShell + AdminShell
- Two-level public top bar with mega menus (Product, Solutions, Discover, Pricing, Trust & Safety, Support)
- Two-level logged-in top bar (top row: logo, search, calendar, notifications, Creation Studio btn, Gigvora Ads btn, Recruiter Pro btn conditional, Sales Navigator btn conditional, Enterprise Connect btn, avatar; bottom row: Home, Network, Jobs, Projects, Gigs, Groups, Events, Media with mega menus)
- Avatar dropdown (View Dashboard, Role Switcher, Profile, Org Switch, Inbox, Billing, Settings, Help, Admin Console conditional, Logout)
- Role context provider (User/Client, Professional, Enterprise switching)
- Auth context provider
- Deep multi-column footer (Product, Solutions, Company, Legal incl Terms/Privacy/User Agreements, Support, Social)
- Routing scaffold for all 300+ routes
- Core component primitives (IconButton, MultiSelect, Combobox, SegmentedControl, Chip, EmptyState)

### Phase 2 — Landing Page & Public Pages
- 15-section landing page (hero with dual CTA, role pathway cards, social proof band, product ecosystem, jobs section, gigs section, projects section, recruiter/sales/enterprise section, networking with video section, creator/media section, ads/growth section, trust/escrow/safety section, pricing preview, testimonials, final CTA)
- About Us page
- Pricing page (full plan comparison: Free, Professional, Enterprise, Recruiter Pro, Sales Navigator)
- FAQ page (accordion)
- Terms and Conditions (full legal layout)
- Privacy Policy (full legal layout)
- User Agreements (full legal layout)
- Trust & Safety overview page
- Product Overview page
- 7 Solutions pages (Client, Professional, Enterprise, Recruiter, Agency, Advertiser, Creator)

### Phase 3 — Auth & Onboarding
- Sign In (email/password, Google, Apple social auth)
- Sign Up (role selection step, then details, terms checkbox)
- Forgot Password page
- Reset Password page
- Email Verification Prompt page
- Onboarding wizard (role-specific: profile setup, preferences, interests, first actions)
- Auth guards and protected routes
- Session management with Supabase/Lovable Cloud

### Phase 4 — LinkedIn-Level Feed & Social
- Post composer (text, image, video, article, poll, event share, rich toolbar, AI writing assist)
- Feed stream (infinite scroll, algorithm-ranked)
- Post card types: text, image gallery, video, article, poll, shared gig/project/job/event, repost
- Full interactions: like (with reaction types), comment (threaded), share, save, report, hide
- Comment system (threaded replies, likes on comments, mentions)
- Right sidebar: trending topics, suggested connections, upcoming events, recommended gigs/jobs
- Left sidebar: mini profile card, quick links
- Feed filtering tabs: All, Following, Opportunities, Events, Media
- Hashtag system, mention system
- Article editor (long-form content creation, rich text, embedded media)
- Content moderation flags

### Phase 5 — LinkedIn-Level Profiles, Pages & Groups
- **User/Professional profile**: banner, avatar, headline, location, verification badges, about, experience timeline, education, skills endorsements, portfolio grid, reviews/ratings, references, certifications, activity feed, contact info, availability status
- **Profile edit**: all fields, image upload, drag-reorder portfolio, privacy controls
- **Company page**: logo, banner, about, team size, industry, locations, services, culture section, jobs posted, projects, gigs offered, reviews, followers, posts feed
- **Company page management**: edit all, manage team members, post as company, analytics
- **Agency page**: similar to company + client portfolio, case studies, specializations, team profiles
- **Agency page management**: full editing, staffing portfolio
- **Groups**: discovery page, group detail (feed, members, events, files, about, rules), group creation, group management (moderation, member approval, settings, analytics), group feed with all post types
- **Public pages**: any entity can have a public-facing page
- **Profile Hub**: unified view of all user's profiles/pages/groups
- **Reviews page**: received/given reviews with filters
- **Portfolio page**: full-screen portfolio showcase
- **References page**: professional references
- **Verification Center**: identity/business/document verification flows
- **Visibility Settings**: granular privacy controls per section

### Phase 6 — Networking & Communication
- **Network page**: connections list, invitations (sent/received), suggested connections, people you may know (ML-powered), mutual connections
- **Speed networking**: lobby, matching, timed video sessions, follow-up prompts
- **Built-in video**: 1:1 video calls, group video calls, screen sharing, recording
- **Floating chat bubble**: bottom-right, unread badge, recent threads, quick reply, minimize/maximize, voice note quick send, AI draft assist, smooth animations, switch to full inbox
- **Unified Inbox**: full page, segmented tabs (All, Work, Hiring, Gigs/Orders, Sales, Support, Team), search, filters, unread/pinned/archived
- **Thread detail**: text messages, file attachments, emoji reactions, voice notes, image/video, AI assist, thread summary, call/video launch, task extraction, search within thread, pinned items, context card (linked order/project/job/lead/event), moderation tools
- **Shared Inbox**: enterprise team inbox with assignment, tags, internal notes
- **Compose overlay**: new message with contact search, templates
- **Call history**: voice/video call log with recordings
- **Meeting brief page**: AI-generated meeting summaries
- **Contacts/address book**: import, manage, tag, segment

### Phase 7 — Jobs, Recruitment & Recruiter Pro (Full ATS)
- **Jobs browse**: search, filters (location, type, salary, industry, remote), saved searches, alerts
- **Job detail**: full description, requirements, benefits, company info, similar jobs, apply CTA
- **Job create/edit**: rich form, AI description enrichment, requirements builder, screening questions
- **Job application flow**: multi-step (resume, cover letter, screening answers, portfolio), saved drafts
- **Application workspace**: applicant view of all applications with statuses
- **Recruiter Pro area** (own section, `/recruiter-pro/*`):
  - Recruiter dashboard with pipeline widgets
  - Talent search (advanced filters, boolean search, AI ranking, saved searches)
  - Candidate profile view (parsed CV, skills match, history, notes, tags, scorecards)
  - Talent pools (create, manage, segment, enrich)
  - Candidate pipeline (extensive kanban: sourced → screened → interviewed → offered → hired, custom stages)
  - Shortlist boards (per job, share with hiring team, compare candidates)
  - Outreach console (templates, sequences, tracking, response rates)
  - Interview planner (schedule, calendar integration, panel setup)
  - Interview calendar (availability, time zones, room booking)
  - Video interviews (live video, recorded video questions, playback, scoring)
  - Interview detail (agenda, participants, notes, scorecard)
  - Interview scorecard (criteria, ratings, comments, recommendation)
  - Offer/handoff page (offer letter builder, approval workflow, candidate communication)
  - Headhunter workspace (confidential searches, retained search management, client reporting)
  - Confidential search page (hidden company, NDA workflow)
  - Requisition management (create, approve, track, close)
  - Hiring collaboration (team comments, @mentions, activity log)
  - Pipeline analytics (time-to-hire, source effectiveness, stage conversion, diversity metrics)
  - ATS settings (custom stages, email templates, scoring criteria, team permissions)

### Phase 8 — Projects & Advanced Project Management
- **Projects browse**: search, filters (budget, duration, skills, category)
- **Project detail**: description, requirements, budget, timeline, deliverables, team, proposals CTA
- **Project create/edit**: rich form, milestones builder, deliverables, budget, team roles
- **Proposal create**: cover letter, approach, timeline, pricing, portfolio samples
- **Proposal review**: side-by-side compare, shortlist, accept/reject, counter-offer
- **Proposal compare**: table comparison of multiple proposals
- **Smart Match**: AI-powered freelancer/project matching with explanation
- **Project Workspace** (full project management suite):
  - Workspace home (overview, activity, quick actions)
  - Kanban board (drag-drop, custom columns, assignees, due dates, labels, filters)
  - Task list (hierarchy: objectives → milestones → tasks → subtasks, assignees, priorities, due dates, dependencies)
  - Task creation/detail (description, attachments, comments, time tracking, status updates)
  - Calendar/timeline (Gantt-style, milestone markers, deadline tracking)
  - In-project chat (threaded conversations, file sharing, @mentions, pinned messages)
  - In-project updates (activity feed, status updates, announcements)
  - Deliverable vault (file management, version control, approval status)
  - Team & roles (multi-freelancer management, role assignment, permissions)
  - Files page (all project files, folders, sharing, version history)
  - Milestones page (milestone tracking, completion %, linked tasks, payment triggers)
  - Approvals page (deliverable approvals, milestone sign-offs, change requests)
  - Submissions page (deliverable submissions, review queue, revision requests, step-by-step updates)
  - Budget page (budget tracking, spend by milestone, invoices, remaining funds)
  - Objectives page (project objectives, KRs, progress tracking)
  - Finance tracking (per-project P&L, payment schedule, escrow status)
  - Pay dispersion (multi-freelancer payment splitting, milestone-based releases, batch payments)
  - Escrow management (fund, hold, release per milestone, dispute triggers)
  - Dispute management (raise dispute, evidence, timeline, escalation, resolution)
  - Task delegation (assign to team members, workload view, capacity planning)
  - Archive page (completed projects, historical data)
  - Workspace templates (save/load project templates)
  - Risk flags (delayed milestones, budget overrun, blocked tasks)
  - Change requests (scope changes, budget adjustments, timeline extensions)

### Phase 9 — Gigs & Advanced Gig Management
- **Gigs browse**: search, filters (category, price, delivery time, seller level, rating)
- **Gig detail**: description, packages (basic/standard/premium), extras/add-ons, seller profile, reviews, FAQ, related gigs
- **Gig create/edit**: title, description, category, tags, package builder, pricing, delivery time, requirements, FAQ builder, gallery/video
- **Package builder**: 3-tier package editor, custom fields per tier, comparison table
- **Custom offer builder**: bespoke quotes for specific clients
- **Offer detail**: custom offer review, accept/negotiate/decline
- **Checkout/order start**: package selection, extras, requirements form, payment
- **Requirements form**: buyer fills detailed requirements after purchase
- **Advanced Gig Management** (full timeline system):
  - Orders center (all orders, filters by status, search)
  - Order detail (full timeline: ordered → requirements → in progress → delivered → revision → completed/disputed)
  - Step-by-step updates (seller posts progress updates visible to buyer)
  - Delivery center (submit deliverables, files, source files, preview)
  - Revision center (revision requests, revision count tracking, revision deliveries)
  - Submissions page (all submissions per order with timestamps, files, notes)
  - Reviews (buyer reviews seller, seller reviews buyer, response to reviews)
  - Gig analytics (impressions, clicks, orders, conversion rate, revenue, package performance, upsell performance, cancellation rate, response time)
  - Service catalogue page (enterprise: department-level service offerings)
  - Gig-to-project conversion (upgrade a gig order into a full project workspace)
  - Recurring/retained services (subscription-based gig packages)
  - Dispute flow per order (linked to escrow)

### Phase 10 — Sales Navigator (Full CRM, Own Area)
- **Sales Navigator area** (`/sales-navigator/*`):
  - Sales Navigator home (dashboard with pipeline, tasks, alerts)
  - Lead search (advanced filters: industry, company size, role, location, keywords, AI scoring)
  - Account search (company-level search with firmographic filters)
  - Prospect profile (detailed view: contact info, company, activity, mutual connections, engagement history, AI insights)
  - Account detail (company overview, key contacts, buying committee, engagement timeline, notes)
  - Buying committee view (map decision makers, influencers, champions, blockers per account)
  - Saved lead lists (create, manage, share, auto-update, export)
  - Saved account lists (same as leads but company-level)
  - Sequence manager (multi-step outreach: email, InMail, connection request, follow-up, with timing and conditions)
  - Outreach inbox (all outreach messages, replies, tracking, templates)
  - Relationship timeline (per contact/account: all touchpoints, meetings, messages, notes)
  - Relationship graph (visual network of connections to target accounts)
  - Conversion analytics (pipeline metrics, sequence performance, lead-to-opportunity, win rates)
  - Business card capture/scan (camera/upload, OCR, auto-create lead)
  - Event lead capture (scan attendees, tag by event, follow-up queue)
  - CRM tasks page (follow-up tasks, reminders, calendar integration)
  - Sales settings (pipeline stages, custom fields, team permissions, integrations)
  - Sales analytics dashboard (advanced: revenue attribution, forecast, territory, team performance)

### Phase 11 — Gigvora Ads (Google Ads-Level, Own Area)
- **Ads area** (`/ads/*`):
  - Ads Manager home (overview dashboard: spend, impressions, clicks, conversions, ROI)
  - Campaigns list (all campaigns with status, budget, performance metrics)
  - Campaign detail (settings, ad sets, ads, performance charts, audience breakdown)
  - Campaign builder (step-by-step: objective selection → audience → placements → budget/schedule → creatives → review/launch)
  - Objectives: awareness, consideration, conversion, app installs, lead generation, engagement
  - Ad sets/groups (targeting, placement, budget, schedule per group)
  - Audience builder (demographics, interests, behaviors, lookalikes, retargeting, custom audiences, exclusions)
  - Creative studio (ad creation: text ads, image ads, video ads, carousel, sponsored posts/jobs/gigs/projects, preview by placement)
  - Keyword planner (keyword research, search volume, competition, bid estimates, suggestions)
  - Search insights (trending searches, audience behavior, competitive analysis)
  - Ads analytics (detailed: CPC, CPM, CPA, CTR, ROAS, conversion funnel, A/B test results, attribution)
  - Billing & spend control (budget caps, payment methods, invoices, spend alerts, auto-pause rules)
  - Promoted content page (boost posts, articles, events)
  - Sponsored placement page (featured listings for gigs, jobs, projects, profiles)
  - Ad policies & guidelines
  - A/B testing (create variants, split traffic, statistical significance, winner selection)
  - Reporting (custom reports, scheduled exports, multi-campaign comparison)
  - **Note**: Ads are created in the Ads area, NOT in the dashboard. Dashboard Ads widgets show performance/management of existing campaigns.

### Phase 12 — Enterprise Connect (Own Area) & Enterprise Features
- **Enterprise Connect area** (`/enterprise-connect/*`):
  - Enterprise Connect home (discovery hub for startups, SMEs, partners, advisors)
  - Startup/SME showcase (public profile: pitch, traction, team, product, funding stage)
  - Showcase builder (create/edit showcase with sections, media, metrics)
  - Traction page (metrics dashboard: MRR, users, growth rate, milestones)
  - Business plan vault (upload, version, share with advisors/investors, AI summary)
  - Advisor marketplace (browse advisors by expertise, industry, availability)
  - Advisor detail (profile, reviews, rates, booking)
  - Feedback board (structured feedback from advisors, investors, peers)
  - Boardroom mode (private workspace for board meetings, documents, decisions)
  - Partnership requests (send/receive partnership proposals, terms, status tracking)
  - Alliance directory (browse potential partners, agencies, service providers)
  - Staffing portfolio board (available talent within org, skills matrix, capacity)
  - Client success timeline (per-client: onboarding → delivery → review → renewal)
  - Account health page (health scores, risk indicators, NPS, churn signals)
- **Organization management pages**:
  - Organization members (invite, roles, permissions, departments)
  - Seats & billing (seat management, plan, usage)
  - Permissions (granular RBAC, custom roles)
  - Shared workspaces (team collaboration spaces)
  - Department workspaces (per-department views)
  - Branding settings (logo, colors, email templates)
  - Integrations (third-party tool connections)
  - Workspace switching (multi-org support)

### Phase 13 — Finance, Escrow, Disputes & Billing
- **Finance Hub** (central finance page)
- **Wallet**: home, ledger (all transactions), top-up, withdraw
- **Escrow console**: active escrows, fund, hold, release (full/partial), milestone-linked releases, dispute triggers
- **Release queue**: pending releases, approval workflow
- **Disputes board**: all disputes, filters by status/type, assignment
- **Dispute detail**: full timeline (created → evidence → review → escalation → arbitration → resolution), evidence submission (text, files, screenshots), messages between parties, admin intervention, financial impact view, resolution options
- **Refund queue**: pending refunds, approval, processing
- **Invoices center**: all invoices, filters, search
- **Invoice detail**: line items, payment status, download PDF
- **Subscription plans**: current plan, upgrade/downgrade, feature comparison
- **Billing settings**: payment methods, auto-renewal, billing address
- **Commission policy page**: transparent commission rates by category
- **Payout settings**: bank accounts, payout schedule, minimum threshold
- **Tax center**: tax documents, withholding settings, W-9/W-8 management
- **Credits wallet**: proposal credits, AI credits, posting credits, purchase, usage history

### Phase 14 — Community, Events, Media & Creator Tools
- **Groups**: discovery, detail (feed, members, events, files, rules, moderation), creation, management, analytics
- **Events**: directory, detail (agenda, speakers, sponsors, attendees, location/virtual link), RSVP flow, host console (manage event, check-ins, analytics), event calendar (personal + team)
- **Speed networking events**: lobby, matching algorithm, timed sessions, follow-up
- **Podcasts**: shows directory, show detail, episode page, audio player, podcast recorder/creator studio, podcast library/album management
- **Webinars**: discovery, detail, registration flow, live room (video, chat, Q&A, polls, screen share, recording), replay library, host studio
- **Live rooms**: spontaneous live sessions, audience participation, reactions
- **Clips library**: short-form video clips from webinars/podcasts
- **Session analytics**: views, engagement, retention, audience demographics
- **Creator profile**: dedicated creator page with all content, followers, analytics
- **Creation Studio** (content creation hub): drafts, scheduled posts, media asset library, AI writing tools, AI image generation, published content analytics, content calendar

### Phase 15 — Support, Admin, Calendar & Advanced Systems
- **Support Center**: help article directory, search, categories
- **Help article page**: rich content, related articles, feedback (helpful/not)
- **Ticket submission**: form with category, priority, attachments
- **My tickets**: list with status tracking
- **Ticket detail**: conversation thread, status updates, resolution
- **Trust Center**: platform trust overview, certifications
- **Calendar page**: month/week/day views, events, interviews, deadlines, milestones, tasks, integrated with all modules
- **Command search overlay** (Cmd+K): global search across all entities
- **Notifications center**: tabs (All, Mentions, Messages, Jobs, Gigs, Projects, Network, System), mark read, preferences
- **Admin area** (`/admin/*`):
  - Overview (platform health, alerts, queue counts, risk, transactions, live incidents)
  - User management (search, review, role review, bans, impersonation)
  - Moderation queue (reported posts/messages/media, ML flags, action history)
  - Trust & Safety (fraud cases, scam detection, repeat offenders, behavior graph, appeals)
  - Finance ops (payout review, refund queue, escrow holds, dispute payouts, billing anomalies)
  - Support ops (ticket queue, SLA board, escalations, macros, resolution analytics)
  - Verification queue (identity, business, document verification, trust badge decisions)
  - Ads ops (ad review, keyword policy, billing review, suspicious traffic)
  - Platform ops (runtime health, release controls, queue monitoring, websocket health, storage, system banners)
  - Feature flags (features, experiments, rollout control, beta groups)
  - Audit logs (all admin actions, filters by actor/object/time/severity)
  - Settings (policy, moderation rules, retention, security, platform config)
- **Consent settings**, **Security settings**, **Compliance alerts**, **Governance case log**, **Appeals page**
- **ML/AI integration points**: recommendation explanations, AI assist surfaces, provider settings, usage visibility

---

## Technical Architecture

### File Organization
```text
src/
  components/
    layout/          — PublicShell, LoggedInShell, DashboardShell, AdminShell, TwoLevelTopBar, Footer
    navigation/      — MegaMenu, AvatarDropdown, RoleSwitcher, DashboardTabMenu, CommandSearch
    feed/            — PostComposer, PostCard, FeedStream, ArticleEditor
    profile/         — ProfileView, ProfileEdit, CompanyPage, AgencyPage, GroupComponents
    inbox/           — FloatingChat, InboxList, ThreadDetail, SharedInbox, ComposeOverlay
    jobs/            — JobBrowse, JobDetail, JobForm, ApplicationFlow
    recruiter/       — TalentSearch, CandidateProfile, Pipeline, Scorecard, InterviewComponents
    projects/        — ProjectBrowse, ProjectDetail, Workspace, Kanban, TaskList, Timeline
    gigs/            — GigBrowse, GigDetail, GigForm, PackageBuilder, OrderFlow, DeliveryCenter
    sales/           — LeadSearch, AccountSearch, ProspectProfile, SequenceManager, RelationshipGraph
    ads/             — CampaignBuilder, AudienceBuilder, CreativeStudio, KeywordPlanner, AdsAnalytics
    enterprise/      — ShowcaseBuilder, TractionPage, AdvisorMarketplace, Boardroom
    finance/         — Wallet, EscrowConsole, DisputeDetail, InvoiceCenter, BillingSettings
    community/       — GroupDetail, EventDetail, PodcastPlayer, WebinarRoom, CreationStudio
    support/         — SupportCenter, TicketForm, HelpArticle
    admin/           — AdminOverview, ModerationQueue, UserManagement, FinanceOps, AuditLogs
    dashboard/       — DashboardWidgets, KPICard, WidgetGrid (per role)
    common/          — All reusable primitives, surface cards, data components
  pages/             — One file per route, organized by domain subfolder
  contexts/          — AuthContext, RoleContext, ThemeContext, ChatContext, NotificationContext
  hooks/             — useAuth, useRole, useCommandSearch, useFloatingChat, useRealtime, useInfiniteScroll
  types/             — All TypeScript interfaces organized by domain
  data/              — Mock data for all surfaces
  docs/              — GIGVORA_MASTER_PLAN.md
  lib/               — Utilities, API helpers, constants
```

### Key Patterns
- Role context drives all conditional UI (dashboard menus, top bar buttons, page access)
- Every surface supports: loading, empty, filtered empty, error, stale, archived, paused, restricted, permission denied, unavailable, syncing, disconnected states
- Mock data throughout for high-fidelity UI before backend integration
- Responsive across all breakpoints (mobile hamburger menu, tablet adaptations, desktop full experience)
- Real-time ready (Socket.IO hooks, optimistic updates, reconnect states, presence indicators)

---

## Build Order for Phase 1

1. Save `/src/docs/GIGVORA_MASTER_PLAN.md` (complete document)
2. Design tokens + Tailwind config
3. Core primitives (IconButton, MultiSelect, Combobox, SegmentedControl, Chip, EmptyState)
4. PublicShell + two-level public top bar + all mega menus
5. Footer (deep multi-column)
6. Landing page (all 15 sections)
7. Public pages (About, Pricing, FAQ, Terms, Privacy, User Agreements, Trust & Safety, Support, Product, Solutions x7)
8. Auth pages (Sign In, Sign Up with role selection, Forgot/Reset Password, Verification)
9. LoggedInPageShell + two-level logged-in top bar + avatar dropdown + role switcher
10. Feed/Home page (LinkedIn-level with all post types and interactions)
11. Basic profile pages (user, professional, company, agency)
12. Inbox + floating chat bubble
13. Notification center
14. DashboardShell + role-aware tab menus (all 4 roles)
15. Calendar page
16. Command search overlay
17. Route scaffold for all 300+ routes

