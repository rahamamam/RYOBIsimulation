// The orchestrator pipeline simulation.
// Five stages carry a payload from Sprout Social, through Claude, to RYOBI's team.
// Artifacts are illustrative but structurally realistic (Sprout Analytics API,
// Anthropic Messages API, Slack Block Kit).

export type StageId = "sprout" | "package" | "claude" | "deliver" | "team";

export interface Stage {
  id: StageId;
  short: string;
  label: string;
  actor: string;
  side: "source" | "orchestrator" | "reasoning" | "destination";
}

export const stages: Stage[] = [
  { id: "sprout", short: "SPROUT", label: "Pull", actor: "Sprout Social API", side: "source" },
  { id: "package", short: "PACKAGE", label: "Package for Claude", actor: "Orchestrator", side: "orchestrator" },
  { id: "claude", short: "CLAUDE", label: "Reason", actor: "Claude API", side: "reasoning" },
  { id: "deliver", short: "FORMAT", label: "Package for team", actor: "Orchestrator", side: "orchestrator" },
  { id: "team", short: "DELIVER", label: "Deliver", actor: "RYOBI marketing", side: "destination" },
];

export interface Step {
  stage: StageId;
  heading: string;
  caption: string;
  log: string[];
  // artifact kind decides how the center panel renders
  artifact:
    | { kind: "json"; title: string; badge: string; code: string }
    | { kind: "brief"; }
    | { kind: "idle" };
}

const sproutJson = `{
  "profile": "RYOBI",
  "window": "2026-07-22 → 2026-07-23",
  "kpi_pillars": {
    "community_health": {
      "tiktok": {
        "comments": 1840,
        "comments_wow": "+42%",
        "top_post": "ONE+ compatibility demo (Tue)",
        "dm_volume": 312
      }
    },
    "engagement": { "eng_rate": 0.058, "wow": "+3.1%" }
  },
  "listening": {
    "topics": ["RYOBI", "ONE+ battery", "DEWALT"],
    "mentions": 412,
    "sentiment": { "pos": 0.71, "neu": 0.22, "neg": 0.07 },
    "sample_comments": [
      "will this run my older ONE+?",
      "where can I get this in Canada?",
      "does the compact battery fit the drill?"
    ]
  },
  "competitors": {
    "share_of_voice": { "RYOBI": 0.34, "DEWALT": 0.28, "MILWAUKEE": 0.21 },
    "dewalt_sov_trend": "rising"
  }
}`;

const requestJson = `POST https://api.anthropic.com/v1/messages
{
  "model": "claude-haiku-4-5",
  "max_tokens": 1024,
  "system": "You are RYOBI's marketing analyst. Report against
    6 KPI pillars. Flag purchase-intent and content gaps.
    Never recommend auto-posting. Output JSON only.",
  "messages": [
    {
      "role": "user",
      "content": "Synthesize today's Community Health signal.
        Sprout data attached below.\\n\\n<sprout_data>
        { ...normalized metrics + listening + competitors... }
        </sprout_data>"
    }
  ]
}`;

const claudeJson = `{
  "pillar": "Community Health",
  "what_moved": "TikTok comment volume +42% WoW, concentrated
    on Tuesday's ONE+ compatibility demo.",
  "why_it_moved": "~60% of the lift is questions, not praise —
    split between battery compatibility and purchase location.",
  "what_it_means": "Purchase-intent signal being read as an
    engagement win. Exposes a content gap; unanswered purchase
    questions decay quickly.",
  "recommended_actions": [
    "Prioritize flagged high-intent comments in Sprout inbox",
    "Brief a compatibility tutorial for this week's slot",
    "Watch DEWALT share of voice on the same keyword cluster"
  ],
  "confidence": 0.86,
  "requires_human_review": true
}`;

