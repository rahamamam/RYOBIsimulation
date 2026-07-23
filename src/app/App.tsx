import { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { Simulation } from "./sim/Simulation";
import { Insights } from "./sim/Insights";

type Tab = "pipeline" | "insights";

export default function App() {
  const [tab, setTab] = useState<Tab>("pipeline");

  return (
    <div className="min-h-full w-full bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}>
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center rounded-sm" style={{ width: 30, height: 30, background: "var(--ryobi-green)" }}>
              <Zap size={17} color="#fff" />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "-0.02em" }}>RYOBI</span>
            <span className="hidden sm:inline text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em" }}>
              / INTELLIGENCE LAYER
            </span>
          </div>

          {/* Tab switch */}
          <nav className="flex rounded-full border p-1" style={{ borderColor: "var(--border)" }}>
            {([
              { id: "pipeline", label: "Pipeline" },
              { id: "insights", label: "Insights" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="rounded-full px-4 py-1.5 transition-colors"
                style={{
                  background: tab === t.id ? "var(--foreground)" : "transparent",
                  color: tab === t.id ? "var(--background)" : "var(--muted-foreground)",
                  fontSize: 13.5,
                  fontWeight: tab === t.id ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-6 py-10 md:px-10 md:py-14">
        {tab === "pipeline" ? <PipelineView /> : <Insights />}
      </main>

      <footer className="mx-auto w-full max-w-[1240px] px-6 pb-10 md:px-10">
        <p className="border-t pt-6 text-muted-foreground" style={{ borderColor: "var(--border)", fontSize: 12.5, lineHeight: 1.6 }}>
          Illustrative simulation · payloads modeled on the Sprout Analytics API, Anthropic Messages API, and Slack Block
          Kit. Governance is enforced: every Claude output is a recommendation flagged for human review — nothing is
          auto-posted.
        </p>
      </footer>
    </div>
  );
}

function PipelineView() {
  return (
    <>
      <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ryobi-green)" }} />
        <span className="uppercase text-muted-foreground" style={{ letterSpacing: "0.12em" }}>Signal in · Decision out</span>
      </div>
      <h1 className="mt-4 max-w-[20ch]" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
        The orchestrator, <span style={{ color: "var(--ryobi-green)" }}>step by step</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground" style={{ fontSize: 16, lineHeight: 1.6 }}>
        The Claude API can reason but not integrate — it cannot pull from Sprout, run on a schedule, or deliver on its
        own. Watch the connective layer do exactly that: package Sprout Social's raw outputs for Claude, then repackage
        Claude's reasoning into a brief RYOBI's marketing team actually reads.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
        {["Sprout Social", "Orchestrator", "Claude", "Orchestrator", "Marketing team"].map((n, i, arr) => (
          <span key={i} className="flex items-center gap-2">
            <span style={{ color: i === 1 || i === 3 ? "var(--ryobi-green)" : "var(--foreground)" }}>{n}</span>
            {i < arr.length - 1 && <ArrowRight size={13} />}
          </span>
        ))}
      </div>

      <div className="mt-10">
        <Simulation />
      </div>
    </>
  );
}
