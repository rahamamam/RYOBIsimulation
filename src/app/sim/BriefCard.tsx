import { Hash, Clock, ShieldCheck } from "lucide-react";

// The deliverable as RYOBI's marketing team sees it in Slack.
export function BriefCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      {/* Slack-style channel bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
        <span className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
          <Hash size={15} className="text-muted-foreground" /> marketing-daily
        </span>
        <span className="flex items-center gap-1 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <Clock size={12} /> 07:52
        </span>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ background: "var(--ryobi-green)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}>
            IL
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span style={{ fontWeight: 600, fontSize: 14 }}>Intelligence Layer</span>
              <span className="rounded px-1.5 py-0.5" style={{ background: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: 9.5 }}>APP</span>
              <span className="text-muted-foreground" style={{ fontSize: 11 }}>7:52 AM</span>
            </div>

            <div className="mt-2 rounded-md border-l-4 p-4" style={{ borderColor: "var(--ryobi-green)", background: "var(--accent)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
                🟢 Daily Brief — Community Health · TikTok
              </div>
              <dl className="mt-3 space-y-2.5">
                {[
                  { k: "What moved", v: "Comment volume +42% WoW, concentrated on Tuesday's ONE+ compatibility demo." },
                  { k: "Why it moved", v: "~60% of the lift is questions, not praise — battery compatibility and where-to-buy." },
                  { k: "What it means", v: "Purchase-intent signal read as an engagement win. Exposes a content gap that decays fast." },
                ].map((r) => (
                  <div key={r.k}>
                    <dt style={{ fontSize: 13, fontWeight: 600 }}>{r.k}</dt>
                    <dd className="text-muted-foreground" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Recommended actions</div>
                <ol className="mt-1.5 space-y-1">
                  {[
                    "Reply to flagged high-intent comments in the Sprout inbox",
                    "Brief a compatibility tutorial for this week's slot",
                    "Watch DEWALT's share of voice on the same keywords",
                  ].map((a, i) => (
                    <li key={i} className="flex gap-2" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
                      <span style={{ color: "var(--ryobi-green)", fontFamily: "var(--font-mono)" }}>{i + 1}</span>{a}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-3 flex items-center gap-1.5" style={{ fontSize: 11.5, color: "var(--accent-foreground)" }}>
                <ShieldCheck size={13} /> Recommendation only · confidence 0.86 · requires human review
              </div>
            </div>

            {/* reactions */}
            <div className="mt-2 flex gap-1.5">
              {["👀 3", "✅ 2", "🔥 1"].map((r) => (
                <span key={r} className="rounded-full border px-2 py-0.5" style={{ borderColor: "var(--border)", fontSize: 12 }}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-2 text-muted-foreground" style={{ borderColor: "var(--border)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        cc email → 5 recipients (3 seat · 2 non-seat) · nothing auto-posted
      </div>
    </div>
  );
}