const slackJson = `POST https://slack.com/api/chat.postMessage
{
  "channel": "#marketing-daily",
  "blocks": [
    { "type": "header",
      "text": "🟢 Daily Brief — Community Health · TikTok" },
    { "type": "section",
      "text": "*What moved* +42% comments WoW (ONE+ demo)" },
    { "type": "section",
      "text": "*Why* ~60% are purchase-intent questions" },
    { "type": "section",
      "text": "*Actions* 1) Reply high-intent  2) Brief tutorial
        3) Watch DEWALT SoV" }
  ],
  "cc_email": ["marketing@ryobi.example (+4 non-seat)"]
}`;

export const steps: Record<StageId, Step> = {
  sprout: {
    stage: "sprout",
    heading: "Pull from Sprout Social",
    caption: "The orchestrator authenticates to the Analytics API (Advanced-tier only) and requests metrics + listening data for the KPI pillars and competitor watchlist.",
    log: [
      "→ auth: OAuth2 bearer token accepted",
      "→ GET /v3/analytics/profiles/ryobi/community-health",
      "✓ 200 OK · 6 KPI pillars returned",
      "→ GET /v3/listening/topics?ids=ryobi,one+,dewalt",
      "✓ 200 OK · 412 mentions · sentiment attached",
      "✓ competitor share-of-voice snapshot pulled",
    ],
    artifact: { kind: "json", title: "sprout_response.json", badge: "RAW · SPROUT SOCIAL", code: sproutJson },
  },
  package: {
    stage: "package",
    heading: "Package the request for Claude",
    caption: "Raw payloads are normalized and merged, the KPI-pillar + brand-voice system prompt is attached, and a single Claude API request is assembled. Model: Haiku 4.5 for the daily digest.",
    log: [
      "· normalizing 3 payloads → single object",
      "· merging metrics + listening + competitors",
      "· attaching system prompt (pillars, voice, guardrails)",
      "· selecting model: claude-haiku-4-5 (digest tier)",
      "✓ request assembled · 3.1k input tokens",
    ],
    artifact: { kind: "json", title: "claude_request.http", badge: "ORCHESTRATOR → CLAUDE", code: requestJson },
  },
  claude: {
    stage: "claude",
    heading: "Claude reasons over the signal",
    caption: "Claude interprets what Sprout surfaced — separating a purchase-intent signal from a raw engagement win, flagging the content gap, and drafting recommended actions. It returns structured JSON, flagged for human review.",
    log: [
      "→ POST /v1/messages · model=claude-haiku-4-5",
      "· streaming response…",
      "· detected: purchase-intent > engagement win",
      "· detected: content gap (compatibility)",
      "✓ synthesis complete · 512 output tokens · $0.003",
    ],
    artifact: { kind: "json", title: "claude_response.json", badge: "RAW · CLAUDE", code: claudeJson },
  },
  deliver: {
    stage: "deliver",
    heading: "Package the brief for the team",
    caption: "The orchestrator parses Claude's JSON and formats it into a Slack Block Kit message plus an email, routing it to where the team already works — reaching non-seat users, no login required.",
    log: [
      "· parsing claude_response.json",
      "· mapping fields → Slack Block Kit",
      "· routing: #marketing-daily + email cc (5)",
      "✓ delivered before 08:00 · nobody had to ask",
    ],
    artifact: { kind: "json", title: "slack_delivery.http", badge: "ORCHESTRATOR → SLACK", code: slackJson },
  },
  team: {
    stage: "team",
    heading: "RYOBI's marketing team receives the brief",
    caption: "The brief lands in Slack before 8:00 a.m. Every recommendation is a prompt for a named human — the team responds in the Sprout inbox and drafts the tutorial in RYOBI's voice. AI never publishes.",
    log: [
      "✓ #marketing-daily · delivered 07:52",
      "✓ email cc · 5 recipients (3 seat + 2 non-seat)",
      "○ awaiting human action — nothing auto-posted",
    ],
    artifact: { kind: "brief" },
  },
};

export const stageOrder: StageId[] = ["sprout", "package", "claude", "deliver", "team"];
