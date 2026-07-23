# Solution Design and Prototype

## Architecture Overview

The recommended solution is not a single product purchase but a composed system of four
layers, each doing only what it does best. Neither licensed tool is the deliverable on its
own: Sprout Social produces dashboards that still require interpretation, and Claude has no
social data without Sprout. The value is created by closing the loop between them — signal
in, decision out.

**Layer 1 — Data and listening (Sprout Social Advanced + Social Listening add-on).**
Sprout centralizes publishing, engagement, analytics, competitor tracking, and web-wide
social listening across Instagram, Facebook, and TikTok into a single environment (Sprout
Social, 2026). This layer directly closes the data-fragmentation half of the root cause.

**Layer 2 — Connective orchestration (Make.com, or equivalently n8n or a scheduled
script).** The orchestrator authenticates to Sprout's Analytics API on a schedule or trigger,
packages the returned metrics and listening data, calls the Claude API, and routes the
output to where the team already works. This layer is structural rather than convenient: it is
what keeps data moving programmatically instead of through the manual exports the
solution exists to eliminate.

**Layer 3 — Reasoning and decision support (Claude).** Claude interprets what Sprout
surfaces — synthesizing competitive insight, flagging content gaps, explaining what changed
and why, drafting recommended actions, and producing on-brand content options for review
(Anthropic, 2026). This layer closes the insight-fragmentation half of the root cause.

