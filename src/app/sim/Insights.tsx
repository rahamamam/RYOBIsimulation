import { useMemo, useState } from "react";
import {
  Instagram, Facebook, Music2, Globe, Lightbulb, Eye, AlertTriangle,
  ChevronDown, Sparkles, ShieldCheck,
} from "lucide-react";
import {
  categories, insights, type Platform, type Severity, type Insight,
} from "./insights";

const platformIcon: Record<Platform, React.ComponentType<{ size?: number }>> = {
  instagram: Instagram, facebook: Facebook, tiktok: Music2, cross: Globe,
};

const sevMeta: Record<Severity, { label: string; color: string; icon: React.ComponentType<{ size?: number }> }> = {
  opportunity: { label: "Opportunity", color: "var(--ryobi-green)", icon: Lightbulb },
  watch: { label: "Watch", color: "#1877f2", icon: Eye },
  alert: { label: "Alert", color: "#d4183d", icon: AlertTriangle },
};

const statusMeta = {
  new: { label: "New", bg: "var(--ryobi-green)", fg: "#fff" },
  reviewing: { label: "In review", bg: "var(--muted)", fg: "var(--foreground)" },
  actioned: { label: "Actioned", bg: "transparent", fg: "var(--muted-foreground)" },
};

function InsightCard({ insight }: { insight: Insight }) {
  const [open, setOpen] = useState(false);
  const sev = sevMeta[insight.severity];
  const SevIcon = sev.icon;
  const st = statusMeta[insight.status];

  return (
    <div className="flex flex-col rounded-md border transition-colors hover:border-[color:var(--ryobi-green)]" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "color-mix(in srgb, " + sev.color + " 12%, transparent)", color: sev.color, fontFamily: "var(--font-mono)", fontSize: 11 }}>
            <SevIcon size={12} /> {sev.label}
          </span>
          <span className="rounded-full px-2.5 py-1" style={{ background: st.bg, color: st.fg, border: insight.status === "actioned" ? "1px solid var(--border)" : "none", fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
            {st.label}
          </span>
        </div>

        <h3 className="mt-3" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{insight.title}</h3>
        <p className="mt-2 text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.55 }}>{insight.summary}</p>

        {/* meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="flex items-center gap-1">
            {insight.platforms.map((p) => {
              const Icon = platformIcon[p];
              return <Icon key={p} size={15} />;
            })}
          </span>
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>·</span>
          <span className="rounded-sm px-2 py-0.5" style={{ background: "var(--accent)", color: "var(--accent-foreground)", fontSize: 11.5 }}>{insight.pillar}</span>
          <span className="ml-auto flex items-center gap-1 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            <Sparkles size={11} style={{ color: "var(--ryobi-green)" }} /> {insight.model}
          </span>
        </div>
      </div>

      {/* expand */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between border-t px-5 py-2.5 text-left transition-colors hover:bg-muted"
        style={{ borderColor: "var(--border)" }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{open ? "Hide" : "Why & recommended actions"}</span>
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div className="reveal border-t px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>Why it moved</div>
          <p className="mt-1.5" style={{ fontSize: 13.5, lineHeight: 1.55 }}>{insight.why}</p>
          <div className="mt-4" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>Recommended actions · for human review</div>
          <ul className="mt-2 space-y-1.5">
            {insight.actions.map((a, i) => (
              <li key={i} className="flex gap-2" style={{ fontSize: 13.5, lineHeight: 1.45 }}>
                <span style={{ color: "var(--ryobi-green)", fontFamily: "var(--font-mono)" }}>{i + 1}</span>{a}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: 11.5 }}>
            <ShieldCheck size={13} style={{ color: "var(--ryobi-green)" }} /> Confidence {insight.confidence.toFixed(2)} · delivered {insight.delivered} · never auto-posted
          </div>
        </div>
      )}
    </div>
  );
}

export function Insights() {
  const [active, setActive] = useState<string>("all");

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: insights.length };
    for (const c of categories) m[c.id] = insights.filter((i) => i.category === c.id).length;
    return m;
  }, []);

  const filtered = active === "all" ? insights : insights.filter((i) => i.category === active);
  const activeCat = categories.find((c) => c.id === active);

  const sevCounts = useMemo(() => {
    const base: Record<Severity, number> = { opportunity: 0, watch: 0, alert: 0 };
    for (const i of filtered) base[i.severity]++;
    return base;
  }, [filtered]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ryobi-green)" }} />
        <span className="uppercase text-muted-foreground" style={{ letterSpacing: "0.12em" }}>Layer 3 · Reasoning output</span>
      </div>
      <h1 className="mt-4" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
        The insight <span style={{ color: "var(--ryobi-green)" }}>library</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground" style={{ fontSize: 16, lineHeight: 1.6 }}>
        Everything Claude synthesized from this cycle's Sprout signal, categorized. Each card explains what moved, why,
        and what to consider — a recommendation to a named human, never an action taken automatically.
      </p>

      {/* Severity summary */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total insights", value: filtered.length, color: "var(--foreground)" },
          { label: "Opportunities", value: sevCounts.opportunity, color: "var(--ryobi-green)" },
          { label: "To watch", value: sevCounts.watch, color: "#1877f2" },
          { label: "Alerts", value: sevCounts.alert, color: "#d4183d" },
        ].map((s) => (
          <div key={s.label} className="rounded-md border p-4" style={{ borderColor: "var(--border)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div className="mt-1 text-muted-foreground" style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterChip label="All" count={counts.all} active={active === "all"} onClick={() => setActive("all")} />
        {categories.map((c) => (
          <FilterChip key={c.id} label={c.label} count={counts[c.id]} active={active === c.id} onClick={() => setActive(c.id)} />
        ))}
      </div>
      {activeCat && (
        <p className="mt-3 text-muted-foreground" style={{ fontSize: 13.5 }}>{activeCat.blurb}</p>
      )}

      {/* Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((i) => (
          <InsightCard key={i.id} insight={i} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-colors"
      style={{
        borderColor: active ? "var(--ryobi-green)" : "var(--border)",
        background: active ? "var(--ryobi-green)" : "transparent",
        color: active ? "#fff" : "var(--foreground)",
        fontSize: 13.5,
      }}
    >
      {label}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.7 }}>{count}</span>
    </button>
  );
}