**Layer 4 — Human decision layer (RYOBI's marketing team).** The team decides, creates,
approves, and publishes. Results flow back into Sprout for measurement, and the loop
repeats. No content reaches an audience without a named human approving it.

## How the Pipeline Runs

The pipeline executes on a schedule or event trigger in three steps:

1. **Pull.** The orchestrator authenticates to Sprout's Analytics API and requests the
   relevant performance metrics and listening data for the defined KPI pillars and
   competitor watchlist.
2. **Analyze.** It packages that data into a Claude API call, which returns a plain-language
   synthesis of what changed, why it changed, and what to act on.
3. **Deliver.** The output lands in the tools the team already uses — Slack, email, or a
   report — before anyone thinks to ask for it.

The orchestrator is not an optional convenience. The Claude API is a reasoning endpoint,
not an integration layer: it cannot pull from Sprout, run on a schedule, or deliver output on
its own (Anthropic, 2023). Removing the orchestrator would reintroduce a human as the
integration layer, which is precisely the condition the fishbone analysis identified as the
defect (Appendix C).

Equally, the Analytics API is the structural reason RYOBI must sit on Sprout's Advanced
tier rather than Professional. API access is gated to Advanced; nothing below it exposes the
endpoint, and without the endpoint there is no pipeline at all (Sprout Social, 2026).

## Model-to-Task Matching

The design deliberately assigns each task to the appropriately sized model rather than
defaulting to the largest one available.

| Workload | Model | Rationale |
|---|---|---|
| Automated daily/weekly digest pipeline | Claude Haiku 4.5 (API) | Summarization over pre-structured Sprout data at roughly $1/$5 per million input/output tokens, costing under ~$100/yr — and halved again if run through the Batch API |
| Interactive drafting, querying, and content work by the 5 marketers | Full-strength model via Claude Team seats | Content quality is never compromised by the pipeline's cost optimization |
| Automated monthly strategic report | Claude Sonnet (API) | Deeper cross-period analysis where the extra reasoning pays for itself, at a few dollars per year |

This is model-to-task matching, not corner-cutting. The cheap model handles the mechanical
compression of already-structured data; the strong model handles anything a human will
read as creative or strategic output.

## Platform Configuration: What RYOBI Is Actually Buying

### Sprout Social Advanced

Advanced is the top published tier and inherits everything beneath it, so RYOBI receives
three stacked layers of capability (Sprout Social, 2026):

- **Foundation (all tiers):** the Smart Inbox unifying comments, DMs, and mentions across
  Instagram, Facebook, and TikTok into one queue; publishing and scheduling; core
  reporting.
- **Professional layer (inherited):** unlimited profiles, competitor reports, message
  tagging, enhanced analytics, content approval workflows, digital asset libraries, and
  Optimal Send Times. Competitor reports benchmark RYOBI against EGO and DEWALT on
  public profile performance.
- **Advanced-exclusive — the reasons RYOBI is specifically on this tier:**
  - *Analytics API access* — the keystone of the entire solution and the single feature
    that forces Advanced over Professional.
  - *Sentiment analysis in the Smart Inbox*, auto-classifying incoming comments and
    messages as positive, negative, or neutral. Scope note: Advanced-tier sentiment
    analyzes messages and comments on connected accounts; web-wide brand monitoring
    requires the Listening add-on.
  - *Automated workflows and Inbox rules*, plus helpdesk integrations (HubSpot,
    Zendesk, Salesforce), campaign link tracking, and response rate/time reporting —
    where the manual inbox hours are clawed back.
  - *Message spike alerts*, giving early warning when mention or message volume surges.
  - *AI reply assistance and a chatbot builder* for faster engagement and automated FAQ
    handling, plus external approval workflows that stakeholders can use without a login.

### Social Listening Add-On

The distinction that justifies the second major line item is scope. Everything in Advanced
watches RYOBI's own accounts; Listening watches the entire conversation. It monitors the
open social web — including Reddit, Tumblr, and general web content — using natural
language processing, whether or not anyone tagged the brand (Sprout Social, 2026). It
delivers:

- **Web-wide brand monitoring** of every RYOBI mention across platforms and the web.
- **Query building** around defined brands and keywords ("RYOBI," "DEWALT," "EGO,"
  "ONE+ battery," "cordless drill"), tracked continuously and synthesized into trends,
  sentiment, and competitive benchmarks.
- **Share of voice** — what proportion of the category conversation belongs to RYOBI versus
  DEWALT versus EGO. This is the substantive competitive intelligence: Professional-tier
  competitor reports compare public profile metrics such as followers and post
  performance, whereas Listening reveals what people are actually saying about each
  brand, and how much.
- **Sentiment at scale** across the whole conversation rather than only the owned inbox.
- **Trend detection** of emerging topics in the DIY and outdoor-tool space before they are
  obvious — direct fuel for content strategy and the specific capability RYOBI ranked
  highest during trendstorming.
- **Spike alerts on listening topics**, flagging competitor launches or viral category
  moments.
- **UGC and advocate discovery**, surfacing users already posting about RYOBI and potential
  influencers.

## Access Model: Hub-and-Spoke

Seat allocation is designed so that expensive capability sits with the operators while
intelligence reaches everyone.

- **3 Sprout Advanced seats — the operators.** These are the named individuals who publish,
  work the inbox, configure Listening queries, and build reports. The seat count caps
  concurrent hands-on users at three, so the three roles must be named during Phase 1.
- **5 Claude Team seats — the department.** Every marketer consumes synthesized
  intelligence and drafts content through Claude without needing a Sprout login, at
  roughly $28 per seat per month rather than $399 (Anthropic, 2026; Sprout Social, 2026).
- **Automated digests to Slack or email** reach everyone relevant, including non-Sprout
  users, with no login required.

**Raw performance data for non-seat team members.** Two native Sprout mechanisms cover
this, configured once by an operator:

- *Shared report links.* An operator generates a public shareable link; recipients view the
  report read-only without a Sprout account, and can still navigate its tabs and see data
  filtered by profile, sentiment, and content type as the operator configured it.
- *Scheduled PDF delivery.* Reports export as presentation-ready PDFs and can be sent to up
  to 25 email addresses, including addresses with no Sprout account. Recurring weekly or
  monthly delivery is itself an Advanced-plan capability, so the whole department can
  receive the raw performance report on a fixed cadence without ever touching Sprout.

**The honest boundary.** Receiving or viewing shared reports requires no seat. Self-serve
exploration — logging in to build custom reports, run ad-hoc queries, drill into live data,
or work the inbox — does require one. For "show me how RYOBI performed," a shared link or
scheduled PDF covers it completely. For "let me build my own views," a fourth seat would
have to be purchased, and the budget headroom identified below is the first place that
would be funded from.

## Governance and the Human-in-the-Loop

Governance is built in from day one rather than retrofitted. AI operates only in the
intelligence and drafting-assist layers; humans create, approve, own the brand voice, and
publish. Auto-posting is never enabled, and approval workflows are configured so that
publishing is human-only. This maps directly onto the boundary the partner articulated in
Appendix A: AI for analytics and insight is fully welcome, AI-assisted drafting is welcome
with human review, and AI replacing creative decisions or posting autonomously is out of
scope. It is also the mitigation for Risk 1 (AI hallucination and inaccurate
recommendations) — every AI output is a recommendation to a named reviewer, never an
action.

## Prototype: Illustrative Walkthrough — Community Health on TikTok

Community Health — comments, DMs, and Story interactions — measures whether the audience
engages back, not merely whether it views. It is the KPI a dashboard is least able to
explain on its own, which makes it the clearest demonstration of what the reasoning layer
adds.

**Overnight (automated).** The orchestrator pulls TikTok comment data and Listening context
from Sprout's API and passes it to Claude, which returns a synthesis. The brief lands in
Slack or email before 8:00 a.m.

**What a dashboard would have shown:** *Comments +42% week over week* — read as a win.

**What the brief actually says:**

> **Daily Brief — Community Health, TikTok**
> **What moved:** Comment volume +42% WoW, concentrated on the ONE+ compatibility
> demonstration posted Tuesday.
> **Why it moved:** Approximately 60% of the increase is questions, not praise —
> split between battery/tool compatibility ("will this run my older ONE+?") and
> purchase location ("where can I get this in Canada?").
> **What this means:** This is a purchase-intent signal being read as an engagement
> win, and it exposes a content gap. Sentiment is positive but unresolved; unanswered
> purchase questions decay quickly.
> **Recommended actions:** (1) Prioritize the flagged high-intent comments in the
> Sprout inbox this morning. (2) Brief a compatibility tutorial for this week's
> content slot. (3) Watch DEWALT's share of voice on the same keyword cluster —
> currently rising.

**What the team does with it (human-led).** The three operators respond to the high-intent
comments in Sprout's Smart Inbox within the hour. A creator uses Claude to draft caption
and script options for a compatibility tutorial, edits them into RYOBI's voice, and routes
the post through the approval workflow before it publishes. The response happens the same
morning while the trend window is open, rather than being reported a month later.

This is the difference between *measuring* Community Health and *building* it — and it is
the same mechanism applied across all six KPI pillars: Awareness, Engagement, Audience
Growth, Video Performance, Content Performance, and Community Health.

## Fit to the Root Cause

The design maps one-to-one onto the two halves of the root cause. Sprout closes the
**data-fragmentation gap** by supplying the central infrastructure layer across all three
platforms. Claude closes the **insight-fragmentation gap** by converting reporting into
decision support. Together they answer the guiding question directly: a centralized,
AI-enabled intelligence layer, inside $50K, with content that remains authentic and
human-led.

One scoping discipline applies to the benefit claim. The time savings should be attributed
to the analysis, collection, and reporting hours that the infrastructure gap inflates — not
to all four of the team's activities — so the arithmetic holds under scrutiny.

## Anticipated Question: Sprout Ships Its Own AI, So Why Add Claude?

Sprout's built-in AI sits behind a ~$399 Advanced seat and therefore helps only the three
operators. Claude, at roughly $28 per seat, extends AI-driven insight and drafting to the
whole marketing department. It is also programmable against RYOBI's specific KPI pillars,
brand voice, and competitor watchlist; it delivers into Slack, email, and reports rather
than only into a platform UI; and it drafts content. The addition democratizes intelligence
across the department instead of gating it behind the expensive seats.